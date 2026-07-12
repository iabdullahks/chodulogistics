import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, loadsTable, auditLogsTable } from "@workspace/db";
import {
  AdminCreateLoadBody,
  AdminCreateLoadResponse,
  AdminListLoadsResponse,
  AdminUpdateLoadBody,
  AdminUpdateLoadResponse,
} from "@workspace/api-zod";
import { requireAdminAuth, requirePermission } from "../../middlewares/adminAuth";

const router: IRouter = Router();

router.use("/admin/loads", requireAdminAuth);

router.get("/admin/loads", async (_req, res): Promise<void> => {
  const loads = await db
    .select()
    .from(loadsTable)
    .orderBy(desc(loadsTable.createdAt));
  res.json(AdminListLoadsResponse.parse(loads));
});

router.post(
  "/admin/loads",
  requirePermission("loads", "write"),
  async (req, res): Promise<void> => {
    const parsed = AdminCreateLoadBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [existing] = await db
      .select({ id: loadsTable.id })
      .from(loadsTable)
      .where(eq(loadsTable.trackingId, parsed.data.trackingId));
    if (existing) {
      res.status(409).json({ error: "Tracking ID already in use" });
      return;
    }

    const [load] = await db
      .insert(loadsTable)
      .values({
        ...parsed.data,
        startDate: parsed.data.startDate.toISOString().slice(0, 10),
      })
      .returning();

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "create",
      entityType: "load",
      entityId: String(load.id),
      before: null,
      after: load,
    });

    res.status(201).json(AdminCreateLoadResponse.parse(load));
  },
);

router.patch(
  "/admin/loads/:id",
  requirePermission("loads", "write"),
  async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const parsed = AdminUpdateLoadBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [existing] = await db
      .select()
      .from(loadsTable)
      .where(eq(loadsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Load not found" });
      return;
    }

    if (parsed.data.trackingId && parsed.data.trackingId !== existing.trackingId) {
      const [taken] = await db
        .select({ id: loadsTable.id })
        .from(loadsTable)
        .where(eq(loadsTable.trackingId, parsed.data.trackingId));
      if (taken) {
        res.status(409).json({ error: "Tracking ID already in use" });
        return;
      }
    }

    const [updated] = await db
      .update(loadsTable)
      .set({
        ...parsed.data,
        startDate: parsed.data.startDate
          ? parsed.data.startDate.toISOString().slice(0, 10)
          : undefined,
      })
      .where(eq(loadsTable.id, id))
      .returning();

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "update",
      entityType: "load",
      entityId: String(id),
      before: existing,
      after: updated,
    });

    res.json(AdminUpdateLoadResponse.parse(updated));
  },
);

router.delete(
  "/admin/loads/:id",
  requirePermission("loads", "write"),
  async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [existing] = await db
      .select()
      .from(loadsTable)
      .where(eq(loadsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Load not found" });
      return;
    }

    await db.delete(loadsTable).where(eq(loadsTable.id, id));

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "delete",
      entityType: "load",
      entityId: String(id),
      before: existing,
      after: null,
    });

    res.status(204).end();
  },
);

export default router;
