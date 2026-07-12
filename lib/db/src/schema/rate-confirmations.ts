import { pgTable, serial, text, integer, numeric, date, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rateConfirmationsTable = pgTable("rate_confirmations", {
  id: serial("id").primaryKey(),
  // Header information
  proNumber: text("pro_number"),
  daysDedicatedLane: text("days_dedicated_lane"),
  rcDateTime: timestamp("rc_date_time", { withTimezone: true }).notNull().defaultNow(),
  fromCompany: text("from_company").notNull().default("TARA LOGISTICS LLC"),
  fromPhone: text("from_phone"),
  fromEmail: text("from_email"),
  // Carrier information (incl. driver)
  carrierName: text("carrier_name").notNull(),
  carrierPhone: text("carrier_phone"),
  mcNumber: text("mc_number"),
  dotNumber: text("dot_number"),
  driverName: text("driver_name"),
  truckNumber: text("truck_number"),
  trailerNumber: text("trailer_number"),
  driverCell: text("driver_cell"),
  // Load details
  miles: integer("miles"),
  sizeType: text("size_type"),
  pieces: integer("pieces"),
  description: text("description"),
  weightLbs: integer("weight_lbs"),
  hotLoad: boolean("hot_load").notNull().default(false),
  // Rate information
  lineHaulRate: numeric("line_haul_rate", { mode: "number", precision: 10, scale: 2 }),
  totalRateUsd: numeric("total_rate_usd", { mode: "number", precision: 10, scale: 2 }),
  // Outbound route
  outboundPickupAddress: text("outbound_pickup_address"),
  outboundDeliveryAddress: text("outbound_delivery_address"),
  outboundHours: text("outbound_hours"),
  outboundPhoneContact: text("outbound_phone_contact"),
  outboundAppointmentDate: date("outbound_appointment_date", { mode: "string" }),
  outboundAppointmentTime: text("outbound_appointment_time"),
  outboundPieces: integer("outbound_pieces"),
  outboundWeight: integer("outbound_weight"),
  dispatchNotes: text("dispatch_notes"),
  // Return route
  returnPickupAddress: text("return_pickup_address"),
  returnDeliveryAddress: text("return_delivery_address"),
  returnHours: text("return_hours"),
  returnPhoneContact: text("return_phone_contact"),
  returnAppointmentDate: date("return_appointment_date", { mode: "string" }),
  returnAppointmentTime: text("return_appointment_time"),
  returnPieces: integer("return_pieces"),
  returnWeight: integer("return_weight"),
  // Special instructions & remarks
  specialInstructions: text("special_instructions"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRateConfirmationSchema = createInsertSchema(rateConfirmationsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertRateConfirmation = z.infer<typeof insertRateConfirmationSchema>;
export type RateConfirmation = typeof rateConfirmationsTable.$inferSelect;
