import type { Request, Response, NextFunction } from "express";
import { eq, and, gt } from "drizzle-orm";
import { db, adminSessionsTable, adminUsersTable, rolesTable } from "@workspace/db";
import { ADMIN_SESSION_COOKIE, hashSessionToken } from "../lib/session";

export interface AuthedAdminUser {
  id: number;
  email: string;
  name: string;
  roleId: number;
  roleName: string;
  permissions: Record<string, "read" | "write" | "none"> | { "*": "write" };
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      adminUser?: AuthedAdminUser;
    }
  }
}

/** Loads the admin user for the session cookie, if any, without rejecting the request. */
export async function loadAdminUser(req: Request): Promise<AuthedAdminUser | null> {
  const token = req.cookies?.[ADMIN_SESSION_COOKIE];
  if (!token) return null;

  const tokenHash = hashSessionToken(token);

  const [row] = await db
    .select({
      id: adminUsersTable.id,
      email: adminUsersTable.email,
      name: adminUsersTable.name,
      isActive: adminUsersTable.isActive,
      roleId: adminUsersTable.roleId,
      roleName: rolesTable.name,
      permissions: rolesTable.permissions,
    })
    .from(adminSessionsTable)
    .innerJoin(adminUsersTable, eq(adminSessionsTable.adminUserId, adminUsersTable.id))
    .innerJoin(rolesTable, eq(adminUsersTable.roleId, rolesTable.id))
    .where(
      and(
        eq(adminSessionsTable.tokenHash, tokenHash),
        gt(adminSessionsTable.expiresAt, new Date()),
      ),
    );

  if (!row || !row.isActive) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    roleId: row.roleId,
    roleName: row.roleName,
    permissions: row.permissions as AuthedAdminUser["permissions"],
  };
}

/** Requires a valid admin session; attaches req.adminUser or responds 401. */
export async function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const adminUser = await loadAdminUser(req);
  if (!adminUser) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  req.adminUser = adminUser;
  next();
}

/** Requires the current admin user to have at least `level` access on `module`. */
export function requirePermission(moduleKey: string, level: "read" | "write") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const adminUser = req.adminUser;
    if (!adminUser) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const wildcard = (adminUser.permissions as Record<string, string>)["*"];
    const scoped = (adminUser.permissions as Record<string, string>)[moduleKey];
    const effective = wildcard ?? scoped ?? "none";

    const allowed =
      effective === "write" || (effective === "read" && level === "read");

    if (!allowed) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
}
