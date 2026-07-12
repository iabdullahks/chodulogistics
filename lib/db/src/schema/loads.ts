import { pgTable, serial, text, integer, numeric, date, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const loadsTable = pgTable("loads", {
  id: serial("id").primaryKey(),
  // Basic info
  trackingId: text("tracking_id").notNull().unique(),
  status: text("status").notNull().default("Booked"),
  // Carrier details
  carrierName: text("carrier_name").notNull(),
  dot: text("dot"),
  truck: text("truck"),
  slotFeeStatus: text("slot_fee_status"),
  tripsPerWeek: integer("trips_per_week"),
  // Route information
  outboundRoute: text("outbound_route"),
  returnRoute: text("return_route"),
  pickupAddress: text("pickup_address"),
  deliveryAddress: text("delivery_address"),
  milesPerSide: integer("miles_per_side"),
  totalRoundTripMiles: integer("total_round_trip_miles"),
  // Commodity & weights
  commodity: text("commodity"),
  outboundWeightLbs: integer("outbound_weight_lbs"),
  backhaulWeightLbs: integer("backhaul_weight_lbs"),
  // Rate & schedule
  outboundRate: numeric("outbound_rate", { mode: "number", precision: 10, scale: 2 }).notNull(),
  startDate: date("start_date", { mode: "string" }).notNull(),
  // Contract details
  contractType: text("contract_type"),
  purpose: text("purpose"),
  refundableStatus: text("refundable_status"),
  appliesTowardContract: boolean("applies_toward_contract"),
  // Attachment
  billOfLadingPath: text("bill_of_lading_path"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertLoadSchema = createInsertSchema(loadsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertLoad = z.infer<typeof insertLoadSchema>;
export type Load = typeof loadsTable.$inferSelect;
