import { Router, type IRouter } from "express";
import { db, rolesTable } from "@workspace/db";
import { AdminListRolesResponse } from "@workspace/api-zod";
import { requireAdminAuth } from "../../middlewares/adminAuth";

const router: IRouter = Router();

router.use("/admin/roles", requireAdminAuth);

router.get("/admin/roles", async (_req, res): Promise<void> => {
  const roles = await db.select().from(rolesTable);
  res.json(AdminListRolesResponse.parse(roles));
});

export default router;
