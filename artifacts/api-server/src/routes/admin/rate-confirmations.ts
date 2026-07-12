import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, rateConfirmationsTable, auditLogsTable } from "@workspace/db";
import {
  AdminCreateRateConfirmationBody,
  AdminCreateRateConfirmationResponse,
  AdminListRateConfirmationsResponse,
  AdminGetRateConfirmationResponse,
  AdminUpdateRateConfirmationBody,
  AdminUpdateRateConfirmationResponse,
} from "@workspace/api-zod";
import { requireAdminAuth, requirePermission } from "../../middlewares/adminAuth";

const router: IRouter = Router();

router.use("/admin/rate-confirmations", requireAdminAuth);

function toDbValues<T extends { rcDateTime?: Date; outboundAppointmentDate?: Date; returnAppointmentDate?: Date }>(
  data: T,
) {
  return {
    ...data,
    rcDateTime: data.rcDateTime,
    outboundAppointmentDate: data.outboundAppointmentDate
      ? data.outboundAppointmentDate.toISOString().slice(0, 10)
      : data.outboundAppointmentDate,
    returnAppointmentDate: data.returnAppointmentDate
      ? data.returnAppointmentDate.toISOString().slice(0, 10)
      : data.returnAppointmentDate,
  };
}

router.get("/admin/rate-confirmations", async (_req, res): Promise<void> => {
  const rateConfirmations = await db
    .select()
    .from(rateConfirmationsTable)
    .orderBy(desc(rateConfirmationsTable.createdAt));
  res.json(AdminListRateConfirmationsResponse.parse(rateConfirmations));
});

router.get("/admin/rate-confirmations/:id", async (req, res): Promise<void> => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [rateConfirmation] = await db
    .select()
    .from(rateConfirmationsTable)
    .where(eq(rateConfirmationsTable.id, id));
  if (!rateConfirmation) {
    res.status(404).json({ error: "Rate confirmation not found" });
    return;
  }

  res.json(AdminGetRateConfirmationResponse.parse(rateConfirmation));
});

router.post(
  "/admin/rate-confirmations",
  requirePermission("rateConfirmations", "write"),
  async (req, res): Promise<void> => {
    const parsed = AdminCreateRateConfirmationBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [rateConfirmation] = await db
      .insert(rateConfirmationsTable)
      .values(toDbValues(parsed.data))
      .returning();

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "create",
      entityType: "rate_confirmation",
      entityId: String(rateConfirmation.id),
      before: null,
      after: rateConfirmation,
    });

    res.status(201).json(AdminCreateRateConfirmationResponse.parse(rateConfirmation));
  },
);

router.patch(
  "/admin/rate-confirmations/:id",
  requirePermission("rateConfirmations", "write"),
  async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const parsed = AdminUpdateRateConfirmationBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [existing] = await db
      .select()
      .from(rateConfirmationsTable)
      .where(eq(rateConfirmationsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Rate confirmation not found" });
      return;
    }

    const [updated] = await db
      .update(rateConfirmationsTable)
      .set(toDbValues(parsed.data))
      .where(eq(rateConfirmationsTable.id, id))
      .returning();

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "update",
      entityType: "rate_confirmation",
      entityId: String(id),
      before: existing,
      after: updated,
    });

    res.json(AdminUpdateRateConfirmationResponse.parse(updated));
  },
);

router.delete(
  "/admin/rate-confirmations/:id",
  requirePermission("rateConfirmations", "write"),
  async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [existing] = await db
      .select()
      .from(rateConfirmationsTable)
      .where(eq(rateConfirmationsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Rate confirmation not found" });
      return;
    }

    await db.delete(rateConfirmationsTable).where(eq(rateConfirmationsTable.id, id));

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "delete",
      entityType: "rate_confirmation",
      entityId: String(id),
      before: existing,
      after: null,
    });

    res.status(204).end();
  },
);

export default router;
