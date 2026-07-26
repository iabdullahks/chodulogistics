import { useAdminGetRateConfirmation, getAdminGetRateConfirmationQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import BrandLogo from "@/components/BrandLogo";

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} (EST)`;
}

function fmtDateTime2Digit(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${String(d.getFullYear()).slice(2)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} (EST)`;
}

function rebrandText(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/TARA LOGISTICS LLC/gi, "Brokerage Co. of American INC")
    .replace(/TARA LOGISTICS/gi, "Brokerage Co. of American INC")
    .replace(/DOUBLE E LOGISTICS LLC/gi, "Brokerage Co. of American INC")
    .replace(/DOUBLE E LOGISTICS/gi, "Brokerage Co. of American INC")
    .replace(/Double-e/gi, "Brokerage Co. of American INC")
    .replace(/Double E/gi, "Brokerage Co. of American INC")
    .replace(/double-e-logistic\.com/gi, "brokeragecompanyofamericaninc.com")
    .replace(/taralogisticsllc\.com/gi, "brokeragecompanyofamericaninc.com")
    .replace(/billing@double-e-logistic\.com/gi, "billing@brokeragecompanyofamericaninc.com")
    .replace(/billing@taralogisticsllc\.com/gi, "billing@brokeragecompanyofamericaninc.com")
    .replace(/fred@taralogisticsllc\.com/gi, "winston@brokeragecompanyofamericaninc.com")
    .replace(/winston@double-e-logistic\.com/gi, "winston@brokeragecompanyofamericaninc.com");
}

function fmtStopDate(dStr: string | null | undefined): string {
  if (!dStr) return "";
  return dStr.split("T")[0];
}

function fmtMoney(value: number | null) {
  return value != null ? value.toFixed(2) : "0.00";
}

function PageBreak() {
  return <div className="print:break-after-page" />;
}

function CompanyLogo({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="select-none">
      <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="44" fill="#ffffff" stroke="#000000" strokeWidth="1" strokeDasharray="2,2" />
      <path id="textPathTop" d="M 12 50 A 38 38 0 1 1 88 50" fill="none" stroke="none" />
      <path id="textPathBottom" d="M 88 50 A 38 38 0 1 1 12 50" fill="none" stroke="none" />

      <text fill="#0d0d0d" fontSize="6.8" fontWeight="800" letterSpacing="0.4" fontFamily="sans-serif">
        <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
          BROKERAGE CO. OF AMERICAN INC
        </textPath>
      </text>

      <text fill="#D4AF37" fontSize="5.2" fontWeight="700" letterSpacing="0.8" fontFamily="sans-serif">
        <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
          ★ LOGISTICS ★
        </textPath>
      </text>

      <circle cx="50" cy="50" r="18" fill="#ffffff" stroke="#D4AF37" strokeWidth="1.5" />
      <text x="50" y="56" fill="#0d0d0d" fontSize="17" fontWeight="900" textAnchor="middle" fontFamily="'Oswald', sans-serif">
        BC
      </text>
    </svg>
  );
}

function DocHeader({ companyName, proNumber }: { companyName: string; proNumber: string }) {
  return (
    <div className="flex justify-between items-center border-b border-black pb-1 mb-4 text-[11px] font-bold">
      <span>{companyName} - Rate Confirmation</span>
      <span>PRO #: {proNumber}</span>
    </div>
  );
}

function DocFooter({ rcDateTime, companyName }: { rcDateTime: string; companyName: string }) {
  return (
    <div className="border-t border-black/20 mt-6 pt-2 flex justify-between items-center text-[10px] text-gray-500">
      <span>Confirmation Date: {fmtDateTime(rcDateTime)}</span>
      <span className="font-bold">{companyName}</span>
    </div>
  );
}

