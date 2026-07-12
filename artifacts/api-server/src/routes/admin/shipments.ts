import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, shipmentsTable, auditLogsTable } from "@workspace/db";
import {
  AdminCreateShipmentBody,
  AdminCreateShipmentResponse,
  AdminListShipmentsResponse,
  AdminUpdateShipmentBody,
  AdminUpdateShipmentResponse,
} from "@workspace/api-zod";
import { requireAdminAuth, requirePermission } from "../../middlewares/adminAuth";

const router: IRouter = Router();

router.use("/admin/shipments", requireAdminAuth);

router.get("/admin/shipments", async (_req, res): Promise<void> => {
  const shipments = await db
    .select()
    .from(shipmentsTable)
    .orderBy(desc(shipmentsTable.createdAt));
  res.json(AdminListShipmentsResponse.parse(shipments));
});

router.post(
  "/admin/shipments",
  requirePermission("shipments", "write"),
  async (req, res): Promise<void> => {
    const parsed = AdminCreateShipmentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [shipment] = await db
      .insert(shipmentsTable)
      .values(parsed.data)
      .returning();

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "create",
      entityType: "shipment",
      entityId: String(shipment.id),
      before: null,
      after: shipment,
    });

    res.status(201).json(AdminCreateShipmentResponse.parse(shipment));
  },
);

router.patch(
  "/admin/shipments/:id",
  requirePermission("shipments", "write"),
  async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const parsed = AdminUpdateShipmentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [existing] = await db
      .select()
      .from(shipmentsTable)
      .where(eq(shipmentsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Shipment not found" });
      return;
    }

    const [updated] = await db
      .update(shipmentsTable)
      .set(parsed.data)
      .where(eq(shipmentsTable.id, id))
      .returning();

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "update",
      entityType: "shipment",
      entityId: String(id),
      before: existing,
      after: updated,
    });

    res.json(AdminUpdateShipmentResponse.parse(updated));
  },
);

router.delete(
  "/admin/shipments/:id",
  requirePermission("shipments", "write"),
  async (req, res): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [existing] = await db
      .select()
      .from(shipmentsTable)
      .where(eq(shipmentsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Shipment not found" });
      return;
    }

    await db.delete(shipmentsTable).where(eq(shipmentsTable.id, id));

    await db.insert(auditLogsTable).values({
      adminUserId: req.adminUser!.id,
      action: "delete",
      entityType: "shipment",
      entityId: String(id),
      before: existing,
      after: null,
    });

    res.status(204).end();
  },
);

export default router;
