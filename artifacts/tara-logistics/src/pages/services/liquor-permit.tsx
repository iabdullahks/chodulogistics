import { Layout } from "@/components/layout"
import { CheckCircle2, GlassWater } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"

import loadingDock2 from "@/assets/photos/loading-dock-2.jpg"

export default function LiquorPermit() {
  return (
    <Layout>
      <div className="relative border-b border-border py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={loadingDock2} alt="Loading dock" className="w-full h-full object-cover grayscale-[30%]" />
          <div className="absolute inset-0 bg-background/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-background/50 border border-border mb-6 backdrop-blur-sm">
            <span className="text-xs font-display uppercase tracking-widest text-primary font-semibold">Specialized Freight</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-6 text-foreground max-w-4xl">
            Liquor Permits & <br /><span className="text-primary italic">Loads.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
            Gain access to specialized, high-margin beverage freight. We handle the complex state-by-state permit paperwork so you can focus on the drive.
          </p>
        </div>
      </div>

      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">High-Value Beverage Freight</h2>
                <div className="w-12 h-0.5 bg-primary mb-8" />
                <div className="prose prose-invert max-w-none text-muted-foreground text-lg leading-relaxed space-y-6 font-light">
                  <p>
                    Hauling alcoholic beverages requires specific state-issued permits. Because of the regulatory hurdles, these loads frequently pay above average market rates.
                  </p>
                  <p>
                    Brokerage Company of American INC holds direct relationships with major beverage distributors and shippers. We connect permitted carriers with steady volume lanes, and we help non-permitted carriers obtain the necessary licenses to enter this lucrative market.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-serif mb-6 text-foreground">Permit Application Support</h2>
                <ul className="grid sm:grid-cols-2 gap-6">
                  {[
                    "State-specific requirement analysis",
                    "Permit application filing and tracking",
                    "Bond requirement assistance",
                    "Annual renewal management",
                    "Route compliance verification",
                    "Direct access to liquor freight boards"
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
                <h3 className="text-3xl font-serif mb-4 text-foreground">Haul Liquor Loads</h3>
                <p className="text-muted-foreground mb-8 font-light">
                  Ready to upgrade your freight profile? Contact us to start your permit application or find available liquor loads.
                </p>
                <Link href="/contact" className="block w-full">
                  <Button size="lg" className="w-full h-14 font-display uppercase tracking-widest text-xs font-semibold">Get Permitted</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
