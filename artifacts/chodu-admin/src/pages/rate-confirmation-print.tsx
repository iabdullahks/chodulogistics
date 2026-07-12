import { useAdminGetRateConfirmation, getAdminGetRateConfirmationQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${String(d.getFullYear()).slice(2)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} (EST)`;
}

function fmtDate(value: string | null) {
  if (!value) return "--";
  const [y, m, d] = value.split("-");
  return `${m}/${d}/${y?.slice(2)}`;
}

function fmtMoney(value: number | null) {
  return value != null ? value.toFixed(2) : "";
}

function Bar({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#eeeeee] border border-black/20 px-4 py-2 text-center font-bold text-[15px]">{children}</div>;
}

function SectionBar({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#3a3a3a] text-white px-3 py-1.5 font-bold text-[13px] tracking-wide">{children}</div>;
}

function Row({ label, value, shaded }: { label: string; value?: React.ReactNode; shaded?: boolean }) {
  return (
    <div className={`grid grid-cols-[160px_1fr] border-b border-black/15 ${shaded ? "bg-[#f2f2f2]" : "bg-white"}`}>
      <div className="px-3 py-1.5 font-bold text-[13px] border-r border-black/15">{label}</div>
      <div className="px-3 py-1.5 text-[13px]">{value}</div>
    </div>
  );
}

function TwoColRow({
  labelA, valueA, labelB, valueB, shaded,
}: { labelA: string; valueA?: React.ReactNode; labelB: string; valueB?: React.ReactNode; shaded?: boolean }) {
  return (
    <div className={`grid grid-cols-[160px_1fr_160px_1fr] border-b border-black/15 ${shaded ? "bg-[#f2f2f2]" : "bg-white"}`}>
      <div className="px-3 py-1.5 font-bold text-[13px] border-r border-black/15">{labelA}</div>
      <div className="px-3 py-1.5 text-[13px] border-r border-black/15">{valueA}</div>
      <div className="px-3 py-1.5 font-bold text-[13px] border-r border-black/15">{labelB}</div>
      <div className="px-3 py-1.5 text-[13px]">{valueB}</div>
    </div>
  );
}

export default function RateConfirmationPrint() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: rc, isLoading } = useAdminGetRateConfirmation(id, {
    query: { enabled: !Number.isNaN(id), queryKey: getAdminGetRateConfirmationQueryKey(id) },
  });

  useEffect(() => {
    document.title = rc ? `Rate Confirmation ${rc.proNumber ?? rc.id}` : "Rate Confirmation";
  }, [rc]);

  if (isLoading || !rc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-black/40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-black/10 px-6 py-3 flex justify-end">
        <Button onClick={() => window.print()} className="bg-[#D4AF37] hover:bg-[#F4C542] text-black font-bold">
          <Printer className="w-4 h-4 mr-2" />
          Print / Save as PDF
        </Button>
      </div>

      <div className="max-w-[850px] mx-auto p-8 print:p-4 font-sans">
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">{rc.fromCompany}</h1>
          <p className="text-xs">1308 WESLEY AVE BERWYN, IL 60402</p>
        </div>

        <div className="space-y-2 mb-4">
          <Bar>PRO #: {rc.proNumber || ""}</Bar>
          <Bar>{rc.daysDedicatedLane || "Days Dedicated Lane"}</Bar>
        </div>

        <div className="border-t-2 border-black mb-4" />

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-black/20 p-3">
            <div className="text-[13px] font-bold mb-1">FROM</div>
            <div className="text-[13px]">{rc.fromCompany}</div>
            {rc.fromPhone && <div className="text-[13px]">{rc.fromPhone}</div>}
            {rc.fromEmail && <div className="text-[13px]">{rc.fromEmail}</div>}
          </div>
          <div className="border border-black/20 p-3 bg-[#fafafa]">
            <div className="text-[13px] font-bold mb-1">DATE & TIME</div>
            <div className="text-[13px]">{fmtDateTime(rc.rcDateTime)}</div>
            <div className="text-[13px] font-bold mt-1">Rate Confirmation</div>
          </div>
        </div>

        <SectionBar>CARRIER INFORMATION</SectionBar>
        <div className="mb-6">
          <TwoColRow labelA="Carrier Name" valueA={rc.carrierName} labelB="MC #" valueB={rc.mcNumber} shaded />
          <TwoColRow labelA="Phone" valueA={rc.carrierPhone} labelB="DOT #" valueB={rc.dotNumber} shaded />
          <TwoColRow labelA="Driver Name" valueA={rc.driverName} labelB="Driver Cell #" valueB={rc.driverCell} shaded />
          <TwoColRow labelA="Truck #" valueA={rc.truckNumber} labelB="Trailer #" valueB={rc.trailerNumber} shaded />
        </div>

        <SectionBar>LOAD DETAILS</SectionBar>
        <div className="mb-6">
          <TwoColRow labelA="Miles" valueA={rc.miles} labelB="Size & Type" valueB={rc.sizeType} shaded />
          <TwoColRow labelA="Pieces" valueA={rc.pieces} labelB="Weight" valueB={rc.weightLbs ? `${rc.weightLbs} lbs` : ""} shaded />
          <TwoColRow labelA="Description" valueA={rc.description} labelB="" valueB="" shaded />
          <TwoColRow labelA="Hot Load" valueA={rc.hotLoad ? "Yes" : "No"} labelB="Total Rate" valueB={rc.totalRateUsd != null ? `$${fmtMoney(rc.totalRateUsd)}` : "$"} shaded />
        </div>

        <SectionBar>RATE INFORMATION</SectionBar>
        <div className="mb-6">
          <TwoColRow labelA="Line Haul Rate" valueA={rc.lineHaulRate != null ? `$${fmtMoney(rc.lineHaulRate)}` : ""} labelB="Total Rate USD" valueB={rc.totalRateUsd != null ? `$${fmtMoney(rc.totalRateUsd)}` : ""} shaded />
        </div>

        <SectionBar>OUTBOUND ROUTE</SectionBar>
        <div className="mb-6">
          <TwoColRow labelA="Pickup Address" valueA={rc.outboundPickupAddress} labelB="Delivery Address" valueB={rc.outboundDeliveryAddress} shaded />
          <TwoColRow labelA="Hours" valueA={rc.outboundHours} labelB="Phone / Contact" valueB={rc.outboundPhoneContact} shaded />
          <TwoColRow labelA="Appointment Date" valueA={fmtDate(rc.outboundAppointmentDate)} labelB="Appointment Time" valueB={rc.outboundAppointmentTime} shaded />
          <TwoColRow labelA="Pieces" valueA={rc.outboundPieces} labelB="Weight" valueB={rc.outboundWeight ? `${rc.outboundWeight} lbs` : ""} shaded />
          {rc.dispatchNotes && (
            <div className="border-b border-black/15 bg-white px-3 py-2">
              <div className="text-[13px] font-bold mb-1">Dispatch Notes</div>
              <div className="text-[12px] whitespace-pre-wrap">{rc.dispatchNotes}</div>
            </div>
          )}
        </div>

        <SectionBar>RETURN ROUTE</SectionBar>
        <div className="mb-6">
          <TwoColRow labelA="Pickup Address" valueA={rc.returnPickupAddress} labelB="Delivery Address" valueB={rc.returnDeliveryAddress} shaded />
          <TwoColRow labelA="Hours" valueA={rc.returnHours} labelB="Phone / Contact" valueB={rc.returnPhoneContact} shaded />
          <TwoColRow labelA="Appointment Date" valueA={fmtDate(rc.returnAppointmentDate)} labelB="Appointment Time" valueB={rc.returnAppointmentTime} shaded />
          <TwoColRow labelA="Pieces" valueA={rc.returnPieces} labelB="Weight" valueB={rc.returnWeight ? `${rc.returnWeight} lbs` : ""} shaded />
        </div>

        {rc.specialInstructions && (
          <>
            <SectionBar>SPECIAL INSTRUCTIONS & REQUIREMENTS</SectionBar>
            <div className="border border-black/20 p-3 mb-6 text-[12px] whitespace-pre-wrap leading-relaxed">
              {rc.specialInstructions}
            </div>
          </>
        )}

        {rc.remarks && (
          <>
            <SectionBar>REMARKS</SectionBar>
            <div className="border border-black/20 p-3 mb-6 text-[12px] whitespace-pre-wrap leading-relaxed">
              {rc.remarks}
            </div>
          </>
        )}

        <SectionBar>PAYMENT OPTIONS</SectionBar>
        <div className="border border-black/20 p-3 mb-6 text-[12px] leading-relaxed space-y-2">
          <p className="font-bold">
            Invoicing, document collection, and payment for all completed loads will be handled electronically using Epay Manager at www.epaymanager.com.
          </p>
          <p>
            Using this system, an electronic invoice will be created within 24 hours after delivery and made available for your review in the Epay portal. Each invoice allows carriers to upload PODs, submit supporting documents, and manage disputes. All payments will be made in U.S. Dollars unless approved in writing by {rc.fromCompany} in advance of the shipment.
          </p>
          <p><span className="font-bold">ACH Direct Deposit:</span> Payment will be deposited directly into the carrier's bank account within 12-24 hours after receipt and approval of all required and legible paperwork.</p>
          <p><span className="font-bold">Check Payment:</span> Payment will be issued by check after receipt and approval of all required and legible paperwork and mailed to the carrier's registered address.</p>
          <p><span className="font-bold">Standard Contractual Pay:</span> Payment will be made in accordance with contractual pay terms if selected.</p>
          <p><span className="font-bold">Paperwork Requirements:</span> All required paperwork must be submitted through the Epay Manager portal within 10 days of delivery to avoid payment delays. Required documents include, but are not limited to:</p>
          <ul className="list-disc ml-6">
            <li>Signed POD</li>
            <li>BOL</li>
            <li>Packing slips</li>
            <li>Lumper receipts (if applicable)</li>
          </ul>
          <p className="font-bold">Please log in to Epay to submit all supporting documents: Epay Manager: www.epaymanager.com</p>
        </div>

        <SectionBar>TERMS & CONDITIONS</SectionBar>
        <div className="border border-black/20 p-3 text-[11px] leading-relaxed whitespace-pre-wrap">
          {rc.fromCompany} Master Motor Carrier Agreement Supplement and Carrier Load Confirmation Conditions{"\n\n"}
          THIS LOAD CONFIRMATION IS SUBJECT TO THE CONDITIONS OF THE MASTER MOTOR CARRIER AGREEMENT PREVIOUSLY EXECUTED BETWEEN OUR COMPANIES AND THIS ESTABLISHES A SUPPLEMENT TO THE TERMS OF THAT AGREEMENT. WE AGREE TO PAY THE RATES AND CHARGES SHOWN AND NO DIFFERENT TARIFF, RATE, OR SCHEDULE OF RATES APPLIES. THIS LOAD CONFIRMATION IS NOT NEGOTIABLE AND MAY NOT BE ASSIGNED OR TRANSFERRED WITHOUT PRIOR WRITTEN CONSENT.
        </div>
      </div>
    </div>
  );
}
