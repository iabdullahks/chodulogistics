import { Layout } from "@/components/layout"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"

import fleetImage from "@/assets/photos/fleet-warehouse.jpg"

export default function RentedTrailerProgram() {
  return (
    <Layout>
      <div className="relative border-b border-border py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={fleetImage} alt="Fleet of trucks" className="w-full h-full object-cover grayscale-[30%]" />
          <div className="absolute inset-0 bg-background/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-background/50 border border-border mb-6 backdrop-blur-sm">
            <span className="text-xs font-display uppercase tracking-widest text-primary font-semibold">Service Detail</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-6 text-foreground max-w-4xl">
            Rented Trailer <br /><span className="text-primary italic">Program.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
            Scale your operations and take on more diverse freight without the massive capital requirement of purchasing trailers outright.
          </p>
        </div>
      </div>

      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">Maximize Your Capacity</h2>
                <div className="w-12 h-0.5 bg-primary mb-8" />
                <div className="prose prose-invert max-w-none text-muted-foreground text-lg leading-relaxed space-y-6 font-light">
                  <p>
                    For owner-operators and small fleets, trailer ownership is a significant barrier to entry for higher-paying, specialized freight. Brokerage Company of American INC's Rented Trailer Program is designed to remove that barrier, offering flexible access to well-maintained equipment.
                  </p>
                  <p>
                    Whether you need a dry van for retail goods, a flatbed for construction materials, or a reefer for temperature-sensitive loads, our network provides the equipment you need, exactly when you need it.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-serif mb-6 text-foreground">Program Benefits</h2>
                <ul className="grid sm:grid-cols-2 gap-6">
                  {[
                    "Zero massive down payments or long-term loans",
                    "Access to newer, DOT-compliant equipment",
                    "Maintenance and wear-and-tear support included",
                    "Ability to switch trailer types based on market demands",
                    "Seamless deduction of rental fees from settlements",
                    "Higher-paying power-only and drop-and-hook opportunities"
                  ].map((benefit, i) => (
                    <li key={i} className="flex gap-4 p-8 bg-secondary/30 border border-border rounded-sm">
                      <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                      <span className="font-light text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-3xl font-serif mb-6 text-foreground">How It Works</h2>
                <div className="space-y-8">
                  {[
                    { step: "1", title: "Application & Approval", desc: "Submit your carrier profile. We review your safety rating and insurance coverage." },
                    { step: "2", title: "Equipment Matching", desc: "We align your lane preferences with available trailers in our partner network." },
                    { step: "3", title: "Pickup & Inspection", desc: "Pick up the trailer, complete the joint inspection, and hit the road." },
                    { step: "4", title: "Simple Billing", desc: "Rental fees are conveniently processed directly through your freight settlements." }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div className="w-12 h-12 rounded-sm bg-background border border-border flex items-center justify-center font-serif text-primary text-2xl shrink-0">
                        {step.step}
                      </div>
                      <div className="pt-1">
                        <h4 className="text-xl font-serif mb-2 text-foreground">{step.title}</h4>
                        <p className="text-muted-foreground font-light">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border border-border p-10 rounded-sm sticky top-32 shadow-2xl">
                <h3 className="text-3xl font-serif mb-4 text-foreground">Ready to pull more freight?</h3>
                <p className="text-muted-foreground mb-8 font-light">
                  Contact our capacity team today to learn about current trailer availability and program requirements.
                </p>
                <Link href="/contact" className="block w-full">
                  <Button size="lg" className="w-full h-14 font-display uppercase tracking-widest text-xs font-semibold">Apply for Trailer</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
