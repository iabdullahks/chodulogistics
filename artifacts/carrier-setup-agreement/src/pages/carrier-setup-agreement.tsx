import { useState } from "react"
import { Truck, Send, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1
  dispatchCompany: string
  // Step 2
  carrierFullName: string
  companyName: string
  mcNumber: string
  dotNumber: string
  drivingLicense: string
  phone: string
  email: string
  // Step 3
  laneSetupOption: string
  otherServices: {
    twicCard: boolean
    trailerRental: boolean
    factoringSetup: boolean
    insuranceAssistance: boolean
  }
  paymentMethod: string
  signature: string
  printName: string
}

const INITIAL_FORM: FormData = {
  dispatchCompany: "",
  carrierFullName: "",
  companyName: "",
  mcNumber: "",
  dotNumber: "",
  drivingLicense: "",
  phone: "",
  email: "",
  laneSetupOption: "",
  otherServices: {
    twicCard: false,
    trailerRental: false,
    factoringSetup: false,
    insuranceAssistance: false,
  },
  paymentMethod: "",
  signature: "",
  printName: "",
}

const STEPS = [
  { label: "Company Info" },
  { label: "Carrier Details" },
  { label: "Services & Final" },
]

const DISPATCH_COMPANIES = [
  "TARA LOGISTICS LLC",
  "Prime Dispatch Services",
  "Eagle Freight Dispatch",
  "American Truck Dispatch",
  "Nationwide Dispatch Group",
  "Other",
]

const TODAY = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
})

const TODAY_DMY = new Date().toLocaleDateString("en-GB").replace(/\//g, "/")

// ─── Sub-components ──────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs text-[#94A3B8] mb-1.5">{children}</div>
}

function TextInput({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
    />
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round(((step + 1) / STEPS.length) * 100)
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-[#94A3B8] font-medium">Setup Progress</span>
        <span className="text-xs font-bold text-[#D4AF37]">{pct}%</span>
      </div>
      <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center gap-1" style={{ width: `${100 / STEPS.length}%` }}>
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                i < step
                  ? "bg-[#D4AF37] border-[#D4AF37]"
                  : i === step
                  ? "bg-[#D4AF37] border-[#D4AF37]"
                  : "bg-[#1a1a1a] border-[#333]"
              )}
            >
              {i < step ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-black" />
              ) : (
                <span className={cn("text-[10px] font-bold", i === step ? "text-black" : "text-[#555]")}>{i + 1}</span>
              )}
            </div>
            <span className={cn("text-[10px] font-medium text-center", i === step ? "text-[#D4AF37]" : i < step ? "text-[#94A3B8]" : "text-[#444]")}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Step 1: Company Information ──────────────────────────────────────────────

