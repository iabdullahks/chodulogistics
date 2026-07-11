import { Layout } from "@/components/layout"
import { CheckCircle2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"

import driverImage from "@/assets/photos/driver-cab.jpg"

export default function InsuranceAssistance() {
  return (
    <Layout>
      <div className="relative border-b border-border py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={driverImage} alt="Driver cab" className="w-full h-full object-cover grayscale-[30%]" />
          <div className="absolute inset-0 bg-background/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-background/50 border border-border mb-6 backdrop-blur-sm">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-xs font-display uppercase tracking-widest text-primary font-semibold">Service Detail</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-6 text-foreground max-w-4xl">
            Insurance <br /><span className="text-primary italic">Assistance.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
            Navigate commercial trucking insurance with confidence. We help you find and apply for coverage that protects your business without crushing your margins.
          </p>
        </div>
      </div>

      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">Protect Your Assets</h2>
                <div className="w-12 h-0.5 bg-primary mb-8" />
                <div className="prose prose-invert max-w-none text-muted-foreground text-lg leading-relaxed space-y-6 font-light">
                  <p>
                    Commercial trucking insurance is one of the highest fixed costs for an owner-operator. Finding the right balance between necessary coverage limits (Auto Liability, Cargo, Physical Damage) and affordable premiums is critical for survival.
                  </p>
                  <p>
                    We leverage our industry relationships and expertise to help carriers prepare robust insurance profiles, compare quotes, and complete complex applications correctly the first time.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-serif mb-6 text-foreground">How We Help</h2>
                <ul className="grid sm:grid-cols-2 gap-6">
                  {[
                    "Coverage requirement analysis based on freight type",
                    "Application preparation and review",
                    "Certificate of Insurance (COI) management",
                    "Guidance on lowering premiums via safety protocols",
                    "New venture insurance consulting",
                    "Specialized coverage applications (Hazmat, High Value)"
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
                <h3 className="text-3xl font-serif mb-4 text-foreground">Need Coverage Guidance?</h3>
                <p className="text-muted-foreground mb-8 font-light">
                  Whether you're a new authority or looking to renew, our team can help streamline the process.
                </p>
                <Link href="/contact" className="block w-full">
                  <Button size="lg" className="w-full h-14 font-display uppercase tracking-widest text-xs font-semibold">Contact Support</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
