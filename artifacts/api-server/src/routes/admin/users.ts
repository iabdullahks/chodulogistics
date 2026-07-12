import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq, and, ne } from "drizzle-orm";
import { db, adminUsersTable, rolesTable, auditLogsTable } from "@workspace/db";
import {
  AdminCreateUserBody,
  AdminCreateUserResponse,
  AdminListUsersResponse,
  AdminUpdateUserBody,
  AdminUpdateUserResponse,
} from "@workspace/api-zod";
import { requireAdminAuth, requirePermission } from "../../middlewares/adminAuth";

const router: IRouter = Router();

router.use("/admin/users", requireAdminAuth);

function selectUserWithRole() {
  return db
    .select({
      id: adminUsersTable.id,
      email: adminUsersTable.email,
      name: adminUsersTable.name,
      roleId: adminUsersTable.roleId,
      roleName: rolesTable.name,
      isActive: adminUsersTable.isActive,
      lastLoginAt: adminUsersTable.lastLoginAt,
      createdAt: adminUsersTable.createdAt,
    })
    .from(adminUsersTable)
    .innerJoin(rolesTable, eq(adminUsersTable.roleId, rolesTable.id));
}

router.get(
  "/admin/users",
  requirePermission("users", "read"),
  async (_req, res): Promise<void> => {
    const users = await selectUserWithRole().orderBy(adminUsersTable.createdAt);
    res.json(AdminListUsersResponse.parse(users));
  },
);

router.post(
  "/admin/users",
  requirePermission("users", "write"),
  async (req, res): Promise<void> => {
    const parsed = AdminCreateUserBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const email = parsed.data.email.toLowerCase();

    const [existing] = await db
      .select({ id: adminUsersTable.id })
      .from(adminUsersTable)
      .where(eq(adminUsersTable.email, email));
    if (existing) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const [role] = await db
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, parsed.data.roleId));
    if (!role) {
      res.status(400).json({ error: "Invalid roleId" });
      return;
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const [created] = await db
      .insert(adminUsersTable)
      .values({
        email,
        name: parsed.data.name,
        passwordHash,
        roleId: parsed.data.roleId,
      })
      .returning();

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "create",
      entityType: "admin_user",
      entityId: String(created.id),
      before: null,
      after: { id: created.id, email: created.email, name: created.name, roleId: created.roleId },
    });

    res.status(201).json(
      AdminCreateUserResponse.parse({
        id: created.id,
        email: created.email,
        name: created.name,
        roleId: created.roleId,
        roleName: role.name,
        isActive: created.isActive,
        lastLoginAt: created.lastLoginAt,
        createdAt: created.createdAt,
      }),
    );
  },
);

router.patch(
  "/admin/users/:id",
  requirePermission("users", "write"),
  async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const parsed = AdminUpdateUserBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [existing] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Admin user not found" });
      return;
    }

    if (req.adminUser!.id === id && parsed.data.isActive === false) {
      res.status(400).json({ error: "You cannot deactivate your own account" });
      return;
    }

    if (parsed.data.email) {
      const email = parsed.data.email.toLowerCase();
      const [emailTaken] = await db
        .select({ id: adminUsersTable.id })
        .from(adminUsersTable)
        .where(and(eq(adminUsersTable.email, email), ne(adminUsersTable.id, id)));
      if (emailTaken) {
        res.status(409).json({ error: "Email already in use" });
        return;
      }
    }

    if (parsed.data.roleId !== undefined) {
      const [role] = await db
        .select()
        .from(rolesTable)
        .where(eq(rolesTable.id, parsed.data.roleId));
      if (!role) {
        res.status(400).json({ error: "Invalid roleId" });
        return;
      }
    }

    const updateValues: Partial<typeof adminUsersTable.$inferInsert> = {};
    if (parsed.data.email) updateValues.email = parsed.data.email.toLowerCase();
    if (parsed.data.name) updateValues.name = parsed.data.name;
    if (parsed.data.roleId !== undefined) updateValues.roleId = parsed.data.roleId;
    if (parsed.data.isActive !== undefined) updateValues.isActive = parsed.data.isActive;
    if (parsed.data.password) {
      updateValues.passwordHash = await bcrypt.hash(parsed.data.password, 10);
    }

    await db
      .update(adminUsersTable)
      .set(updateValues)
      .where(eq(adminUsersTable.id, id));

    const [updated] = await selectUserWithRole().where(eq(adminUsersTable.id, id));

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "update",
      entityType: "admin_user",
      entityId: String(id),
      before: { email: existing.email, name: existing.name, roleId: existing.roleId, isActive: existing.isActive },
      after: { email: updated.email, name: updated.name, roleId: updated.roleId, isActive: updated.isActive },
    });

    res.json(AdminUpdateUserResponse.parse(updated));
  },
);

router.delete(
  "/admin/users/:id",
  requirePermission("users", "write"),
  async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    if (req.adminUser!.id === id) {
      res.status(400).json({ error: "You cannot delete your own account" });
      return;
    }

    const [existing] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Admin user not found" });
      return;
    }

    await db.delete(adminUsersTable).where(eq(adminUsersTable.id, id));

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "delete",
      entityType: "admin_user",
      entityId: String(id),
      before: { email: existing.email, name: existing.name, roleId: existing.roleId },
      after: null,
    });

    res.status(204).end();
  },
);

export default router;
