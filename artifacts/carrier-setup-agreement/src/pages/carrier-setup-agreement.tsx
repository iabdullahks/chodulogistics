import { useState } from "react"
import { Truck, CheckCircle2, Loader2, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import BrandLogo from "@/components/BrandLogo"
import { jsPDF } from "jspdf"

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
  "BROKERAGE COMPANY OF AMERICAN INC",
  "Prime Dispatch Services",
  "Eagle Freight Dispatch",
  "American Truck Dispatch",
  "Nationwide Dispatch Group",
  "Other",
]

const LANE_LABEL: Record<string, string> = {
  "dot-only": "DOT-Only Carriers (Intrastate Loads) — Security Deposit Required",
  "new-mc": "New MCs (Less than 2 Years Old) — Security Deposit Required",
  "broker-authority": "Under Broker's Authority — Security Deposit Required",
  "established-mc": "Established MCs (Older than 2 Years) — No Deposit Required",
}

const TODAY = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
})

const TODAY_ISO = new Date().toISOString().split("T")[0]
const TODAY_DMY = new Date().toLocaleDateString("en-GB").replace(/\//g, "/")

// ─── PDF Generator ───────────────────────────────────────────────────────────

function generatePDF(data: FormData): string {
  const doc = new jsPDF({ unit: "pt", format: "letter" })
  const W = doc.internal.pageSize.getWidth()
  const margin = 56
  let y = margin

  const addPage = () => {
    doc.addPage()
    y = margin
  }

  const checkPage = (needed = 40) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) addPage()
  }

  const selectedServices: string[] = []
  if (data.otherServices.twicCard) selectedServices.push("TWIC Card Application — $360 (Same-day processing)")
  if (data.otherServices.trailerRental) selectedServices.push("Trailer Rental (3 months) — $500 (Subject to availability)")
  if (data.otherServices.factoringSetup) selectedServices.push("Factoring Setup — $250 (Same-day registration)")
  if (data.otherServices.insuranceAssistance) selectedServices.push("Insurance Assistance — $399 (Fast-track insurance quote & setup)")

  // ── Header bar ──
  doc.setFillColor(13, 13, 13)
  doc.rect(0, 0, W, 68, "F")

  // Gold circle logo placeholder
  doc.setFillColor(212, 175, 55)
  doc.circle(margin + 20, 34, 18, "F")
  doc.setTextColor(13, 13, 13)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("B", margin + 20, 39, { align: "center" })

  // Company name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("BROKERAGE COMPANY OF AMERICAN INC", margin + 46, 30)
  doc.setTextColor(212, 175, 55)
  doc.setFontSize(8.5)
  doc.text("MC #: 130697  |  DOT #: 2217864  |  50 Emjay Blvd, Brentwood, NY 11786", margin + 46, 46)
  doc.setTextColor(180, 180, 180)
  doc.setFontSize(7.5)
  doc.text("winston@brokeragecompanyofamericaninc.com", margin + 46, 59)

  y = 90

  // ── Title ──
  doc.setTextColor(13, 13, 13)
  doc.setFontSize(15)
  doc.setFont("helvetica", "bold")
  doc.text("TRUCKING SERVICE AGREEMENT", W / 2, y, { align: "center" })
  y += 14
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(80, 80, 80)
  doc.text("(Dedicated Lanes, Dispatch, Trailer Rental, and Setup Services)", W / 2, y, { align: "center" })
  y += 18

  // Gold divider
  doc.setDrawColor(212, 175, 55)
  doc.setLineWidth(1.2)
  doc.line(margin, y, W - margin, y)
  y += 16

  // ── Parties ──
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  doc.setFont("helvetica", "normal")
  const partyText = [
    `This Agreement is made and entered into on ${TODAY_ISO}, by and between: BROKERAGE COMPANY OF AMERICAN INC`,
    `MC #: 130697 | DOT #: 2217864`,
    `Address: 50 EMJAY BLVD BRENTWOOD, NY 11786`,
    `Email: winston@brokeragecompanyofamericaninc.com`,
    ``,
    `Dispatch Company: ${data.dispatchCompany}`,
    `(Hereinafter referred to as the BROKERAGE COMPANY OF AMERICAN INC)`,
  ]
  partyText.forEach((line) => {
    checkPage()
    doc.text(line, margin, y)
    y += 13
  })
  y += 6

  // ── Section helper ──
  const sectionTitle = (title: string) => {
    checkPage(30)
    doc.setFillColor(245, 245, 245)
    doc.rect(margin, y - 10, W - margin * 2, 18, "F")
    doc.setDrawColor(212, 175, 55)
    doc.setLineWidth(0.6)
    doc.rect(margin, y - 10, W - margin * 2, 18)
    doc.setFontSize(9.5)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(13, 13, 13)
    doc.text(title, margin + 6, y + 3)
    y += 18
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(50, 50, 50)
  }

  const bullet = (text: string) => {
    checkPage()
    doc.text(`• ${text}`, margin + 10, y)
    y += 13
  }

  const field = (label: string, value: string) => {
    checkPage()
    doc.setFont("helvetica", "bold")
    doc.text(`${label}:`, margin, y)
    doc.setFont("helvetica", "normal")
    const lw = doc.getTextWidth(`${label}: `)
    doc.text(value || "—", margin + lw, y)
    y += 13
  }

  const bodyText = (text: string) => {
    checkPage()
    const lines = doc.splitTextToSize(text, W - margin * 2)
    lines.forEach((l: string) => {
      checkPage()
      doc.text(l, margin, y)
      y += 13
    })
  }

  // ── Carrier Information ──
  y += 4
  sectionTitle("Carrier Information")
  y += 4
  field("Carrier Full Name", data.carrierFullName)
  field("Company Name (if applicable)", data.companyName || "N/A")
  field("MC Number", data.mcNumber || "N/A")
  field("DOT Number", data.dotNumber || "N/A")
  field("Driving License Number", data.drivingLicense || "N/A")
  field("Carrier Phone Number", data.phone || "N/A")
  field("Email", data.email || "N/A")
  y += 8

  // ── Purpose of Agreement ──
  sectionTitle("Purpose of Agreement")
  y += 4
  bodyText(
    "This Agreement outlines the terms and conditions under which the Company provides setup and logistics services to the Client, including but not limited to:"
  )
  y += 4
  bullet("Dedicated freight lanes")
  bullet("Dispatch assistance")
  bullet("Trailer rental")
  bullet("TWIC card application support")
  bullet("Commercial insurance setup")
  bullet("Factoring registration")
  y += 4
  bodyText("Access to high-paying loads through partnered shippers including Amazon & government contracts")
  y += 8

  // ── Lane Setup Option ──
  sectionTitle("Selected Dedicated Lane Setup Option")
  y += 4
  bodyText(LANE_LABEL[data.laneSetupOption] || data.laneSetupOption || "—")
  y += 4
  doc.setFontSize(8.5)
  doc.setTextColor(120, 90, 0)
  bodyText(
    "Note: A $460 Security deposit is required for applicable setups and is fully refundable after the first three successful deliveries."
  )
  doc.setTextColor(50, 50, 50)
  doc.setFontSize(9)
  y += 8

  // ── Services ──
  sectionTitle("Selected Services With Fees")
  y += 4
  if (selectedServices.length === 0) {
    bodyText("No additional services selected.")
  } else {
    selectedServices.forEach(bullet)
  }
  y += 8

  // ── Payment ──
  sectionTitle("Payment Method")
  y += 4
  field("Selected Payment Method", data.paymentMethod)
  y += 4
  bullet("Payment is due prior to service activation")
  bullet("Payments may be processed via third-party accounts to enable same-day service")
  bullet("A digital receipt will be issued upon payment")
  y += 8

  // ── Refund Policy ──
  sectionTitle("Refund Policy")
  y += 4
  bullet("The $460 dedicated lane setup fee is refundable after the Client completes their first three successful deliveries arranged by the Company")
  bullet("Other service fees are non-refundable once service begins, as these are time-sensitive administrative tasks")
  bullet("Refunds will be issued via the original payment method within 5–7 business days, if applicable")
  y += 8

  // ── Client Responsibilities ──
  sectionTitle("Client Responsibilities")
  y += 4
  bodyText("The Client agrees to:")
  y += 4
  bullet("Provide accurate legal business and driver information")
  bullet("Maintain active authority (MC/DOT) and valid insurance, unless Company is assisting with setup")
  bullet("Communicate in a timely and professional manner")
  bullet("Not engage in fraud, chargebacks, or misrepresentation")
  y += 8

  // ── No Employment ──
  sectionTitle("No Employer-Employee Relationship")
  y += 4
  bodyText(
    "This Agreement does not create an employment relationship. The Client is an independent carrier and assumes all responsibility for tax, insurance, regulatory compliance, and FMCSA obligations."
  )
  y += 8

  // ── Liability ──
  sectionTitle("Limitation of Liability")
  y += 4
  bodyText("The Company is not liable for:")
  y += 4
  bullet("Any loss of income due to delays, market rates, or missed loads")
  bullet("Legal or regulatory penalties due to false or missing information provided by the Client")
  bullet("Broker cancellations or third-party payment processing delays")
  y += 8

  // ── Term ──
  sectionTitle("Term and Termination")
  y += 4
  bodyText(
    "This agreement becomes effective upon payment and remains active until the completion of the contracted services. Either party may terminate in writing at any time. Refund terms apply as per Section 4."
  )
  y += 8

  // ── Entire Agreement ──
  sectionTitle("Entire Agreement")
  y += 4
  bodyText(
    "This Agreement contains the entire understanding between both parties and supersedes all prior agreements, written or oral."
  )
  y += 16

  // ── Signatures ──
  checkPage(90)
  doc.setDrawColor(212, 175, 55)
  doc.setLineWidth(1)
  doc.line(margin, y, W - margin, y)
  y += 16

  doc.setFontSize(9.5)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(13, 13, 13)
  doc.text("Carrier Details", margin, y)
  y += 14

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)

  // Carrier signature block
  const halfW = (W - margin * 2) / 2 - 10
  doc.setFont("helvetica", "bold")
  doc.text("Signature:", margin, y)
  doc.setFont("helvetica", "normal")
  doc.text(data.signature, margin + 60, y)
  doc.line(margin + 60, y + 2, margin + 60 + halfW - 30, y + 2)
  y += 20
  doc.setFont("helvetica", "bold")
  doc.text("Print Name:", margin, y)
  doc.setFont("helvetica", "normal")
  doc.text(data.printName, margin + 60, y)
  y += 20
  doc.setFont("helvetica", "bold")
  doc.text("Date:", margin, y)
  doc.setFont("helvetica", "normal")
  doc.text(TODAY_ISO, margin + 60, y)
  y += 28

  // Company representative block
  doc.setFontSize(9.5)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(13, 13, 13)
  doc.text("Dispatch/Service Provider Representative", margin, y)
  y += 14
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(50, 50, 50)
  doc.text("BROKERAGE COMPANY OF AMERICAN INC", margin, y)
  y += 13
  doc.text(`Date: ${TODAY_ISO}`, margin, y)
  y += 20

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7.5)
    doc.setTextColor(160, 160, 160)
    doc.text(
      `Brokerage Company of American INC  ·  50 Emjay Blvd, Brentwood, NY 11786  ·  Page ${i} of ${pageCount}`,
      W / 2,
      doc.internal.pageSize.getHeight() - 24,
      { align: "center" }
    )
  }

  return doc.output("datauristring").split(",")[1]
}

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
        <strong className="text-white">BROKERAGE COMPANY OF AMERICAN INC</strong>
        <br />
        MC #: <strong className="text-white">130697</strong> | DOT #: <strong className="text-white">2217864</strong>
        <br />
        Address: <strong className="text-white">50 EMJAY BLVD, BRENTWOOD, NY 11786</strong>
        <br />
        Email: <strong className="text-white">winston@brokeragecompanyofamericaninc.com</strong>
      </div>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-md px-4 py-3 mb-5">
        <p className="text-xs text-[#CBD5E1]">
          <strong className="text-white">Important:</strong> The Client should only respond to verified contacts from
          the Company or the following trusted dispatch partners:
        </p>
      </div>

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

      <p className="text-xs text-[#94A3B8] italic">
        (Hereinafter referred to as the BROKERAGE COMPANY OF AMERICAN INC)
      </p>
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

      <div className="border-t border-[#2a2a2a] pt-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
            <span className="text-[#D4AF37] text-xs font-bold">⊕</span>
          </div>
          <h3 className="text-sm font-bold text-white">Purpose of Agreement</h3>
        </div>
        <p className="text-xs text-[#94A3B8] mb-3">
          This Agreement outlines the terms and conditions under which the Company provides setup and logistics
          services to the Client, including but not limited to:
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
            <strong className="text-[#D4AF37]">Note:</strong> A $460 Security deposit is required for applicable
            setups and is fully refundable after the first three successful deliveries.
          </p>
        </div>
      </div>

      {/* Other Services */}
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
                  onClick={() =>
                    setData({ ...data, otherServices: { ...data.otherServices, [svc.key]: !data.otherServices[svc.key] } })
                  }
                >
                  {data.otherServices[svc.key] && <span className="text-black text-[8px] font-bold">✓</span>}
                </div>
                <input
                  type="checkbox"
                  checked={data.otherServices[svc.key]}
                  onChange={() =>
                    setData({ ...data, otherServices: { ...data.otherServices, [svc.key]: !data.otherServices[svc.key] } })
                  }
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

      {/* Payment Method */}
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

