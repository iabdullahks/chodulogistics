import { Layout } from "@/components/layout"
import { ShieldCheck, Truck, BarChart3, FileText, CreditCard, ChevronRight } from "lucide-react"
import { Link } from "wouter"

import dockImage from "@/assets/photos/loading-dock.jpg"

const services = [
  {
    id: "freight-brokerage",
    title: "Freight Brokerage",
    icon: Truck,
    href: "/contact",
    desc: "Reliable freight matching connecting carriers with nationwide shippers. Consistent lanes and competitive rates.",
  },
  {
    id: "rented-trailer-program",
    title: "Rented Trailer Program",
    icon: Truck,
    href: "/services/rented-trailer-program",
    desc: "Scale your capacity without massive capital outlay. Flexible trailer rental solutions for owner-operators.",
  },
  {
    id: "twic-card-assistance",
    title: "TWIC Card Assistance",
    icon: ShieldCheck,
    href: "/services/twic-card-assistance",
    desc: "Navigate port security requirements smoothly with our guided TWIC application and renewal assistance.",
  },
  {
    id: "insurance-assistance",
    title: "Insurance Application",
    icon: FileText,
    href: "/services/insurance-assistance",
    desc: "Expert guidance in finding and applying for the right commercial trucking insurance coverage.",
  },
  {
    id: "factoring-registration",
    title: "Factoring Registration",
    icon: CreditCard,
    href: "/services/factoring-registration",
    desc: "Keep cash flowing. We assist in registering with reputable factoring companies for fast invoice payouts.",
  },
  {
    id: "liquor-permit",
    title: "Liquor Permit Support",
    icon: BarChart3,
    href: "/services/liquor-permit",
    desc: "Specialized load opportunities requiring liquor permits, complete with application and compliance support.",
  }
]

export default function Services() {
  return (
    <Layout>
      <div className="relative border-b border-border py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={dockImage} alt="Loading dock" className="w-full h-full object-cover grayscale-[20%]" />
          <div className="absolute inset-0 bg-background/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-serif mb-6 text-foreground">
              Our <span className="text-primary italic">Services.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              We provide an end-to-end operational platform for truck carriers. From sourcing high-paying freight to managing back-office compliance.
            </p>
          </div>
        </div>
      </div>

      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link key={service.id} href={service.href} className="group block h-full">
                <div className="bg-card border border-border p-8 h-full transition-all duration-300 hover:border-primary/40 hover:bg-secondary/20 relative flex flex-col rounded-sm">
                  
                  <div className="w-14 h-14 bg-background border border-border rounded-sm flex items-center justify-center mb-8 group-hover:border-primary/30 transition-colors">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-serif mb-4 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-8 flex-1 font-light">
                    {service.desc}
                  </p>
                  
                  <div className="flex items-center text-xs font-display font-semibold text-primary uppercase tracking-widest mt-auto">
                    View Details <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
