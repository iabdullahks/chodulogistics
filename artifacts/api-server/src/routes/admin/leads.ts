import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, leadsTable, auditLogsTable } from "@workspace/db";
import {
  AdminListLeadsResponse,
  AdminUpdateLeadBody,
  AdminUpdateLeadResponse,
} from "@workspace/api-zod";
import { requireAdminAuth, requirePermission } from "../../middlewares/adminAuth";

const router: IRouter = Router();

router.use("/admin/leads", requireAdminAuth);

router.get("/admin/leads", async (_req, res): Promise<void> => {
  const leads = await db
    .select()
    .from(leadsTable)
    .orderBy(desc(leadsTable.createdAt));
  res.json(AdminListLeadsResponse.parse(leads));
});

router.patch(
  "/admin/leads/:id",
  requirePermission("leads", "write"),
  async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const parsed = AdminUpdateLeadBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [existing] = await db
      .select()
      .from(leadsTable)
      .where(eq(leadsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    const [updated] = await db
      .update(leadsTable)
      .set(parsed.data)
      .where(eq(leadsTable.id, id))
      .returning();

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "update",
      entityType: "lead",
      entityId: String(id),
      before: existing,
      after: updated,
    });

    res.json(AdminUpdateLeadResponse.parse(updated));
  },
);

export default router;