function StepCompanyInfo({ data, setData }: { data: FormData; setData: (d: FormData) => void }) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-7 h-7 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 mt-0.5">
          <Truck className="w-4 h-4 text-[#D4AF37]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Step 1: Company Information</h2>
          <p className="text-xs text-[#94A3B8]">Agreement details and dispatch partnership</p>
        </div>
      </div>

      <div className="text-xs text-[#CBD5E1] leading-relaxed mb-5 pb-5 border-b border-[#2a2a2a]">
        This Agreement is made and entered into on <strong className="text-white">{TODAY}</strong>, by and between:{" "}
        <strong className="text-white">TARA LOGISTICS LLC</strong>
        <br />
        MC #: <strong className="text-white">1551407</strong> | DOT #: <strong className="text-white">4079068</strong>
        <br />
        Address: <strong className="text-white">1308 WESLEY AVE BERWYN, IL 60402</strong>
        <br />
        Email: <strong className="text-white">fred@taralogisticsllc.com</strong>
      </div>

      {/* Important notice */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-md px-4 py-3 mb-5">
        <p className="text-xs text-[#CBD5E1]">
          <strong className="text-white">Important:</strong> The Client should only respond to verified contacts from the Company or the following trusted dispatch partners:
        </p>
      </div>

      {/* Dispatch Company dropdown */}
      <div className="mb-4">
        <FieldLabel>Dispatch Company Name</FieldLabel>
        <div className="relative">
          <select
            value={data.dispatchCompany}
            onChange={(e) => setData({ ...data, dispatchCompany: e.target.value })}
            className="w-full appearance-none bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all pr-8"
          >
            <option value="" disabled className="text-[#555]">Select Dispatch Company</option>
            {DISPATCH_COMPANIES.map((c) => (
              <option key={c} value={c} className="bg-[#1a1a1a] text-white">{c}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">▼</span>
        </div>
      </div>

      <p className="text-xs text-[#94A3B8] italic">(Hereinafter referred to as the TARA LOGISTICS LLC)</p>
    </div>
  )
}

// ─── Step 2: Carrier Information ─────────────────────────────────────────────

function StepCarrierInfo({ data, setData }: { data: FormData; setData: (d: FormData) => void }) {
  const SERVICE_BADGES = [
    "Dedicated freight lanes",
    "Dispatch assistance",
    "Trailer rental",
    "TWIC card application support",
    "Commercial insurance setup",
    "Factoring registration",
  ]

  return (
    <div>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-black text-xs font-bold">2</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Step 2: Carrier Information</h2>
          <p className="text-xs text-[#94A3B8]">Enter your carrier and company details</p>
        </div>
      </div>

      {/* Form grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div>
          <FieldLabel>Carrier Full Name</FieldLabel>
          <TextInput placeholder="Enter Carrier Name" value={data.carrierFullName} onChange={(v) => setData({ ...data, carrierFullName: v })} />
        </div>
        <div>
          <FieldLabel>Company Name (if applicable)</FieldLabel>
          <TextInput placeholder="Enter Company Name" value={data.companyName} onChange={(v) => setData({ ...data, companyName: v })} />
        </div>
        <div>
          <FieldLabel>MC Number</FieldLabel>
          <TextInput placeholder="Enter Carrier MC" value={data.mcNumber} onChange={(v) => setData({ ...data, mcNumber: v })} />
        </div>
        <div>
          <FieldLabel>DOT Number</FieldLabel>
          <TextInput placeholder="Enter Carrier USDOT" value={data.dotNumber} onChange={(v) => setData({ ...data, dotNumber: v })} />
        </div>
        <div>
          <FieldLabel>Driving License Number</FieldLabel>
          <TextInput placeholder="Enter Driving License Number" value={data.drivingLicense} onChange={(v) => setData({ ...data, drivingLicense: v })} />
        </div>
        <div>
          <FieldLabel>Phone Number</FieldLabel>
          <TextInput placeholder="Enter Phone Number" value={data.phone} onChange={(v) => setData({ ...data, phone: v })} type="tel" />
        </div>
        <div className="sm:col-span-1">
          <FieldLabel>Your Email</FieldLabel>
          <TextInput placeholder="Enter Your Email" value={data.email} onChange={(v) => setData({ ...data, email: v })} type="email" />
        </div>
      </div>

      {/* Purpose of Agreement */}
      <div className="border-t border-[#2a2a2a] pt-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
            <span className="text-[#D4AF37] text-xs font-bold">⊕</span>
          </div>
          <h3 className="text-sm font-bold text-white">Purpose of Agreement</h3>
        </div>
        <p className="text-xs text-[#94A3B8] mb-3">
          This Agreement outlines the terms and conditions under which the Company provides setup and logistics services to the Client,
          including but not limited to:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {SERVICE_BADGES.map((badge) => (
            <div key={badge} className="flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-2.5 py-1.5">
              <span className="text-[#D4AF37] text-xs">🚛</span>
              <span className="text-xs text-[#CBD5E1]">{badge}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#94A3B8]">
          Access to high-paying loads through partnered shippers including Amazon &amp; government contracts
        </p>
      </div>
    </div>
  )
}

// ─── Step 3: Services & Final Agreement ──────────────────────────────────────

function StepServicesFinal({ data, setData }: { data: FormData; setData: (d: FormData) => void }) {
  const LANE_OPTIONS = [
    { value: "dot-only", label: "DOT-Only Carriers (Intrastate Loads) — Security Deposit Required", badge: "Deposit Required", badgeVariant: "deposit" },
    { value: "new-mc", label: "New MCs (Less than 2 Years Old) — Security Deposit Required", badge: "Deposit Required", badgeVariant: "deposit" },
    { value: "broker-authority", label: "Under Broker's Authority — Security Deposit Required", badge: "Deposit Required", badgeVariant: "deposit" },
    { value: "established-mc", label: "Established MCs (Older than 2 Years) — No Deposit Required", badge: "No Deposit", badgeVariant: "no-deposit" },
  ]

  const OTHER_SERVICES = [
    { key: "twicCard" as const, label: "TWIC Card Application — $360 (Same-day processing)", price: "$360" },
    { key: "trailerRental" as const, label: "Trailer Rental (3 months) — $500 (Subject to availability)", price: "$500" },
    { key: "factoringSetup" as const, label: "Factoring Setup — $250 (Same-day registration)", price: "$250" },
    { key: "insuranceAssistance" as const, label: "Insurance Assistance — $399 (Fast-track insurance quote & setup)", price: "$399" },
  ]

  const PAYMENT_METHODS = ["Factoring", "ACH DIRECT DEPOSIT METHOD", "Check"]

  const CLIENT_RESPONSIBILITIES = [
    "Provide accurate legal business and driver information",
    "Maintain active authority (MC/DOT) and valid insurance",
    "Communicate in a timely and professional manner",
    "Not engage in fraud, chargebacks, or misrepresentation",
  ]

  const LIABILITY_ITEMS = [
    "Any loss of income due to delays, market rates, or missed loads",
    "Legal or regulatory penalties due to false information provided by Client",
    "Broker cancellations or third-party payment processing delays",
  ]

  return (
    <div className="space-y-6">
      {/* Dedicated Lane Setup Options */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
            <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>
          <h3 className="text-sm font-bold text-white">Dedicated Lane Setup Options</h3>
        </div>
        <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg overflow-hidden divide-y divide-[#2a2a2a]">
          {LANE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex items-center justify-between px-4 py-3 cursor-pointer transition-colors",
                data.laneSetupOption === opt.value ? "bg-[#D4AF37]/5" : "hover:bg-[#1a1a1a]"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
                    data.laneSetupOption === opt.value ? "bg-[#D4AF37] border-[#D4AF37]" : "border-[#444]"
                  )}
                  onClick={() => setData({ ...data, laneSetupOption: opt.value })}
                >
                  {data.laneSetupOption === opt.value && <span className="text-black text-[8px] font-bold">✓</span>}
                </div>
                <input
                  type="radio"
                  name="laneSetupOption"
                  value={opt.value}
                  checked={data.laneSetupOption === opt.value}
                  onChange={() => setData({ ...data, laneSetupOption: opt.value })}
                  className="sr-only"
                />
                <span className="text-xs text-[#CBD5E1]">{opt.label}</span>
              </div>
              <span
                className={cn(
                  "shrink-0 ml-3 text-[10px] font-bold px-2 py-0.5 rounded",
                  opt.badgeVariant === "no-deposit"
                    ? "bg-[#1a2a1a] text-[#4ade80] border border-[#4ade80]/30"
                    : "bg-[#2a200a] text-[#D4AF37] border border-[#D4AF37]/30"
                )}
              >
                {opt.badge}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-2 bg-[#1a1a0a] border border-[#D4AF37]/20 rounded-md px-3 py-2">
          <p className="text-[10px] text-[#CBD5E1]">
            <strong className="text-[#D4AF37]">Note:</strong> A $460 Security deposit is required for applicable setups and is fully refundable after the first three successful deliveries.
          </p>
        </div>
      </div>

      {/* Select Other Services With Fees */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
            <span className="text-[#D4AF37] text-xs">⚠</span>
          </div>
          <h3 className="text-sm font-bold text-white">Select Other Services With Fees</h3>
        </div>
        <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg overflow-hidden divide-y divide-[#2a2a2a]">
          {OTHER_SERVICES.map((svc) => (
            <label
              key={svc.key}
              className={cn(
                "flex items-center justify-between px-4 py-3 cursor-pointer transition-colors",
                data.otherServices[svc.key] ? "bg-[#D4AF37]/5" : "hover:bg-[#1a1a1a]"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
                    data.otherServices[svc.key] ? "bg-[#D4AF37] border-[#D4AF37]" : "border-[#444]"
                  )}
                  onClick={() => setData({ ...data, otherServices: { ...data.otherServices, [svc.key]: !data.otherServices[svc.key] } })}
                >
                  {data.otherServices[svc.key] && <span className="text-black text-[8px] font-bold">✓</span>}
                </div>
                <input
                  type="checkbox"
                  checked={data.otherServices[svc.key]}
                  onChange={() => setData({ ...data, otherServices: { ...data.otherServices, [svc.key]: !data.otherServices[svc.key] } })}
                  className="sr-only"
                />
                <span className="text-xs text-[#CBD5E1]">{svc.label}</span>
              </div>
              <span className="shrink-0 ml-3 text-[10px] font-bold px-2 py-0.5 rounded bg-[#2a200a] text-[#D4AF37] border border-[#D4AF37]/30">
                {svc.price}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Method Selection */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
            <span className="text-[#D4AF37] text-xs">$</span>
          </div>
          <h3 className="text-sm font-bold text-white">Payment Method Selection</h3>
        </div>
        <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg overflow-hidden divide-y divide-[#2a2a2a]">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method}
              className={cn(
                "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                data.paymentMethod === method ? "bg-[#D4AF37]/5" : "hover:bg-[#1a1a1a]"
              )}
              onClick={() => setData({ ...data, paymentMethod: method })}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                  data.paymentMethod === method ? "border-[#D4AF37]" : "border-[#444]"
                )}
              >
                {data.paymentMethod === method && <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
              </div>
              <input type="radio" name="payment" value={method} checked={data.paymentMethod === method} onChange={() => {}} className="sr-only" />
              <span className="text-xs text-[#CBD5E1]">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Agreement Terms Summary */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
            <span className="text-[#D4AF37] text-xs">📋</span>
          </div>
          <h3 className="text-sm font-bold text-white">Agreement Terms Summary</h3>
        </div>

        <div className="space-y-4 text-xs text-[#CBD5E1] leading-relaxed">
          <div>
            <h4 className="font-bold text-[#D4AF37] mb-1">Payment Terms</h4>
            <p>Payment is due prior to service activation</p>
            <p>Payments may be processed via third-party accounts to enable same-day service</p>
            <p>A digital receipt will be issued upon payment</p>
          </div>

          <div>
            <h4 className="font-bold text-[#D4AF37] mb-1">Refund Policy</h4>
            <p>The $460 dedicated lane setup fee is refundable after the Client completes their first three successful deliveries arranged by the Company</p>
            <p>Other service fees are non-refundable once service begins, as these are time-sensitive administrative tasks</p>
            <p>Refunds will be issued via the original payment method within 5–7 business days, if applicable</p>
          </div>

          <div>
            <h4 className="font-bold text-[#D4AF37] mb-1">Client Responsibilities</h4>
            <p className="mb-2">The Client agrees to:</p>
            <div className="bg-[#161616] border border-[#2a2a2a] rounded-md px-4 py-3 space-y-1.5">
              {CLIENT_RESPONSIBILITIES.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-0.5 shrink-0">●</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#D4AF37] mb-1">No Employer-Employee Relationship</h4>
            <p>This Agreement does not create an employment relationship. The Client is an independent carrier and assumes all responsibility for tax, insurance, regulatory compliance, and FMCSA obligations.</p>
          </div>

          <div>
            <h4 className="font-bold text-[#D4AF37] mb-1">Limitation of Liability</h4>
            <p className="mb-2">The Company is not liable for:</p>
            <div className="bg-[#2a1010] border border-[#cc3333]/30 rounded-md px-4 py-3 space-y-1.5">
              {LIABILITY_ITEMS.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="text-[#cc4444] mt-0.5 shrink-0">●</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#D4AF37] mb-1">Term and Termination</h4>
            <p>This agreement becomes effective upon payment and remains active until the completion of the contracted services. Either party may terminate in writing at any time. Refund terms apply as per Section 4.</p>
          </div>

          <div>
            <h4 className="font-bold text-[#D4AF37] mb-1">Entire Agreement</h4>
            <p>This Agreement contains the entire understanding between both parties and supersedes all prior agreements, written or oral.</p>
          </div>
        </div>
      </div>

      {/* Signature fields */}
      <div className="border-t border-[#2a2a2a] pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <FieldLabel>Signature</FieldLabel>
            <TextInput placeholder="Enter Full Signature" value={data.signature} onChange={(v) => setData({ ...data, signature: v })} />
          </div>
          <div>
            <FieldLabel>Print Name</FieldLabel>
            <TextInput placeholder="Enter Print Name" value={data.printName} onChange={(v) => setData({ ...data, printName: v })} />
          </div>
          <div>
            <FieldLabel>Date</FieldLabel>
            <div className="w-full bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 text-sm text-[#94A3B8]">
              {TODAY_DMY}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ data }: { data: FormData }) {
  return (
    <div className="text-center py-8">
      <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-7 h-7 text-[#D4AF37]" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Agreement Submitted!</h2>
      <p className="text-sm text-[#94A3B8] mb-6">
        Thank you, <strong className="text-white">{data.carrierFullName || "Carrier"}</strong>. Your Carrier Setup Agreement has been received.
        A confirmation will be sent to <strong className="text-white">{data.email || "your email"}</strong>.
      </p>
      <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-4 text-left text-xs space-y-1.5 text-[#94A3B8] mb-6 max-w-sm mx-auto">
        <div><span className="text-white">Carrier:</span> {data.carrierFullName}</div>
        {data.mcNumber && <div><span className="text-white">MC #:</span> {data.mcNumber}</div>}
        {data.dotNumber && <div><span className="text-white">DOT #:</span> {data.dotNumber}</div>}
        <div><span className="text-white">Payment:</span> {data.paymentMethod || "—"}</div>
        <div><span className="text-white">Date:</span> {TODAY}</div>
      </div>
      <a
        href="/"
        className="inline-block bg-[#D4AF37] text-black text-sm font-bold px-6 py-2.5 rounded-md hover:bg-[#C9A227] transition-colors"
      >
        Done
      </a>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CarrierSetupAgreement() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)

  function canProceed(): boolean {
    if (step === 0) return data.dispatchCompany !== ""
    if (step === 1) return data.carrierFullName !== "" && data.email !== ""
    if (step === 2) return data.laneSetupOption !== "" && data.paymentMethod !== "" && data.signature !== "" && data.printName !== ""
    return true
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-start justify-center p-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-3">
            <Truck className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Carrier Setup Agreement</h1>
          <p className="text-xs text-[#94A3B8] mt-1">Dedicated Lanes, Dispatch, Trailer Rental, and Setup Services</p>
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full px-3 py-1 mt-3">
            <span className="text-[10px] text-[#D4AF37] font-semibold">📅 Agreement Date: {TODAY}</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6 shadow-2xl">
          {submitted ? (
            <SuccessScreen data={data} />
          ) : (
            <>
              <ProgressBar step={step} />

              <div className="mb-6">
                {step === 0 && <StepCompanyInfo data={data} setData={setData} />}
                {step === 1 && <StepCarrierInfo data={data} setData={setData} />}
                {step === 2 && <StepServicesFinal data={data} setData={setData} />}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-4 border-t border-[#2a2a2a]">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all",
                    step === 0
                      ? "text-[#444] cursor-not-allowed"
                      : "text-[#94A3B8] hover:text-white hover:bg-[#1a1a1a]"
                  )}
                >
                  ← Previous
                </button>

                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canProceed()}
                    className={cn(
                      "flex items-center gap-1.5 px-5 py-2 rounded-md text-sm font-bold transition-all",
                      canProceed()
                        ? "bg-[#D4AF37] text-black hover:bg-[#C9A227]"
                        : "bg-[#2a2a2a] text-[#555] cursor-not-allowed"
                    )}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed()}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2 rounded-md text-sm font-bold transition-all",
                      canProceed()
                        ? "bg-[#D4AF37] text-black hover:bg-[#C9A227]"
                        : "bg-[#2a2a2a] text-[#555] cursor-not-allowed"
                    )}
                  >
                    <Send className="w-4 h-4" />
                    Submit Agreement
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