function ProBar({ proNumber, address, isInline, documentId }: { proNumber: string; address?: string; isInline?: boolean; documentId?: string }) {
  return (
    <div className="text-center my-4 font-bold text-[12px] bg-[#FEF9C3]/50 py-2 border border-[#D4AF37]/40 rounded-sm">
      <p className="text-[#8B7500]">PRO # {proNumber} must appear on all Invoices</p>
      {isInline ? (
        <p className="text-gray-600 text-[11px]">Send Carrier Bills to: {address?.replace("\n", ", ")}</p>
      ) : (
        <p className="text-gray-600 text-[11px]">Send Carrier Bills to the Address Above</p>
      )}
      {documentId && <p className="text-[10px] text-gray-400 mt-1">Doc ID: {documentId}</p>}
    </div>
  );
}

function Bar({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#f3f4f6] border border-gray-300 text-black px-4 py-1.5 text-center font-bold text-[13px] rounded-sm">
      {children}
    </div>
  );
}

function SectionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#2b2b2b] text-white px-3 py-1.5 text-center font-bold text-[12px] tracking-wide uppercase rounded-sm">
      {children}
    </div>
  );
}

function TwoColRow({
  labelA, valueA, labelB, valueB,
}: { labelA: string; valueA?: React.ReactNode; labelB: string; valueB?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr_140px_1fr] border-b border-black/15 text-[11px] leading-tight">
      <div className="px-3 py-2 font-bold bg-[#f3f4f6] border-r border-black/15 text-left text-gray-700">{labelA}</div>
      <div className="px-3 py-2 bg-white border-r border-black/15 text-gray-900">{valueA || ""}</div>
      <div className="px-3 py-2 font-bold bg-[#f3f4f6] border-r border-black/15 text-left text-gray-700">{labelB}</div>
      <div className="px-3 py-2 bg-white text-gray-900">{valueB || ""}</div>
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
  const companyName = "Brokerage Co. of American INC";
  const companyAddress = "50 Emjay Blvd\nBrentwood, NY 11786";
  const proNumber = rc.proNumber || "—";
  const docId = rc.id ? `2026${String(rc.id).padStart(8, "0")}` : "20260504160917";
  const rcDate = new Date(rc.rcDateTime).toISOString().split("T")[0];

  const defaultSpecialInstructions = `***Driver must accept MacroPoint and track for the duration of this load. Any failure to do so will result in a minimum of a $250 fine, deducted from the settlement of this load. Any delivery date and time, other than what is listed on the Rate Agreement, will result in a minimum of a $200 fine, deducted from the settlement of the load. Repair receipts must accompany any breakdowns in transit or carrier will be fined $200 if delivery date and time on this Rate Agreement is not met. That fine will be deducted from the settlement of this shipment ...

***brokeragecompanyofamericaninc.com MUST BE NOTIFIED 3 HOURS PRIOR TO DELIVERY APPOINTMENT IF THE DRIVER WILL BE LATE. ANY LATE OR MISSED DELIVERIES MAY RESULT IN LONG DWELL TIMES AND/OR LAYOVER(S) UNTIL NEXT AVAILABLE APPOINTMENT IS SCHEDULED.

***CARRIER FORFEITS ANY ACCESSORIAL MONIES, FOR EXTENDED DWELL TIMES IF ORIGINALLY SCHEDULED APPOINTMENT IS NOT MET. ***

***Driver must call for verbal dispatch 480-374-6050

***IN ORDER FOR DETENTION TO BE APPLICABLE, DRIVERS MUST CHECK IN/OUT ON THE TABLET AT ANY CHEWY FULFILLMENT CENTER. ...

**Drivers must accept Macropoint and leave on for the duration of the shipment. No accessorials will be approved if a carrier is not on Macropoint. ***Carrier must email billing@brokeragecompanyofamericaninc.com within 1HR of detention.

*** WOODEN LOAD BARS WILL NOT BE ACCEPTED AND MUST BE METAL LOAD BARS. **On-time dropped trailer shipments held 72 hours past their dated appointment will receive $50/day layover.`;

  const defaultRemarks = `Please submit ALL pages of the POD with a receiver signature within 72 hours of delivery. ***CARRIERS MUST REPORT DETENTION 1 HOUR PRIOR TO OCCURRENCE AND MUST SUBMIT LUMPER RECEIPT WITHIN 24-48 HOURS OF DELIVERY IF THERE IS ONE. FAILURE TO DO SO WILL RESULT IN NON-PAYMENT OF CHARGES.***

Failure to notify Brokerage Co. of American INC within 1HR of occurrence results in time starting 1 HR from time of email. Arrival and Departure times to be clearly written on BOL by shipper/receiver. Please email to winston@brokeragecompanyofamericaninc.com within 24HRS for payment. Failure to email within 24HR of occurrence may result in non-approved charges.`;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-black/10 px-6 py-3 flex justify-end">
        <Button onClick={() => window.print()} className="bg-[#D4AF37] hover:bg-[#F4C542] text-black font-bold">
          <Printer className="w-4 h-4 mr-2" />
          Print / Save as PDF
        </Button>
      </div>

      {/* — PAGE 1: Header, Carrier Info, Load Details, Stops, Dispatch Notes — */}
      <div className="max-w-[850px] mx-auto p-8 print:p-4 text-[12px]">
        <DocHeader companyName={companyName} proNumber={proNumber} />

        <div className="relative flex items-center justify-center mb-6 min-h-[64px]">
          <div className="absolute left-0">
            <CompanyLogo size={64} />
          </div>
          <div className="text-center">
            <h1 className="text-[17px] font-bold tracking-tight uppercase leading-tight">{companyName}</h1>
            <p className="text-[11px] text-gray-600 font-semibold whitespace-pre-line leading-snug mt-0.5">{companyAddress}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <Bar>PRO #: {proNumber}</Bar>
          {rc.daysDedicatedLane && <Bar>{rc.daysDedicatedLane}</Bar>}
        </div>

        <div className="border-t-2 border-black mb-4" />

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-black/20 p-3 bg-white">
            <div className="text-[12px] font-bold mb-1">FROM</div>
            <div className="text-[12px] font-bold">{companyName}</div>
            <div className="text-[12px] whitespace-pre-line">{companyAddress}</div>
            <div className="text-[12px]">{rc.fromPhone || ""}</div>
            <div className="text-[12px]">{rebrandText(rc.fromEmail || "winston@brokeragecompanyofamericaninc.com")}</div>
          </div>
          <div className="border border-black/20 p-3 bg-white">
            <div className="text-[12px] font-bold mb-1">DATE &amp; TIME</div>
            <div className="text-[12px]">{fmtDateTime2Digit(rc.rcDateTime)}</div>
            <div className="text-[12px] font-bold mt-2 text-gray-800">Rate Confirmation</div>
          </div>
        </div>

        <SectionBar>CARRIER INFORMATION</SectionBar>
        <div className="mb-6 border-x border-b border-black/15 mt-1.5">
          <TwoColRow labelA="Carrier Name" valueA={rc.carrierName} labelB="MC #" valueB={rc.mcNumber} />
          <TwoColRow labelA="Phone" valueA={rc.carrierPhone} labelB="DOT #" valueB={rc.dotNumber} />
          <TwoColRow labelA="Driver Name" valueA={rc.driverName} labelB="Driver Cell #" valueB={rc.driverCell} />
          <TwoColRow labelA="Truck #" valueA={rc.truckNumber} labelB="Trailer #" valueB={rc.trailerNumber} />
        </div>

        <SectionBar>LOAD DETAILS</SectionBar>
        <div className="mb-6 border-x border-b border-black/15 mt-1.5">
          <TwoColRow labelA="Miles" valueA={rc.miles} labelB="Size &amp; Type" valueB={rc.sizeType} />
          <TwoColRow labelA="Pieces" valueA={rc.pieces} labelB="Weight" valueB={rc.weightLbs ? `${rc.weightLbs} lbs` : ""} />
          <div className="grid grid-cols-[140px_1fr] border-b border-black/15 text-[11px] leading-tight">
            <div className="px-3 py-2 font-bold bg-[#f3f4f6] border-r border-black/15 text-left text-gray-700">Description</div>
            <div className="px-3 py-2 bg-white text-gray-900">{rc.description}</div>
          </div>
          <TwoColRow labelA="Hot Load" valueA={rc.hotLoad ? "Yes" : "No"} labelB="Total Rate" valueB={rc.totalRateUsd != null ? `$${fmtMoney(rc.totalRateUsd)}` : "$"} />
        </div>

        <SectionBar>STOPS</SectionBar>
        <div className="mb-6 overflow-hidden border border-black/15 mt-1.5">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#2b2b2b] text-white font-bold">
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
                <td className="p-2 border-r border-black/15">{rc.outboundPickupAddress || ""}</td>
                <td className="p-2 border-r border-black/15">{rc.outboundDeliveryAddress || ""}</td>
                <td className="p-2 border-r border-black/15">{rc.outboundAppointmentDate ? `${fmtStopDate(rc.outboundAppointmentDate)} ${rc.outboundAppointmentTime || ""}` : ""}</td>
                <td className="p-2 border-r border-black/15">{rc.outboundHours || ""}</td>
                <td className="p-2 border-r border-black/15">{rc.outboundPhoneContact || ""}</td>
                <td className="p-2 border-r border-black/15">{rc.outboundPieces || ""}</td>
                <td className="p-2">{rc.outboundWeight ? `${rc.outboundWeight} lbs` : ""}</td>
              </tr>
              <tr className="bg-white">
                <td className="p-2 font-bold border-r border-black/15">Return Route</td>
                <td className="p-2 border-r border-black/15">{rc.returnPickupAddress || ""}</td>
                <td className="p-2 border-r border-black/15">{rc.returnDeliveryAddress || ""}</td>
                <td className="p-2 border-r border-black/15">{rc.returnAppointmentDate ? `${fmtStopDate(rc.returnAppointmentDate)} ${rc.returnAppointmentTime || ""}` : ""}</td>
                <td className="p-2 border-r border-black/15">{rc.returnHours || ""}</td>
                <td className="p-2 border-r border-black/15">{rc.returnPhoneContact || ""}</td>
                <td className="p-2 border-r border-black/15">{rc.returnPieces || ""}</td>
                <td className="p-2">{rc.returnWeight ? `${rc.returnWeight} lbs` : "lbs"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <SectionBar>DISPATCH NOTES</SectionBar>
        <div className="border border-black/20 p-3 mb-6 min-h-[40px] text-[11px] bg-white mt-1.5">
          {rebrandText(rc.dispatchNotes || "")}
        </div>

        <DocFooter rcDateTime={rc.rcDateTime} companyName={companyName} />
      </div>

      <PageBreak />

      {/* — PAGE 2: Special Instructions + First Signature — */}
      <div className="max-w-[850px] mx-auto p-8 print:p-4 text-[12px]">
        <DocHeader companyName={companyName} proNumber={proNumber} />

        {/* Blank gray bar */}
        <div className="bg-gray-100 border border-gray-300 h-6 mb-4 rounded-sm" />

        <SectionBar>SPECIAL INSTRUCTIONS</SectionBar>
        <div className="border border-[#D4AF37]/40 bg-[#FEF9C3]/20 p-3 mb-4 text-[10px] leading-tight whitespace-pre-wrap rounded-sm mt-1.5">
          {rebrandText(rc.specialInstructions || defaultSpecialInstructions)}
        </div>

        {/* First Signature Block */}
        <div className="my-8 pt-4 border-t border-dashed border-black/40 grid grid-cols-2 gap-12">
          <div className="flex flex-col items-center">
            <div className="h-16" />
            <div className="w-full border-t border-black mb-1.5" />
            <div className="text-[12px] font-bold text-center">Carrier Signature</div>
            <div className="text-[11px] text-center text-gray-600 mt-0.5">Date: {rcDate}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-16" />
            <div className="w-full border-t border-black mb-1.5" />
            <div className="text-[12px] font-bold text-center">{companyName} Representative</div>
            <div className="text-[11px] text-center text-gray-600 mt-0.5">Doc ID: {docId}</div>
          </div>
        </div>

        <ProBar proNumber={proNumber} />

        <DocFooter rcDateTime={rc.rcDateTime} companyName={companyName} />
      </div>

      <PageBreak />

      {/* — PAGE 3: Second copy — FROM + CARRIER, Remarks, Payment Options — */}
      <div className="max-w-[850px] mx-auto p-8 print:p-4 text-[12px]">
        <DocHeader companyName={companyName} proNumber={proNumber} />

        <div className="text-center mb-4">
          <h1 className="text-xl font-bold tracking-tight">{companyName}</h1>
          <p className="text-xs text-gray-700 font-semibold whitespace-pre-line">{companyAddress}</p>
        </div>

        <Bar>PRO #: {proNumber}</Bar>
        <div className="h-4" />

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="border border-black/20 p-3 bg-white">
            <div className="text-[12px] font-bold mb-1">FROM</div>
            <div className="text-[12px] font-bold">{companyName}</div>
            <div className="text-[12px] whitespace-pre-line">{companyAddress}</div>
            <div className="text-[12px]">{rc.fromPhone || ""}</div>
            <div className="text-[12px]">{rebrandText(rc.fromEmail || "winston@brokeragecompanyofamericaninc.com")}</div>
          </div>
          <div className="border border-black/20 p-3 bg-white">
            <div className="text-[12px] font-bold mb-1">CARRIER</div>
            <div className="text-[12px] font-bold">{rc.carrierName}</div>
            <div className="text-[12px]">{rc.carrierPhone || ""}</div>
            <div className="text-[12px]">MC # {rc.mcNumber || ""}</div>
            <div className="text-[12px]">DOT {rc.dotNumber || ""}</div>
          </div>
        </div>

        <SectionBar>REMARKS</SectionBar>
        <div className="border border-[#D4AF37]/40 bg-[#FEF9C3]/20 p-3.5 mb-6 text-[11px] leading-relaxed whitespace-pre-wrap rounded-sm mt-1.5">
          {rebrandText(rc.remarks || defaultRemarks)}
        </div>

        <SectionBar>PAYMENT OPTIONS</SectionBar>
        <div className="border border-blue-200 bg-[#eff6ff] p-3 text-[10px] leading-tight space-y-1.5 rounded-sm mt-1.5">
          <p className="font-bold">Invoicing, document collection, and payment for all completed loads will be processed by our team.</p>
          <p>Please email your invoice and all supporting documents (legible POD/BOL, lumper receipts, etc.) to: winston@brokeragecompanyofamericaninc.com. All payments will be made in U.S. Dollars unless approved in writing by {companyName} in advance of the shipment.</p>
          <p className="font-bold">Payment Methods &amp; Timing</p>
          <p><span className="font-bold">ACH Direct Deposit</span><br />Payment will be deposited directly into the carrier's bank account within 12-24 hours after receipt and approval of all required and legible paperwork.</p>
          <p><span className="font-bold">Check Payment</span><br />Payment will be issued by check after receipt and approval of all required and legible paperwork and mailed to the carrier's registered address.</p>
          <p><span className="font-bold">Standard Contractual Pay</span><br />Payment will be made in accordance with contractual pay terms if selected.</p>
        </div>

        <DocFooter rcDateTime={rc.rcDateTime} companyName={companyName} />
      </div>

      <PageBreak />

      {/* — PAGE 4: BOL list continuation + MMCA Supplement — */}
      <div className="max-w-[850px] mx-auto p-8 print:p-4 text-[12px]">
        <DocHeader companyName={companyName} proNumber={proNumber} />

        <div className="border border-blue-200 bg-[#eff6ff] p-3 rounded-sm mb-4 text-[11px] leading-relaxed">
          <ul className="list-disc ml-6 space-y-1 mb-2">
            <li>BOL</li>
            <li>Packing slips</li>
            <li>Lumper receipts (if applicable)</li>
          </ul>
          <p className="font-bold text-[#8B7500]">
            Please email all supporting documents to:<br />
            winston@brokeragecompanyofamericaninc.com
          </p>
        </div>

        <SectionBar>{companyName} MASTER MOTOR CARRIER AGREEMENT SUPPLEMENT</SectionBar>
        <div className="border border-gray-300 bg-white p-3 text-[9px] leading-tight space-y-1.5 rounded-sm mt-1.5">
          <p className="font-bold uppercase text-center text-[10px] text-[#8B7500]">{companyName} Master Motor Carrier Agreement Supplement and Carrier Load Confirmation Conditions</p>
          <p>THIS LOAD CONFIRMATION IS SUBJECT TO THE CONDITIONS OF THE MASTER MOTOR CARRIER AGREEMENT PREVIOUSLY EXECUTED BETWEEN OUR COMPANIES AND THIS ESTABLISHES A SUPPLEMENT TO THE TERMS OF THAT AGREEMENT. WE AGREE TO PAY THE RATES AND CHARGES SHOWN AND NO DIFFERENT TARIFF, RATE, OR SCHEDULE OF RATES APPLIES. THIS LOAD CONFIRMATION IS INCLUSIVE OF ALL CHARGES UNLESS ORAL AND WRITTEN FAX/EMAIL OBJECTIONS ARE MADE TO ITS TERMS, WITHIN TWENTY FOUR (24) HOURS OF RECEIPT OR PRIOR TO WORK BEING INITIATED, WHICHEVER IS EARLIER.</p>
          <p className="font-bold">Additional Terms:</p>
          <ol className="list-decimal ml-5 space-y-1">
            <li><span className="font-bold">Service and Rate Stipulation:</span> This rate is reliant upon successful and on-time completion of all load terms as orally fixed or written on this supplement. Shipper may reduce the rate if carrier fails to complete any shipment terms and conditions. Shipper may reduce the rate if the load picks up or delivers after originally scheduled date and time. Carrier acknowledges that failure to complete any terms and conditions on this shipment may endanger or result in loss of future business opportunities with {companyName}, Inc. and/or cancellation of the Master Motor Carrier Agreement. No pick up or delivery appointments will be made by {companyName} that directly violate hours of service regulations and any routing information given is for informational purposes only. By accepting this load, Carrier ensures that driver is able to complete the load within reasonable dispatch while remaining in compliance with hours of service regulations.</li>
            <li><span className="font-bold">Seal Integrity, Food Safety &amp; Temperature:</span> Only authorized personnel can remove seals upon arrival to the destination site unless required by in-transit inspections by Law enforcement, DOT or other regulatory agencies. If a seal is broken in-transit, it must be communicated immediately to the broker. Failure by carrier to maintain seal integrity throughout the trip may result in a claim. Carrier also ensures that its driver has been properly trained and is able to comply with Food Safety and Seal Integrity procedures posted on our website: www.brokeragecompanyofamericaninc.com/foodsafety. If the shipper-issued Bill of Lading contains reefer temperature requirements that conflict with the temperature on this Rate Confirmation, the temperature requirements on the Bill of Lading shall control.</li>
            <li><span className="font-bold">Accessorial Charges/OS&amp;D:</span> Accessorial charges including but not limited to loading/unloading, detention, and/or layover charges must be authorized and approved prior to or at time of occurrence. Carrier shall ensure the bill of lading is noted either when handling is required, or when detention occurs by providing times and signatures from the facility detention is occurring, that a lumper receipt is provided when a lumper is hired and/or that both are included as supporting documents with the Carrier's invoice. {companyName}, Inc. will not provide reimbursement of accessorial charges that were not pre-approved. All overage, shortage, and damage must be reported to {companyName}, Inc. immediately, at time of occurrence, and noted on the bill of lading.</li>
            <li><span className="font-bold">Exclusive Use of Trailer:</span> Unless {companyName}, Inc. provides written notice herein that this term does not apply to this shipment, Carrier's motor vehicle equipment shall be dedicated to {companyName}, Inc.'s exclusive use while transporting freight proposed by {companyName}, Inc. pursuant to this Rate Confirmation and Carrier's Master Motor Carrier Agreement with {companyName}, Inc. Carrier's violation of this exclusive use obligation shall result in Carrier's surrendering its right to be paid for the transportation services intended by this Load Confirmation, not as penalty, but as liquidated damages.</li>
            <li><span className="font-bold">Cargo Insurance Stipulation:</span> Pursuant to {companyName}, Inc.'s Master Motor Carrier Agreement, carrier will provide an amount of cargo insurance coverage sufficient to cover the loss or damage of any commodities and cargo carried. Carrier's cargo insurance policy must not exclude coverage of any commodities or cargo carried on this order. Carrier's cargo insurance policy should cover the full value of the cargo, and not limit cargo claims to any amount less than full retail value, if not listed on the Bill of Lading for this shipment. If carrier's insurance policy includes a schedule of covered vehicles, carrier will not transport any cargo on this shipment using a vehicle that is not listed as a scheduled vehicle on carrier's cargo insurance policy. All overage, shortage, and damage must be reported to {companyName}, Inc. immediately, at time of occurrence, and noted on the bill of lading.</li>
          </ol>
        </div>

        <DocFooter rcDateTime={rc.rcDateTime} companyName={companyName} />
      </div>

      <PageBreak />

      {/* — PAGE 5: Driver Loaded box + Final Signature — */}
      <div className="max-w-[850px] mx-auto p-8 print:p-4 text-[12px]">
        <DocHeader companyName={companyName} proNumber={proNumber} />

        {/* Gray box with driver loaded requirement */}
        <div className="border border-black/20 bg-gray-50 p-3 mb-6 text-[11px] leading-relaxed">
          If BOL is marked Driver Count/Pieces at shipper, driver must confirm the correct amount was loaded BEFORE signing/leaving facility. Call a Representative of {companyName}, Inc. if shipper will not recount or if there is an error. Customer will file claim if driver signs for incorrect number of cases shipped.
        </div>

        <div className="border-t border-dashed border-black/40 mb-6" />

        {/* Final Signature — carrier name filled in + company date */}
        <div className="my-8 grid grid-cols-2 gap-12">
          <div className="flex flex-col items-center">
            <div className="h-16" />
            <div className="w-full border-t border-black mb-1.5" />
            <div className="text-[12px] font-bold text-center">Carrier Signature</div>
            <div className="text-[11px] text-center font-semibold mt-0.5">{rc.carrierName}</div>
            <div className="text-[11px] text-center text-gray-600 mt-0.5">Date: {rcDate}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-16" />
            <div className="w-full border-t border-black mb-1.5" />
            <div className="text-[12px] font-bold text-center">{companyName}</div>
            <div className="text-[11px] text-center text-gray-600 mt-0.5">Date: {rcDate}</div>
          </div>
        </div>
        <ProBar proNumber={proNumber} address={companyAddress} isInline documentId={docId} />

        <DocFooter rcDateTime={rc.rcDateTime} companyName={companyName} />
      </div>
    </div>
  );
}
