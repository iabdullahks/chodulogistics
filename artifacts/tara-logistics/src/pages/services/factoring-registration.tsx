import { Layout } from "@/components/layout"
import { CheckCircle2, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"

import heroImage from "@/assets/photos/hero-highway-sunset.jpg"

export default function FactoringRegistration() {
  return (
    <Layout>
      <div className="relative border-b border-border py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Truck on highway" className="w-full h-full object-cover grayscale-[30%]" />
          <div className="absolute inset-0 bg-background/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-background/50 border border-border mb-6 backdrop-blur-sm">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="text-xs font-display uppercase tracking-widest text-primary font-semibold">Service Detail</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-6 text-foreground max-w-4xl">
            Factoring <br /><span className="text-primary italic">Registration.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
            Stop waiting 30, 60, or 90 days for payment. We help you set up reliable freight factoring to secure steady cash flow.
          </p>
        </div>
      </div>

      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">Cash Flow is King</h2>
                <div className="w-12 h-0.5 bg-primary mb-8" />
                <div className="prose prose-invert max-w-none text-muted-foreground text-lg leading-relaxed space-y-6 font-light">
                  <p>
                    Fuel, maintenance, and insurance bills don't wait for brokers to pay their invoices. Factoring allows you to get paid within 24 hours of delivering a load, giving you the liquid capital necessary to keep moving.
                  </p>
                  <p>
                    CHODU Logistics partners with reputable, transparent factoring companies. We assist you through the entire registration process, helping you avoid hidden fees, understand recourse vs. non-recourse options, and get your account funded rapidly.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-serif mb-6 text-foreground">Factoring Support Features</h2>
                <ul className="grid sm:grid-cols-2 gap-6">
                  {[
                    "Partner matching based on fleet size",
                    "Application and documentation submission",
                    "NOA (Notice of Assignment) handling guidance",
                    "Contract review assistance (spotting hidden fees)",
                    "Fuel card integration setup",
                    "Credit check tutorial for safe load booking"
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 p-8 bg-secondary/30 border border-border rounded-sm">
                      <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                      <span className="font-light text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border border-border p-10 rounded-sm sticky top-32 shadow-2xl">
                <h3 className="text-3xl font-serif mb-4 text-foreground">Need Faster Payouts?</h3>
                <p className="text-muted-foreground mb-8 font-light">
                  Let us help you set up a factoring account that works for your specific business needs.
                </p>
                <Link href="/contact" className="block w-full">
                  <Button size="lg" className="w-full h-14 font-display uppercase tracking-widest text-xs font-semibold">Start Registration</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
