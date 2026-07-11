import { Layout } from "@/components/layout"
import { CheckCircle2, Clock, DollarSign, FileText } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import loadingDock2 from "@/assets/photos/loading-dock-2.jpg"

export default function PaymentProcess() {
  return (
    <Layout>
      <div className="relative border-b border-border py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={loadingDock2} alt="Loading Dock" className="w-full h-full object-cover grayscale-[30%]" />
          <div className="absolute inset-0 bg-background/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-4xl">
          <div className="w-16 h-16 bg-background border border-border rounded-sm flex items-center justify-center mx-auto mb-8">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 text-foreground">
            Fast, Reliable <br/><span className="text-primary italic">Payments.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-light">
            We understand that cash flow keeps your trucks moving. Our payment process is designed to be transparent, predictable, and fast.
          </p>
        </div>
      </div>

      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-card border border-border p-10 text-center rounded-sm">
              <Clock className="w-8 h-8 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-serif mb-4 text-foreground">Standard Pay</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">Net 30 days from receipt of original clean POD and invoice.</p>
            </div>
            <div className="bg-secondary/30 border border-primary/40 p-10 text-center rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase px-3 py-1 font-display tracking-widest">Popular</div>
              <DollarSign className="w-8 h-8 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-serif mb-4 text-foreground">Quick Pay</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">2-day processing with a standard 3% deduction.</p>
            </div>
            <div className="bg-card border border-border p-10 text-center rounded-sm">
              <FileText className="w-8 h-8 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-serif mb-4 text-foreground">Factoring</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">We work directly with your Notice of Assignment (NOA).</p>
            </div>
          </div>

          <div className="space-y-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center text-foreground">Required Documentation</h2>
              <div className="bg-secondary/40 border border-border rounded-sm p-10">
                <p className="text-muted-foreground mb-8 text-lg font-light text-center">To ensure zero delays in your payment, your settlement packet must include clear, legible copies of:</p>
                <ul className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {[
                    "Signed Rate Confirmation",
                    "Clear, signed Bill of Lading (BOL/POD) with NO shortages/damages",
                    "Carrier Invoice matching rate con amount",
                    "Lumper receipts (if applicable & pre-approved)",
                    "Scale tickets (if requested on rate con)"
                  ].map((req, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground font-light">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-16 border-t border-border">
              <h2 className="text-3xl md:text-4xl font-serif mb-10 text-center text-foreground">Payment FAQ</h2>
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="font-serif text-xl hover:text-primary hover:no-underline">Where do I send my invoices and paperwork?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                      All clean paperwork and invoices should be emailed to <strong className="text-foreground font-normal">accounting@taralogistics.com</strong>. Please include the load number in the subject line of your email.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="font-serif text-xl hover:text-primary hover:no-underline">How does Quick Pay work?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                      If you elect for Quick Pay, we process your payment within 48 hours of receiving clean, legible paperwork. A 3% fee is deducted from the gross line haul rate. Payments are sent via ACH direct deposit.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="font-serif text-xl hover:text-primary hover:no-underline">Do you issue fuel advances?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                      Yes, we offer fuel advances up to 40% of the line haul rate once the carrier is loaded and the BOL is signed. Fuel advances incur an industry-standard transaction fee.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="font-serif text-xl hover:text-primary hover:no-underline">What happens if there are OS&D issues?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground font-light leading-relaxed text-base">
                      If there are Overages, Shortages, or Damages (OS&D) noted on the POD, payment processing will be paused until the claim is resolved with the shipper. Carriers must immediately notify dispatch from the receiver facility if OS&D occurs.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}
