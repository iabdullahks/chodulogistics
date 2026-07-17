import { useState } from "react"
import { Key, CheckCircle2, Truck, Send } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ──────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1
  clientFullName: string
  businessName: string
  businessAddress: string
  email: string
  phone: string
  usdotMc: string
  // Step 2
  services: {
    fullService: boolean
    expedited: boolean
    renewal: boolean
  }
  paymentMethod: string
  transactionNotes: string
  // Step 3
  agreedToTerms: boolean
  // Step 4
  clientSignature: string
  printedName: string
}

const INITIAL_FORM: FormData = {
  clientFullName: "",
  businessName: "",
  businessAddress: "",
  email: "",
  phone: "",
  usdotMc: "",
  services: { fullService: true, expedited: true, renewal: true },
  paymentMethod: "",
  transactionNotes: "",
  agreedToTerms: false,
  clientSignature: "",
  printedName: "",
}

const STEPS = [
  { label: "Company Info" },
  { label: "Service & Payment" },
  { label: "Terms & Conditions" },
  { label: "Signatures" },
  { label: "Certificate" },
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

// ─── Step 1: Company Information ─────────────────────────────────────────────

function StepCompanyInfo({ data, setData }: { data: FormData; setData: (d: FormData) => void }) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-black text-xs font-bold">1</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Step 1: Company Information</h2>
          <p className="text-xs text-[#94A3B8]">Agreement details between TARA LOGISTICS LLC and Client</p>
        </div>
      </div>

      <div className="text-xs text-[#CBD5E1] leading-relaxed mb-5 border-b border-[#2a2a2a] pb-5">
        This Agreement is made and entered into on <strong className="text-white">{TODAY}</strong>, by and between:{" "}
        <strong className="text-white">TARA LOGISTICS LLC</strong> (Service Provider)
        <br />
        MC #: 1551407 | DOT #: 4079068
        <br />
        Address: 1308 WESLEY AVE BERWYN, IL 60402
        <br />
        Email: fred@taralogisticsllc.com
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <FieldLabel>Client Full Legal Name</FieldLabel>
          <TextInput
            placeholder="Enter Full Name"
            value={data.clientFullName}
            onChange={(v) => setData({ ...data, clientFullName: v })}
          />
        </div>
        <div>
          <FieldLabel>Business Name</FieldLabel>
          <TextInput
            placeholder="Enter Business Name"
            value={data.businessName}
            onChange={(v) => setData({ ...data, businessName: v })}
          />
        </div>
        <div>
          <FieldLabel>Business Address</FieldLabel>
          <TextInput
            placeholder="Street, City, State, ZIP"
            value={data.businessAddress}
            onChange={(v) => setData({ ...data, businessAddress: v })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div>
          <FieldLabel>Email Address</FieldLabel>
          <TextInput
            placeholder="client@example.com"
            type="email"
            value={data.email}
            onChange={(v) => setData({ ...data, email: v })}
          />
        </div>
        <div>
          <FieldLabel>Phone Number</FieldLabel>
          <TextInput
            placeholder="+1 (555) 000-9999"
            type="tel"
            value={data.phone}
            onChange={(v) => setData({ ...data, phone: v })}
          />
        </div>
        <div>
          <FieldLabel>USDOT / MC Number</FieldLabel>
          <TextInput
            placeholder="DOT / MC #"
            value={data.usdotMc}
            onChange={(v) => setData({ ...data, usdotMc: v })}
          />
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-md px-4 py-3 text-xs text-[#94A3B8]">
        <span className="text-white font-semibold">Information:</span> This agreement covers liquor permit application assistance for alcohol transportation across state lines.
      </div>
    </div>
  )
}

// ─── Step 2: Service & Payment ────────────────────────────────────────────────

const SERVICES = [
  { key: "fullService" as const, label: "Liquor Permit Application Assistance (Full Service)", price: "$399" },
  { key: "expedited" as const, label: "Expedited Processing (48-hour submission guarantee)", price: "$150" },
  { key: "renewal" as const, label: "Annual Permit Renewal Service", price: "$299" },
]

const PAYMENT_METHODS = ["Zelle", "BTC (Bitcoin)", "Remitly", "Wire Transfer", "Check"]

function StepServicePayment({ data, setData }: { data: FormData; setData: (d: FormData) => void }) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-black text-xs font-bold">2</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Step 2: Service &amp; Payment</h2>
          <p className="text-xs text-[#94A3B8]">Select services and payment method</p>
        </div>
      </div>

      {/* Services */}
      <div className="space-y-2 mb-6">
        {SERVICES.map((svc) => (
          <label
            key={svc.key}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-md border cursor-pointer transition-all",
              data.services[svc.key]
                ? "border-[#D4AF37]/60 bg-[#D4AF37]/5"
                : "border-[#333] bg-[#1a1a1a] hover:border-[#444]"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                  data.services[svc.key] ? "border-[#D4AF37] bg-[#D4AF37]" : "border-[#555]"
                )}
              >
                {data.services[svc.key] && (
                  <svg className="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={data.services[svc.key]}
                onChange={(e) =>
                  setData({ ...data, services: { ...data.services, [svc.key]: e.target.checked } })
                }
              />
              <span className="text-sm text-[#CBD5E1]">{svc.label}</span>
            </div>
            <span className="text-sm font-bold text-[#D4AF37] ml-4 shrink-0">{svc.price}</span>
          </label>
        ))}
      </div>

      {/* Payment Method */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-[#D4AF37] inline-block" />
          Payment Method
        </h3>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-md border cursor-pointer transition-all",
                data.paymentMethod === method
                  ? "border-[#D4AF37]/60 bg-[#D4AF37]/5"
                  : "border-[#333] bg-[#1a1a1a] hover:border-[#444]"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  data.paymentMethod === method ? "border-[#D4AF37]" : "border-[#555]"
                )}
              >
                {data.paymentMethod === method && (
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                )}
              </div>
              <input
                type="radio"
                className="sr-only"
                name="paymentMethod"
                value={method}
                checked={data.paymentMethod === method}
                onChange={() => setData({ ...data, paymentMethod: method })}
              />
              <span className="text-sm text-[#CBD5E1]">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-5">
        <FieldLabel>Additional Notes / Transaction Reference</FieldLabel>
        <textarea
          placeholder="Any special instructions or reference number..."
          value={data.transactionNotes}
          onChange={(e) => setData({ ...data, transactionNotes: e.target.value })}
          rows={3}
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all resize-none"
        />
      </div>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-md px-4 py-3 text-xs text-[#94A3B8]">
        <span className="text-white font-semibold">Note:</span> Total due based on selected services. Payment due upon signing. 100% approval guarantee or full refund (if denial due to Company error).
      </div>
    </div>
  )
}

