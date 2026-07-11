import { Layout } from "@/components/layout"
import { Shield, Target, Users, Truck } from "lucide-react"

import fleetImage from "@/assets/photos/fleet-warehouse.jpg"
import driverImage from "@/assets/photos/driver-cab.jpg"

export default function About() {
  return (
    <Layout>
      {/* Header */}
      <div className="relative border-b border-border py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={fleetImage} alt="Fleet Warehouse" className="w-full h-full object-cover grayscale-[30%]" />
          <div className="absolute inset-0 bg-background/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 text-foreground">
            Built for the <br /><span className="text-primary italic">Long Haul.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed font-light">
            Tara Logistics is a nationwide freight brokerage and carrier support partner committed to keeping the supply chain moving with precision, integrity, and operational excellence.
          </p>
        </div>
      </div>

      {/* Story & Mission */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-serif mb-6 text-foreground">Our Story</h2>
                <div className="w-12 h-0.5 bg-primary mb-6" />
                <p className="text-muted-foreground leading-relaxed text-lg font-light">
                  Founded with a clear understanding of the challenges owner-operators face on the road, Tara Logistics was built to be more than just a load board connection. We saw a gap between finding freight and running a compliant, profitable trucking business.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg mt-4 font-light">
                  Today, we bridge that gap. We act as a comprehensive operational partner for carriers, providing access to dependable freight while handling the back-office complexities—from insurance applications to factoring and permit compliance.
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-serif mb-6 text-foreground">Our Mission</h2>
                <div className="w-12 h-0.5 bg-primary mb-6" />
                <p className="text-muted-foreground leading-relaxed text-lg font-light">
                  To empower truck carriers and owner-operators with the resources, freight, and administrative support they need to operate safely and profitably across the nation.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden border border-border relative z-10">
                <img src={driverImage} alt="Driver in cab" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-color" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-64 p-8 bg-card border border-border shadow-2xl z-20 hidden md:block">
                <div className="text-5xl font-serif text-primary mb-2">25+</div>
                <div className="text-xs font-display uppercase tracking-widest text-muted-foreground">Years of combined logistics experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-24 bg-secondary/30 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-foreground">Core Principles.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">The values that drive every load we broker and every carrier we partner with.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Uncompromising Integrity",
                desc: "We do what we say we'll do. Transparent pricing, honest lane descriptions, and straightforward communication."
              },
              {
                icon: Target,
                title: "Operational Precision",
                desc: "Logistics requires exactness. From dispatch to delivery to payment, we eliminate errors through rigorous process control."
              },
              {
                icon: Users,
                title: "Carrier First",
                desc: "We respect the driver. We understand that our success relies entirely on the success and profitability of the carriers we work with."
              }
            ].map((value, i) => (
              <div key={i} className="bg-background border border-border p-10 text-center rounded-sm">
                <div className="w-16 h-16 mx-auto bg-secondary border border-border rounded-sm flex items-center justify-center mb-8">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-serif mb-4 text-foreground">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-light">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
