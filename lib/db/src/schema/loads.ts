import { pgTable, serial, text, numeric, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const loadsTable = pgTable("loads", {
  id: serial("id").primaryKey(),
  trackingId: text("tracking_id").notNull().unique(),
  status: text("status").notNull().default("Booked"),
  carrierName: text("carrier_name").notNull(),
  dot: text("dot"),
  truck: text("truck"),
  outboundRate: numeric("outbound_rate", { mode: "number", precision: 10, scale: 2 }).notNull(),
  startDate: date("start_date", { mode: "string" }).notNull(),
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
