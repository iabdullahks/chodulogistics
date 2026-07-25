import { useAdminGetRateConfirmation, getAdminGetRateConfirmationQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import BrandLogo from "@/components/BrandLogo";

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
  return value != null ? value.toFixed(2) : "0.00";
}

function Bar({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#FEF9C3] border border-[#D4AF37] text-black px-4 py-1.5 text-center font-bold text-[14px] shadow-sm rounded-sm">
      {children}
    </div>
  );
}

function SectionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#1e1e1e] text-white border-l-4 border-[#D4AF37] px-3 py-1.5 font-bold text-[12px] tracking-wide uppercase">
      {children}
    </div>
  );
}

function TwoColRow({
  labelA, valueA, labelB, valueB, shaded,
}: { labelA: string; valueA?: React.ReactNode; labelB: string; valueB?: React.ReactNode; shaded?: boolean }) {
  return (
    <div className={`grid grid-cols-[140px_1fr_140px_1fr] border-b border-black/15 ${shaded ? "bg-[#fcfcfa]" : "bg-white"}`}>
      <div className="px-3 py-1.5 font-bold text-[12px] border-r border-black/15">{labelA}</div>
      <div className="px-3 py-1.5 text-[12px] border-r border-black/15">{valueA || "—"}</div>
      <div className="px-3 py-1.5 font-bold text-[12px] border-r border-black/15">{labelB}</div>
      <div className="px-3 py-1.5 text-[12px]">{valueB || "—"}</div>
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

  const companyName = "BROKERAGE COMPANY OF AMERICAN INC";
  const companyAddress = "50 Emjay Blvd, Brentwood, NY 11786";

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-black/10 px-6 py-3 flex justify-end">
        <Button onClick={() => window.print()} className="bg-[#D4AF37] hover:bg-[#F4C542] text-black font-bold">
          <Printer className="w-4 h-4 mr-2" />
          Print / Save as PDF
        </Button>
      </div>

      <div className="max-w-[850px] mx-auto p-8 print:p-4 text-[12px]">
        {/* Document Header Bar */}
        <div className="flex justify-between items-center border-b border-black pb-1 mb-4 text-[11px] font-bold">
          <span>{companyName} - Rate Confirmation</span>
          <span>PRO #: {rc.proNumber || "55879"}</span>
        </div>

        {/* Company Header with Logo */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <BrandLogo size={56} />
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight">{companyName}</h1>
            <p className="text-xs text-gray-700 font-semibold">{companyAddress}</p>
          </div>
        </div>

        {/* PRO & Dedicated Lane Bars */}
        <div className="space-y-2 mb-4">
          <Bar>PRO #: {rc.proNumber || "55879"}</Bar>
          <Bar>{rc.daysDedicatedLane || "120 Days Dedicated Lane"}</Bar>
        </div>

        <div className="border-t-2 border-[#D4AF37] mb-4" />

        {/* FROM & DATE/TIME Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-black/20 p-3 bg-white">
            <div className="text-[12px] font-bold mb-1 text-[#0d0d0d]">FROM</div>
            <div className="text-[12px] font-bold">{companyName}</div>
            <div className="text-[12px]">{companyAddress}</div>
            <div className="text-[12px]">{rc.fromPhone || "800-555-0199"}</div>
            <div className="text-[12px]">{rc.fromEmail || "dispatch@brokeragecompanyofamericaninc.com"}</div>
          </div>
          <div className="border border-[#D4AF37]/50 p-3 bg-[#FEF9C3]/30">
            <div className="text-[12px] font-bold mb-1">DATE & TIME</div>
            <div className="text-[12px]">{fmtDateTime(rc.rcDateTime)}</div>
            <div className="text-[12px] font-bold mt-2 text-[#8B7500]">Rate Confirmation</div>
          </div>
        </div>

        {/* CARRIER INFORMATION */}
        <SectionBar>CARRIER INFORMATION</SectionBar>
        <div className="mb-6 border-x border-b border-black/20">
          <TwoColRow labelA="Carrier Name" valueA={rc.carrierName} labelB="MC #" valueB={rc.mcNumber} shaded />
          <TwoColRow labelA="Phone" valueA={rc.carrierPhone} labelB="DOT #" valueB={rc.dotNumber} shaded />
          <TwoColRow labelA="Driver Name" valueA={rc.driverName} labelB="Driver Cell #" valueB={rc.driverCell} shaded />
          <TwoColRow labelA="Truck #" valueA={rc.truckNumber} labelB="Trailer #" valueB={rc.trailerNumber} shaded />
        </div>

        {/* LOAD DETAILS */}
        <SectionBar>LOAD DETAILS</SectionBar>
        <div className="mb-6 border-x border-b border-black/20">
          <TwoColRow labelA="Miles" valueA={rc.miles} labelB="Size & Type" valueB={rc.sizeType} shaded />
          <TwoColRow labelA="Pieces" valueA={rc.pieces} labelB="Weight" valueB={rc.weightLbs ? `${rc.weightLbs} lbs` : ""} shaded />
          <TwoColRow labelA="Description" valueA={rc.description} labelB="" valueB="" shaded />
          <TwoColRow labelA="Hot Load" valueA={rc.hotLoad ? "Yes" : "No"} labelB="Total Rate" valueB={rc.totalRateUsd != null ? `$${fmtMoney(rc.totalRateUsd)}` : "$"} shaded />
        </div>

        {/* STOPS TABLE */}
        <SectionBar>STOPS</SectionBar>
        <div className="mb-6 overflow-hidden border border-black/20">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#1e1e1e] text-white font-bold border-b-2 border-[#D4AF37]">
                <th className="p-2 border-r border-white/20">Stop</th>
                <th className="p-2 border-r border-white/20">Pickup Address</th>
                <th className="p-2 border-r border-white/20">Delivery Address</th>
                <th className="p-2 border-r border-white/20">Appointment</th>
                <th className="p-2 border-r border-white/20">Hours</th>
                <th className="p-2 border-r border-white/20">Contact</th>
                <th className="p-2 border-r border-white/20">Pieces</th>
                <th className="p-2">Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black/15 bg-white">
                <td className="p-2 font-bold border-r border-black/15">Outbound Route</td>
                <td className="p-2 border-r border-black/15">{rc.outboundPickupAddress || "—"}</td>
                <td className="p-2 border-r border-black/15">{rc.outboundDeliveryAddress || "—"}</td>
                <td className="p-2 border-r border-black/15">{fmtDate(rc.outboundAppointmentDate)} {rc.outboundAppointmentTime || ""}</td>
                <td className="p-2 border-r border-black/15">{rc.outboundHours || "—"}</td>
                <td className="p-2 border-r border-black/15">{rc.outboundPhoneContact || "—"}</td>
                <td className="p-2 border-r border-black/15">{rc.outboundPieces || "—"}</td>
                <td className="p-2">{rc.outboundWeight ? `${rc.outboundWeight} lbs` : "—"}</td>
              </tr>
              <tr className="bg-[#FEF9C3]/20">
                <td className="p-2 font-bold border-r border-black/15">Return Route</td>
                <td className="p-2 border-r border-black/15">{rc.returnPickupAddress || "—"}</td>
                <td className="p-2 border-r border-black/15">{rc.returnDeliveryAddress || "—"}</td>
                <td className="p-2 border-r border-black/15">{fmtDate(rc.returnAppointmentDate)} {rc.returnAppointmentTime || ""}</td>
                <td className="p-2 border-r border-black/15">{rc.returnHours || "—"}</td>
                <td className="p-2 border-r border-black/15">{rc.returnPhoneContact || "—"}</td>
                <td className="p-2 border-r border-black/15">{rc.returnPieces || "—"}</td>
                <td className="p-2">{rc.returnWeight ? `${rc.returnWeight} lbs` : "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* DISPATCH NOTES */}
        <SectionBar>DISPATCH NOTES</SectionBar>
        <div className="border border-black/20 p-3 mb-6 min-h-[40px] text-[11px] bg-white">
          {rc.dispatchNotes || "No specific dispatch notes."}
        </div>

        {/* SPECIAL INSTRUCTIONS */}
        <SectionBar>SPECIAL INSTRUCTIONS</SectionBar>
        <div className="border border-[#D4AF37]/60 border-l-4 border-l-[#D4AF37] p-3.5 mb-6 text-[11px] bg-[#FEF9C3]/40 leading-relaxed whitespace-pre-wrap rounded-r-sm">
          {rc.specialInstructions ||
`***Driver must accept MacroPoint and track for the duration of this load. Any failure to do so will result in a minimum of a $250 fine, deducted from the settlement of this load. Any delivery date and time, other than what is listed on the Rate Agreement, will result in a minimum of a $200 fine, deducted from the settlement of the load. Repair receipts must accompany any breakdowns in transit or carrier will be fined $200 if delivery date and time on this Rate Agreement is not met. That fine will be deducted from the settlement of this shipment ...

***brokeragecompanyofamericaninc.com MUST BE NOTIFIED 3 HOURS PRIOR TO DELIVERY APPOINTMENT IF THE DRIVER WILL BE LATE. ANY LATE OR MISSED DELIVERIES MAY RESULT IN LONG DWELL TIMES AND/OR LAYOVER(S) UNTIL NEXT AVAILABLE APPOINTMENT IS SCHEDULED.

***CARRIER FORFEITS ANY ACCESSORIAL MONIES, FOR EXTENDED DWELL TIMES IF ORIGINALLY SCHEDULED APPOINTMENT IS NOT MET. ***

***IN ORDER FOR DETENTION TO BE APPLICABLE, DRIVERS MUST CHECK IN/OUT ON THE TABLET AT ANY CHEWY FULFILLMENT CENTER. ...

*** WOODEN LOAD BARS WILL NOT BE ACCEPTED AND MUST BE METAL LOAD BARS. **On-time dropped trailer shipments held 72 hours past their dated appointment will receive $50/day layover.

***Driver must call for verbal dispatch 800-555-0199

**Drivers must accept Macropoint and leave on for the duration of the shipment. No accessorials will be approved if a carrier is not on Macropoint. ***Carrier must EMail billing@brokeragecompanyofamericaninc.com within 1HR of detention.`}
        </div>

        {/* SIGNATURE SECTION */}
        <div className="my-8 pt-4 border-t border-dashed border-black/40 grid grid-cols-2 gap-12">
          <div>
            <div className="border-b border-black mb-1 pb-4" />
            <div className="text-[12px] font-bold text-center">Carrier Signature</div>
            <div className="text-[11px] text-center text-gray-600 mt-0.5">Date: {fmtDate(new Date().toISOString().split("T")[0])}</div>
          </div>
          <div>
            <div className="border-b border-black mb-1 pb-4" />
            <div className="text-[12px] font-bold text-center">{companyName} Representative</div>
            <div className="text-[11px] text-center text-gray-600 mt-0.5">Doc ID: {rc.id ? `2026${String(rc.id).padStart(8, '0')}` : "20260504160917"}</div>
          </div>
        </div>

        <div className="text-center my-4 font-bold text-[12px] bg-[#FEF9C3]/50 py-2 border border-[#D4AF37]/40 rounded-sm">
          <p className="text-[#8B7500]">PRO # {rc.proNumber || "55879"} must appear on all Invoices</p>
          <p className="text-gray-600 text-[11px]">Send Carrier Bills to the Address Above: {companyAddress}</p>
        </div>

        {/* REMARKS */}
        {rc.remarks && (
          <>
            <SectionBar>REMARKS</SectionBar>
            <div className="border border-[#D4AF37]/50 border-l-4 border-l-[#D4AF37] p-3.5 mb-6 text-[11px] bg-[#FEF9C3]/30 leading-relaxed whitespace-pre-wrap rounded-r-sm">
              {rc.remarks}
            </div>
          </>
        )}

        {/* PAYMENT OPTIONS */}
        <SectionBar>PAYMENT OPTIONS</SectionBar>
        <div className="border border-[#D4AF37]/50 border-l-4 border-l-[#D4AF37] p-3.5 mb-6 text-[11px] bg-[#FEF9C3]/30 leading-relaxed space-y-2 rounded-r-sm">
          <p className="font-bold">
            Invoicing, document collection, and payment for all completed loads will be handled electronically using Epay Manager at www.epaymanager.com.
          </p>
          <p>
            Using this system, an electronic invoice will be created within 24 hours after delivery and made available for your review in the Epay portal. Each invoice allows carriers to upload PODs, submit supporting documents, and manage disputes. All payments will be made in U.S. Dollars unless approved in writing by {companyName} in advance of the shipment.
          </p>
          <p><span className="font-bold">ACH Direct Deposit:</span> Payment will be deposited directly into the carrier's bank account within 12–24 hours after receipt and approval of all required and legible paperwork.</p>
          <p><span className="font-bold">Check Payment:</span> Payment will be issued by check after receipt and approval of all required and legible paperwork and mailed to the carrier's registered address.</p>
          <p><span className="font-bold">Standard Contractual Pay:</span> Payment will be made in accordance with contractual pay terms if selected.</p>
          <p><span className="font-bold">Paperwork Requirements:</span> All required paperwork must be submitted through the Epay Manager portal within 10 days of delivery to avoid payment delays. Required documents include, but are not limited to:</p>
          <ul className="list-disc ml-6 space-y-0.5">
            <li>Signed POD</li>
            <li>BOL</li>
            <li>Packing slips</li>
            <li>Lumper receipts (if applicable)</li>
          </ul>
          <p className="font-bold text-[#8B7500]">Please log in to Epay to submit all supporting documents: Epay Manager: www.epaymanager.com</p>
        </div>

        {/* MASTER MOTOR CARRIER AGREEMENT SUPPLEMENT */}
        <SectionBar>{companyName} MASTER MOTOR CARRIER AGREEMENT SUPPLEMENT</SectionBar>
        <div className="border border-[#D4AF37]/60 border-l-4 border-l-[#D4AF37] p-4 text-[10.5px] leading-normal bg-[#FEF9C3]/20 space-y-3 rounded-r-sm">
          <p className="font-bold uppercase text-center text-[11px] text-[#8B7500]">
            {companyName} Master Motor Carrier Agreement Supplement and Carrier Load Confirmation Conditions
          </p>
          <p>
            THIS LOAD CONFIRMATION IS SUBJECT TO THE CONDITIONS OF THE MASTER MOTOR CARRIER AGREEMENT PREVIOUSLY EXECUTED BETWEEN OUR COMPANIES AND THIS ESTABLISHES A SUPPLEMENT TO THE TERMS OF THAT AGREEMENT. WE AGREE TO PAY THE RATES AND CHARGES SHOWN AND NO DIFFERENT TARIFF, RATE, OR SCHEDULE OF RATES APPLIES. THIS LOAD CONFIRMATION IS INCLUSIVE OF ALL CHARGES UNLESS ORAL AND WRITTEN FAX/EMAIL OBJECTIONS ARE MADE TO ITS TERMS, WITHIN TWENTY FOUR (24) HOURS OF RECEIPT OR PRIOR TO WORK BEING INITIATED, WHICHEVER IS EARLIER.
          </p>
          <p className="font-bold">Additional Terms:</p>
          <ol className="list-decimal ml-5 space-y-2">
            <li>
              <span className="font-bold">Service and Rate Stipulation:</span> This rate is reliant upon successful and on-time completion of all load terms as orally fixed or written on this supplement. Shipper may reduce the rate if carrier fails to complete any shipment terms and conditions. Shipper may reduce the rate if the load picks up or delivers after originally scheduled date and time. Carrier acknowledges that failure to complete any terms and conditions on this shipment may endanger or result in loss of future business opportunities with {companyName}, Inc. and/or cancellation of the Master Motor Carrier Agreement. No pick up or delivery appointments will be made by {companyName} that directly violate hours of service regulations and any routing information given is for informational purposes only. By accepting this load, Carrier ensures that driver is able to complete the load within reasonable dispatch while remaining in compliance with hours of service regulations.
            </li>
            <li>
              <span className="font-bold">Seal Integrity, Food Safety & Temperature:</span> Only authorized personnel can remove seals upon arrival to the destination site unless required by in-transit inspections by Law enforcement, DOT or other regulatory agencies. If a seal is broken in-transit, it must be communicated immediately to the broker. Failure by carrier to maintain seal integrity throughout the trip may result in a claim. Carrier also ensures that its driver has been properly trained and is able to comply with Food Safety and Seal Integrity procedures posted on our website: www.brokeragecompanyofamericaninc.com/foodsafety. If the shipper-issued Bill of Lading contains reefer temperature requirements that conflict with the temperature on this Rate Confirmation, the temperature requirements on the Bill of Lading shall control.
            </li>
            <li>
              <span className="font-bold">Accessorial Charges/OS&D:</span> Accessorial charges including but not limited to loading/unloading, detention, and/or layover charges must be authorized and approved prior to or at time of occurrence. Carrier shall ensure the bill of lading is noted either when handling is required, or when detention occurs by providing times and signatures from the facility detention is occurring, that a lumper receipt is provided when a lumper is hired and/or that both are included as supporting documents with the Carrier's invoice. {companyName}, Inc. will not provide reimbursement of accessorial charges that were not pre-approved. All overage, shortage, and damage must be reported to {companyName}, Inc. immediately, at time of occurrence, and noted on the bill of lading.
            </li>
            <li>
              <span className="font-bold">Exclusive Use of Trailer:</span> Unless {companyName}, Inc. provides written notice herein that this term does not apply to this shipment, Carrier's motor vehicle equipment shall be dedicated to {companyName}, Inc.'s exclusive use while transporting freight proposed by {companyName}, Inc. pursuant to this Rate Confirmation and Carrier's Master Motor Carrier Agreement with {companyName}, Inc. Carrier's violation of this exclusive use obligation shall result in Carrier's surrendering its right to be paid for the transportation services intended by this Load Confirmation, not as penalty, but as liquidated damages.
            </li>
            <li>
              <span className="font-bold">Cargo Insurance Stipulation:</span> Pursuant to {companyName}, Inc.'s Master Motor Carrier Agreement, carrier will provide an amount of cargo insurance coverage sufficient to cover the loss or damage of any commodities and cargo carried. Carrier's cargo insurance policy must not exclude coverage of any commodities or cargo carried on this order. Carrier's cargo insurance policy should cover the full value of the cargo, and not limit cargo claims to any amount less than full retail value, if not listed on the Bill of Lading for this shipment. If carrier's insurance policy includes a schedule of covered vehicles, carrier will not transport any cargo on this shipment using a vehicle that is not listed as a scheduled vehicle on carrier's cargo insurance policy. All overage, shortage, and damage must be reported to {companyName}, Inc. immediately, at time of occurrence, and noted on the bill of lading.
            </li>
            <li>
              <span className="font-bold">Weight Stipulation:</span> All carriers are required to scale 45,000 lbs. regardless of weight stated on page of this rate agreement. Any carrier that cannot legally scale 45,000 lbs. is required to notify {companyName}, Inc. at the time this rate agreement is received and before any truck has been dispatched. Failure to do so may result in loss of load and carrier will forfeit monetary damages against {companyName}, Inc. resulted from neglect of carrier to report such occurrence. By carrier accepting load, they agree that their equipment can scale up to 45,000 lbs. and agreed upon rate is not adjusted for any variance unless over 45,000 lbs.
            </li>
            <li>
              <span className="font-bold">After Hours Contact Information:</span> {companyName}, Inc. offers 24/7 assistance for any problems or issues after regular business hours or over the weekends in all of our offices. Please call the number listed on the front page of the rate confirmation.
            </li>
            <li>
              <span className="font-bold">CARB Compliance:</span> {companyName}, Inc. requires that only CARB Compliant equipment be dispatched on California highways and railways. By accepting a load, you agree that vehicle being assigned to our load is fully compliant with CARB regulations and agree to take full responsibility for any and all fines, charges and fees associated with any failure to comply.
            </li>
            <li>
              <span className="font-bold">Driver Loaded Requirement:</span> If BOL is marked Driver Count/Pieces at shipper, driver must confirm the correct amount was loaded BEFORE signing/leaving facility. Call a Representative of {companyName}, Inc. if shipper will not recount or if there is an error. Customer will file claim if driver signs for incorrect number of cases shipped.
            </li>
          </ol>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-black/20 mt-6 pt-2 flex justify-between items-center text-[10px] text-gray-500">
          <span>Confirmation Date: {fmtDateTime(rc.rcDateTime)}</span>
          <span className="font-bold">{companyName}</span>
        </div>
      </div>
    </div>
  );
}
