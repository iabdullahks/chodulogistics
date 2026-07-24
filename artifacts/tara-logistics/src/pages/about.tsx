import { Layout } from "@/components/layout"
import { Shield, Target, Users, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

import fleetImage from "@/assets/photos/fleet-warehouse.jpg"
import driverImage from "@/assets/photos/driver-cab.jpg"

export default function About() {
  return (
    <Layout>
      {/* Header */}
      <div className="relative border-b border-border py-24 md:py-32 overflow-hidden pt-32 lg:pt-40">
        <div className="absolute inset-0 z-0">
          <img src={fleetImage} alt="Fleet Warehouse" className="w-full h-full object-cover opacity-30 grayscale-[30%] mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 md:px-10 max-w-[1400px]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="text-[#D4AF37] font-semibold tracking-widest uppercase text-sm mb-6 block">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground tracking-tight leading-[1.05]">
              Built for the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4C542]">Long Haul.</span>
            </h1>
            <p className="text-xl text-[#CBD5E1] leading-relaxed max-w-2xl">
              Brokerage Company of American INC is a nationwide freight brokerage and carrier support partner committed to keeping the supply chain moving with precision, integrity, and operational excellence.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Story & Mission */}
      <div className="py-24 md:py-32 bg-background relative">
        <div className="container mx-auto px-6 md:px-10 max-w-[1400px]">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="space-y-16"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">Bridging the gap between freight and operations.</h2>
                <div className="w-16 h-1 bg-[#D4AF37] mb-8 rounded-full" />
                <p className="text-[#CBD5E1] leading-relaxed text-lg mb-6">
                  Founded with a clear understanding of the challenges owner-operators face on the road, Brokerage Company of American INC was built to be more than just a load board connection. We saw a gap between finding freight and running a compliant, profitable trucking business.
                </p>
                <p className="text-[#CBD5E1] leading-relaxed text-lg">
                  Today, we bridge that gap. We act as a comprehensive operational partner for carriers, providing access to dependable freight while handling the back-office complexities—from insurance applications to factoring and permit compliance.
                </p>
              </div>

              <div className="bg-card border border-border p-8 md:p-10 rounded-[24px]">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Our Mission</h2>
                <p className="text-[#CBD5E1] leading-relaxed text-lg">
                  To empower truck carriers and owner-operators with the resources, freight, and administrative support they need to operate safely and profitably across the nation.
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden border border-border relative z-10 shadow-2xl">
                <img src={driverImage} alt="Driver in cab" className="w-full h-full object-cover grayscale-[10%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[32px]" />
              </div>
              
              <div className="absolute -bottom-10 -left-10 w-72 p-10 bg-card border border-border shadow-[0_24px_80px_-12px_rgba(0,0,0,0.5)] z-20 hidden md:block rounded-[24px] backdrop-blur-xl">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#D4AF37]/20 blur-[40px] rounded-full pointer-events-none" />
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4C542] mb-3 leading-none">25<span className="text-4xl">+</span></div>
                <div className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8] leading-relaxed">Years of combined logistics experience</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-24 md:py-32 bg-secondary relative overflow-hidden">
        {/* abstract geometric lines */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]" aria-hidden="true">
          <line x1="10%" y1="0%" x2="35%" y2="100%" stroke="#D4AF37" strokeWidth="1" />
          <line x1="90%" y1="0%" x2="65%" y2="100%" stroke="#D4AF37" strokeWidth="1" />
        </svg>

        <div className="container mx-auto px-6 md:px-10 max-w-[1400px] relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 md:mb-24"
          >
            <span className="text-[#D4AF37] font-semibold tracking-widest uppercase text-sm mb-4 block">Our DNA</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground tracking-tight">Core Principles.</h2>
            <p className="text-lg md:text-xl text-[#CBD5E1] max-w-2xl mx-auto leading-relaxed">The values that drive every load we broker and every carrier we partner with.</p>
          </motion.div>

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
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card border border-border p-10 md:p-12 text-center rounded-[24px] hover:border-[#D4AF37]/30 transition-colors duration-500 relative overflow-hidden group"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-20 h-20 mx-auto bg-background border border-border rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-lg group-hover:border-[#D4AF37]/50 transition-colors">
                  <value.icon className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground relative z-10">{value.title}</h3>
                <p className="text-[#CBD5E1] leading-relaxed text-[17px] relative z-10">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}