import { Layout } from "@/components/layout"
import { CheckCircle2, Clock, DollarSign, FileText, ArrowRight } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"

import loadingDock2 from "@/assets/photos/loading-dock-2.jpg"

export default function PaymentProcess() {
  return (
    <Layout>
      <div className="relative border-b border-border py-24 md:py-32 overflow-hidden pt-32 lg:pt-40">
        <div className="absolute inset-0 z-0">
          <img src={loadingDock2} alt="Loading Dock" className="w-full h-full object-cover opacity-30 grayscale-[30%] mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="w-20 h-20 bg-background border border-border rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(212,175,55,0.1)] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent opacity-50 rounded-2xl" />
              <DollarSign className="w-8 h-8 text-[#D4AF37] relative z-10" strokeWidth={2.5} />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground tracking-tight leading-[1.05]">
              Fast, Reliable <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4C542]">Payments.</span>
            </h1>
            <p className="text-xl text-[#CBD5E1] leading-relaxed max-w-2xl mx-auto">
              We understand that cash flow keeps your trucks moving. Our payment process is designed to be transparent, predictable, and fast.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-24 md:py-32 bg-background relative overflow-hidden">
        {/* abstract geometric lines */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]" aria-hidden="true">
          <line x1="10%" y1="0%" x2="35%" y2="100%" stroke="#D4AF37" strokeWidth="1" />
          <line x1="90%" y1="0%" x2="65%" y2="100%" stroke="#D4AF37" strokeWidth="1" />
        </svg>

        <div className="container mx-auto px-6 md:px-10 max-w-[1200px] relative z-10">
          
          <div className="grid md:grid-cols-3 gap-8 mb-24 md:mb-32">
            {[
              {
                icon: Clock,
                title: "Standard Pay",
                desc: "Net 30 days from receipt of original clean POD and invoice.",
                highlight: false
              },
              {
                icon: DollarSign,
                title: "Quick Pay",
                desc: "2-day processing with a standard 3% deduction.",
                highlight: true,
                badge: "Popular"
              },
              {
                icon: FileText,
                title: "Factoring",
                desc: "We work directly with your Notice of Assignment (NOA).",
                highlight: false
              }
            ].map((method, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-10 text-center rounded-[32px] relative overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                  method.highlight 
                    ? "bg-secondary border-[2px] border-[#D4AF37]/50 shadow-[0_24px_60px_-12px_rgba(212,175,55,0.2)]" 
                    : "bg-card border border-border shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)] hover:border-[#D4AF37]/30"
                }`}
              >
                {method.highlight && (
                  <>
                    <div className="absolute top-0 right-0 bg-[#D4AF37] text-background text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-[16px]">
                      {method.badge}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />
                  </>
                )}
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-8 relative z-10 ${
                  method.highlight ? "bg-background border border-[#D4AF37]/30 shadow-lg" : "bg-background border border-border"
                }`}>
                  <method.icon className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground relative z-10">{method.title}</h3>
                <p className="text-[#CBD5E1] text-[17px] leading-relaxed relative z-10">{method.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="space-y-24 md:space-y-32">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">Required Documentation</h2>
                <p className="text-[#CBD5E1] text-lg max-w-2xl mx-auto">To ensure zero delays in your payment, your settlement packet must include clear, legible copies of the following items:</p>
              </div>
              
              <div className="bg-card border border-border rounded-[32px] p-10 md:p-14 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.3)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
                
                <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto relative z-10">
                  {[
                    "Signed Rate Confirmation",
                    "Clear, signed Bill of Lading (BOL/POD) with NO shortages/damages",
                    "Carrier Invoice matching rate con amount",
                    "Lumper receipts (if applicable & pre-approved)",
                    "Scale tickets (if requested on rate con)"
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-5">
                      <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#D4AF37]/20">
                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" strokeWidth={2} />
                      </div>
                      <span className="text-foreground text-[17px] leading-relaxed pt-1">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="pt-16 border-t border-border/50"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">Payment FAQ</h2>
                <p className="text-[#CBD5E1] text-lg max-w-2xl mx-auto">Common questions about our settlement and payment processes.</p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {[
                    {
                      q: "Where do I send my invoices and paperwork?",
                      a: "All clean paperwork and invoices should be emailed to accounting@choudulogistics.com. Please include the load number in the subject line of your email."
                    },
                    {
                      q: "How does Quick Pay work?",
                      a: "If you elect for Quick Pay, we process your payment within 48 hours of receiving clean, legible paperwork. A 3% fee is deducted from the gross line haul rate. Payments are sent via ACH direct deposit."
                    },
                    {
                      q: "Do you issue fuel advances?",
                      a: "Yes, we offer fuel advances up to 40% of the line haul rate once the carrier is loaded and the BOL is signed. Fuel advances incur an industry-standard transaction fee."
                    },
                    {
                      q: "What happens if there are OS&D issues?",
                      a: "If there are Overages, Shortages, or Damages (OS&D) noted on the POD, payment processing will be paused until the claim is resolved with the shipper. Carriers must immediately notify dispatch from the receiver facility if OS&D occurs."
                    }
                  ].map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-[24px] px-8 py-2 data-[state=open]:border-[#D4AF37]/30 transition-colors">
                      <AccordionTrigger className="text-xl font-bold text-foreground hover:text-[#D4AF37] hover:no-underline py-6 text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[#CBD5E1] text-[17px] leading-relaxed pb-8">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </Layout>
  )
}