function SuccessScreen({ data, emailSent }: { data: FormData; emailSent: boolean }) {
  return (
    <div className="text-center py-8">
      <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-7 h-7 text-[#D4AF37]" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Agreement Submitted!</h2>
      <p className="text-sm text-[#94A3B8] mb-2">
        Thank you, <strong className="text-white">{data.carrierFullName || "Carrier"}</strong>. Your Carrier Setup Agreement has been received.
      </p>
      {emailSent ? (
        <p className="text-xs text-[#4ade80] mb-6">
          ✓ A signed PDF copy has been sent to our team and a confirmation to{" "}
          <strong className="text-white">{data.email}</strong>.
        </p>
      ) : (
        <p className="text-xs text-[#94A3B8] mb-6">
          Your agreement has been recorded. A confirmation will follow shortly.
        </p>
      )}
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function canProceed(): boolean {
    if (step === 0) return data.dispatchCompany !== ""
    if (step === 1) return data.carrierFullName !== "" && data.email !== ""
    if (step === 2) return data.laneSetupOption !== "" && data.paymentMethod !== "" && data.signature !== "" && data.printName !== ""
    return true
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      // 1. Generate PDF
      const pdfBase64 = generatePDF(data)

      // 2. Send to API
      const apiBase = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? ""
      const res = await fetch(`${apiBase}/api/carrier-agreement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: data, pdfBase64 }),
      })

      setEmailSent(res.ok)
    } catch {
      setEmailSent(false)
    } finally {
      setIsSubmitting(false)
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-start justify-center p-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandLogo size={64} />
          </div>
          <h1 className="text-2xl font-bold text-white">Carrier Setup Agreement</h1>
          <p className="text-xs text-[#D4AF37] font-semibold mt-0.5 tracking-wide">
            BROKERAGE COMPANY OF AMERICAN INC
          </p>
          <p className="text-xs text-[#94A3B8] mt-1">Dedicated Lanes, Dispatch, Trailer Rental, and Setup Services</p>
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full px-3 py-1 mt-3">
            <span className="text-[10px] text-[#D4AF37] font-semibold">📅 Agreement Date: {TODAY}</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6 shadow-2xl">
          {submitted ? (
            <SuccessScreen data={data} emailSent={emailSent} />
          ) : (
            <>
              <ProgressBar step={step} />

              <div className="mb-6">
                {step === 0 && <StepCompanyInfo data={data} setData={setData} />}
                {step === 1 && <StepCarrierInfo data={data} setData={setData} />}
                {step === 2 && <StepServicesFinal data={data} setData={setData} />}
              </div>

              {submitError && (
                <p className="text-xs text-red-400 text-center mb-3">{submitError}</p>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-4 border-t border-[#2a2a2a]">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0 || isSubmitting}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all",
                    step === 0 || isSubmitting
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
                    disabled={!canProceed() || isSubmitting}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2 rounded-md text-sm font-bold transition-all",
                      canProceed() && !isSubmitting
                        ? "bg-[#D4AF37] text-black hover:bg-[#C9A227]"
                        : "bg-[#2a2a2a] text-[#555] cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending Agreement…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Agreement
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-[#444] mt-4">
          Brokerage Company of American INC · 50 Emjay Blvd, Brentwood, NY 11786
        </p>
      </div>
    </div>
  )
}
