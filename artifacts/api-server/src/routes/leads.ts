import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import { CreateLeadBody, CreateLeadResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/leads", async (req, res): Promise<void> => {
  const parsed = CreateLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [lead] = await db
    .insert(leadsTable)
    .values({
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      companyName: parsed.data.companyName ?? null,
      subject: parsed.data.subject ?? null,
      serviceInterested: parsed.data.serviceInterested ?? null,
      message: parsed.data.message,
    })
    .returning();

  req.log.info({ leadId: lead.id }, "Lead created");
  res.status(201).json(CreateLeadResponse.parse(lead));
});

export default router;
