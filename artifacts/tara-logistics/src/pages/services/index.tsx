import { Layout } from "@/components/layout"
import { ShieldCheck, Truck, BarChart3, FileText, CreditCard, ArrowRight } from "lucide-react"
import { Link } from "wouter"
import { motion } from "framer-motion"

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

      <ServicesGrid />
    </Layout>
  )
}

function ServicesGrid() {
  return (
    <section
      className="relative overflow-hidden py-[100px] md:py-[140px]"
      style={{
        background: "linear-gradient(180deg, #0B1220 0%, #111827 100%)",
      }}
    >
      {/* subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* radial gold glow behind heading */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(closest-side, #D4AF37, transparent)" }}
      />

      {/* abstract geometric lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
        aria-hidden="true"
      >
        <line x1="10%" y1="0%" x2="35%" y2="100%" stroke="#D4AF37" strokeWidth="1" />
        <line x1="90%" y1="0%" x2="65%" y2="100%" stroke="#D4AF37" strokeWidth="1" />
        <circle cx="88%" cy="12%" r="120" stroke="#D4AF37" strokeWidth="1" fill="none" />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto mb-16 max-w-2xl text-center md:mb-20"
        >
          <span
            className="text-xs font-display font-semibold tracking-[0.25em] uppercase"
            style={{ color: "#D4AF37" }}
          >
            Our Services
          </span>
          <h2
            className="mt-4 text-[34px] font-bold leading-[1.15] md:text-[42px]"
            style={{ color: "#F8FAFC" }}
          >
            Helping Trucking Businesses Grow
          </h2>
          <p
            className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.7] md:text-[18px]"
            style={{ color: "#CBD5E1" }}
          >
            We provide end-to-end logistics solutions designed to help carriers
            and owner-operators streamline operations, increase revenue, and
            grow with confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[number]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
      className="h-full"
    >
      <Link href={service.href} className="group relative flex h-full">
        <div
          className="relative flex h-full w-full flex-col rounded-[24px] border p-8 backdrop-blur-sm transition-all duration-[400ms] ease-out group-hover:-translate-y-2 md:p-10"
          style={{
            background: "rgba(23, 32, 51, 0.7)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          {/* gold accent line across top, revealed on hover */}
          <span
            className="absolute inset-x-8 top-0 h-px scale-x-0 rounded-full opacity-0 transition-all duration-300 ease-out group-hover:scale-x-100 group-hover:opacity-100"
            style={{
              background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
            }}
          />

          {/* hover shadow / glow */}
          <span
            className="pointer-events-none absolute inset-0 rounded-[24px] opacity-0 transition-opacity duration-[400ms] ease-out group-hover:opacity-100"
            style={{
              boxShadow: "0 24px 60px -20px rgba(212, 175, 55, 0.35), 0 0 0 1px rgba(212, 175, 55, 0.35)",
            }}
          />

          <div className="relative z-10 flex h-full flex-col">
            <div
              className="mb-8 flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-3"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.35), rgba(244,197,66,0.12))",
                boxShadow: "0 0 24px rgba(212, 175, 55, 0.25)",
              }}
            >
              <service.icon className="h-6 w-6" style={{ color: "#D4AF37" }} strokeWidth={1.75} />
            </div>

            <h3
              className="mb-4 text-[24px] font-bold leading-snug md:text-[26px]"
              style={{ color: "#F8FAFC" }}
            >
              {service.title}
            </h3>
            <p
              className="mb-8 flex-1 text-[17px] leading-[1.7] md:text-[18px]"
              style={{ color: "#CBD5E1" }}
            >
              {service.desc}
            </p>

            <div
              className="mt-auto flex items-center gap-2 text-sm font-semibold tracking-wide transition-colors duration-300"
              style={{ color: "#D4AF37" }}
            >
              <span className="relative">
                Learn More
                <span
                  className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 ease-out group-hover:w-full"
                  style={{ background: "#F4C542" }}
                />
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
