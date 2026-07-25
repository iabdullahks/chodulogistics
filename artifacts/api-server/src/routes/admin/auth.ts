import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, adminUsersTable, adminSessionsTable, rolesTable } from "@workspace/db";
import { AdminLoginBody, AdminLoginResponse, AdminMeResponse } from "@workspace/api-zod";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_TTL_MS,
  generateSessionToken,
  hashSessionToken,
} from "../../lib/session";
import { requireAdminAuth } from "../../middlewares/adminAuth";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .select({
      id: adminUsersTable.id,
      email: adminUsersTable.email,
      name: adminUsersTable.name,
      passwordHash: adminUsersTable.passwordHash,
      isActive: adminUsersTable.isActive,
      roleName: rolesTable.name,
    })
    .from(adminUsersTable)
    .innerJoin(rolesTable, eq(adminUsersTable.roleId, rolesTable.id))
    .where(eq(adminUsersTable.email, parsed.data.email.toLowerCase()));

  if (!row || !row.isActive) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(parsed.data.password, row.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = generateSessionToken();
  await db.insert(adminSessionsTable).values({
    adminUserId: row.id,
    tokenHash: hashSessionToken(token),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  });

  await db
    .update(adminUsersTable)
    .set({ lastLoginAt: new Date() })
    .where(eq(adminUsersTable.id, row.id));

  const isProd = process.env.NODE_ENV === "production";
  res.cookie(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: SESSION_TTL_MS,
    path: "/",
  });

  req.log.info({ adminUserId: row.id }, "Admin logged in");

  res.json(
    AdminLoginResponse.parse({
      id: row.id,
      email: row.email,
      name: row.name,
      roleName: row.roleName,
    }),
  );
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  const token = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (token) {
    await db
      .delete(adminSessionsTable)
      .where(eq(adminSessionsTable.tokenHash, hashSessionToken(token)));
  }
  res.clearCookie(ADMIN_SESSION_COOKIE, { path: "/" });
  res.status(204).end();
});

router.get("/admin/me", requireAdminAuth, (req, res): void => {
  const adminUser = req.adminUser!;
  res.json(
    AdminMeResponse.parse({
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      roleName: adminUser.roleName,
    }),
  );
});

export default router;