// ─── Step 3: Terms & Conditions ───────────────────────────────────────────────

function StepTerms({ data, setData }: { data: FormData; setData: (d: FormData) => void }) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-black text-xs font-bold">3</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Step 3: Terms &amp; Conditions</h2>
          <p className="text-xs text-[#94A3B8]">Legal terms, guarantee, and responsibilities</p>
        </div>
      </div>

      <div className="space-y-5 text-sm text-[#CBD5E1] mb-6">
        <div>
          <h3 className="font-semibold text-white mb-1.5">Guarantee of Approval</h3>
          <p className="text-xs leading-relaxed">
            TARA LOGISTICS LLC guarantees liquor permit approval provided the client supplies complete, accurate, and truthful documentation. If denial occurs due to Company error, 100% refund will be issued. No refund if denial is due to false or misleading information provided by client.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-2">Client Responsibilities</h3>
          <div className="bg-[#1a1a1a] border border-[#333] rounded-md px-4 py-3 space-y-1.5">
            {[
              "Provide accurate legal business and driver information",
              "Cooperate in a timely manner with document requests",
              "Comply with all state and federal alcohol transportation laws",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#94A3B8]">
                <span className="text-[#D4AF37] mt-0.5 shrink-0">•</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-1.5">Timeline</h3>
          <p className="text-xs leading-relaxed">
            Company will submit application within 5 business days of receiving signed agreement and full payment. State processing times vary from 2–8 weeks depending on jurisdiction.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-1.5">Limitation of Liability</h3>
          <p className="text-xs leading-relaxed">
            Company liability is limited to the total fees paid by client. Company is not responsible for delays caused by state agencies or third parties.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-1.5">Term and Termination</h3>
          <p className="text-xs leading-relaxed">
            This agreement becomes effective upon payment and remains active until permit is issued or refund is processed per guarantee clause. Either party may terminate in writing.
          </p>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          className={cn(
            "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
            data.agreedToTerms ? "border-[#D4AF37] bg-[#D4AF37]" : "border-[#555] group-hover:border-[#888]"
          )}
          onClick={() => setData({ ...data, agreedToTerms: !data.agreedToTerms })}
        >
          {data.agreedToTerms && (
            <svg className="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          className="sr-only"
          checked={data.agreedToTerms}
          onChange={(e) => setData({ ...data, agreedToTerms: e.target.checked })}
        />
        <span className="text-xs text-[#94A3B8] group-hover:text-[#CBD5E1] transition-colors">
          I confirm that I have read and agree to all terms, conditions, and the guarantee clause above.
        </span>
      </label>
    </div>
  )
}

// ─── Step 4: Signatures ───────────────────────────────────────────────────────

function StepSignatures({ data, setData }: { data: FormData; setData: (d: FormData) => void }) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-black text-xs font-bold">4</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Step 4: Signatures</h2>
          <p className="text-xs text-[#94A3B8]">Execute this agreement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div>
          <FieldLabel>Client Signature (Type Full Name)</FieldLabel>
          <TextInput
            placeholder="Enter Full Signature"
            value={data.clientSignature}
            onChange={(v) => setData({ ...data, clientSignature: v })}
          />
        </div>
        <div>
          <FieldLabel>Printed Name</FieldLabel>
          <TextInput
            placeholder="Enter Printed Name"
            value={data.printedName}
            onChange={(v) => setData({ ...data, printedName: v })}
          />
        </div>
        <div>
          <FieldLabel>Date</FieldLabel>
          <input
            type="text"
            readOnly
            value={TODAY_DMY}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 text-sm text-white focus:outline-none cursor-default"
          />
        </div>
      </div>

      <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-md px-4 py-3 text-xs text-[#CBD5E1] leading-relaxed">
        <span className="font-semibold text-[#D4AF37]">Provider Representative:</span> TARA LOGISTICS LLC – Joseph (Authorized Signatory)
        <br />
        Effective Date: {TODAY}
        <br />
        This agreement becomes binding upon submission and payment confirmation.
      </div>
    </div>
  )
}

// ─── Step 5: FMCSA Certificate ────────────────────────────────────────────────

function StepCertificate({ data }: { data: FormData }) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-5">
        <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-black text-xs font-bold">5</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Step 5: FMCSA Certificate</h2>
          <p className="text-xs text-[#94A3B8]">Official authorization reference</p>
        </div>
      </div>

      {/* Certificate document */}
      <div className="bg-white rounded-md overflow-hidden border border-[#333] text-[#111]">
        {/* Header row */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
              <Truck className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="font-bold text-sm">U.S. Department of Transportation</div>
              <div className="text-xs text-gray-500">Federal Motor Carrier Safety Administration</div>
            </div>
          </div>
          <div className="text-right text-xs text-gray-600">
            <div>1200 New Jersey Ave., S.E.</div>
            <div>Washington, DC 20590</div>
            <div className="mt-1 font-semibold text-gray-700">SERVICE DATE</div>
            <div>{TODAY}</div>
          </div>
        </div>

        {/* Certificate body */}
        <div className="px-6 py-5 text-center border-b border-gray-200">
          <div className="font-bold text-base mb-1 tracking-wide">CERTIFICATE</div>
          <div className="text-sm font-semibold">MC-1551407</div>
          <div className="text-xs text-gray-600">U.S. DOT No. 4079068</div>
          <div className="text-sm font-semibold mt-1">TARA LOGISTICS LLC</div>
          <div className="text-xs text-gray-600">1308 WESLEY AVE BERWYN, IL 60402</div>
        </div>

        <div className="px-6 py-4 text-xs text-gray-700 leading-relaxed border-b border-gray-200 space-y-2">
          <p>
            This License is evidence of the applicant's authority to engage in operations, in interstate or foreign commerce, as a broker arranging for transportation of freight (except household goods) by Motor Vehicle, including alcohol/liquor transport where permitted by state law.
          </p>
          <p>
            This authority is effective as long as the broker maintains insurance coverage (49 CFR 387) and agent designation (49 CFR 366). Failure to maintain compliance will constitute grounds for revocation.
          </p>
          <div className="text-center mt-3">
            <div className="font-semibold">Jeffrey L. Secrist, Chief</div>
            <div>Information Technology Operations Division</div>
          </div>
        </div>

        {/* Note */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="border border-gray-300 rounded px-3 py-2 text-xs text-gray-700">
            <span className="font-bold">NOTE:</span> Willful noncompliance with applicable safety fitness regulations could result in suspension or revocation of this authority.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-between text-xs border-b border-gray-200">
          <div>
            <div className="text-gray-500 mb-0.5">Dispatch/Service Provider Representative</div>
            <div className="font-bold">TARA LOGISTICS LLC</div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 mb-0.5">Date</div>
            <div className="font-bold">{TODAY}</div>
          </div>
        </div>

        {/* Confirmation */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="border border-gray-300 rounded px-3 py-2 text-xs text-gray-700">
            <span className="font-semibold">Confirmation:</span> By submitting this agreement, client acknowledges receipt of liquor permit service terms and FMCSA representation.
            {data.clientFullName && (
              <span className="ml-1">Client: <strong>{data.clientFullName}</strong>.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round(((step + 1) / STEPS.length) * 100)
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-[#94A3B8] font-medium">Application Progress</span>
        <span className="text-xs font-bold text-[#D4AF37]">{pct}%</span>
      </div>

      {/* Track */}
      <div className="relative h-1 bg-[#2a2a2a] rounded-full mb-3">
        <div
          className="h-1 rounded-full bg-[#D4AF37] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Step labels */}
      <div className="flex justify-between">
        {STEPS.map((s, i) => {
          const done = i < step
          const active = i === step
          return (
            <div key={i} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  done
                    ? "border-[#D4AF37] bg-[#D4AF37]"
                    : active
                    ? "border-[#D4AF37] bg-transparent"
                    : "border-[#444] bg-transparent"
                )}
              >
                {done ? (
                  <svg className="w-3 h-3" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : active ? (
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                ) : null}
              </div>
              <span
                className={cn(
                  "text-[9px] text-center leading-tight hidden sm:block",
                  active ? "text-[#D4AF37] font-semibold" : done ? "text-[#94A3B8]" : "text-[#555]"
                )}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LiquorPermitServiceAgreement() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)

  function canProceed() {
    if (step === 0) return data.clientFullName.trim() !== "" && data.email.trim() !== ""
    if (step === 1) return data.paymentMethod !== ""
    if (step === 2) return data.agreedToTerms
    if (step === 3) return data.clientSignature.trim() !== "" && data.printedName.trim() !== ""
    return true
  }

  function handleSubmit() {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Agreement Submitted!</h2>
          <p className="text-sm text-[#94A3B8] mb-6">
            Thank you, <strong className="text-white">{data.clientFullName || "Client"}</strong>. Your Liquor Permit Service Agreement has been submitted. TARA LOGISTICS LLC will process your application within 5 business days.
          </p>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-4 py-3 text-left text-xs text-[#94A3B8] space-y-1 mb-6">
            <div><span className="text-white">Email:</span> {data.email}</div>
            <div><span className="text-white">Payment:</span> {data.paymentMethod}</div>
            <div><span className="text-white">Date:</span> {TODAY}</div>
          </div>
          <a href="/" className="inline-block bg-[#D4AF37] text-black text-sm font-bold px-6 py-2.5 rounded-md hover:bg-[#C9A227] transition-colors">
            Back to Services
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-start justify-center p-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-3">
            <Key className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Liquor Permit Service Agreement</h1>
          <p className="text-xs text-[#94A3B8] mt-1">Alcohol Transportation Permit • Compliance • Application Assistance</p>
          <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full px-3 py-1 mt-3">
            <span className="text-[10px] text-[#D4AF37] font-semibold">📅 Agreement Date: {TODAY}</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6 shadow-2xl">
          <ProgressBar step={step} />

          {/* Step content */}
          <div className="mb-6">
            {step === 0 && <StepCompanyInfo data={data} setData={setData} />}
            {step === 1 && <StepServicePayment data={data} setData={setData} />}
            {step === 2 && <StepTerms data={data} setData={setData} />}
            {step === 3 && <StepSignatures data={data} setData={setData} />}
            {step === 4 && <StepCertificate data={data} />}
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
                className="flex items-center gap-2 px-5 py-2 rounded-md text-sm font-bold bg-[#D4AF37] text-black hover:bg-[#C9A227] transition-all"
              >
                <Send className="w-4 h-4" />
                Submit Agreement
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
