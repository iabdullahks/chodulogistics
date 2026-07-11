import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowRight, ShieldCheck, Truck, BarChart3, Clock, MapPin } from "lucide-react"
import { Link } from "wouter"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useCreateLead } from "@workspace/api-client-react"
import { Layout } from "@/components/layout"

import heroImage from "@/assets/photos/hero-highway-sunset.jpg"

const quoteFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name is required." }),
  companyName: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Valid phone number required." }),
  message: z.string().min(10, { message: "Please provide some details." }),
})

export default function Home() {
  const { toast } = useToast()
  const createLead = useCreateLead()

  const form = useForm<z.infer<typeof quoteFormSchema>>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof quoteFormSchema>) {
    createLead.mutate(
      {
        data: {
          ...values,
          subject: "Home Page Quote Request",
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Request submitted",
            description: "Our dispatch team will contact you shortly.",
          })
          form.reset()
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Submission failed",
            description: "Please try again or call us directly.",
          })
        },
      }
    )
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center bg-background overflow-hidden pt-20 pb-24 md:py-32">
        {/* Background treatments */}
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Truck on highway at sunset" className="w-full h-full object-cover opacity-30 grayscale-[30%] mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Subtle grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          
          {/* Gold radial glow */}
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 max-w-[1400px]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1 space-y-8 max-w-2xl mt-12 lg:mt-0"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/80 border border-border backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
              </span>
              <span className="text-[13px] font-semibold tracking-wide text-foreground uppercase">Enterprise Grade Logistics</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-bold text-foreground leading-[1.05] tracking-tight">
              Scale Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4C542]">Capacity</span> With <br />
              Confidence.
            </h1>
            
            <p className="text-lg md:text-xl text-[#CBD5E1] leading-[1.7] max-w-[540px]">
              We connect owner-operators with dependable freight and provide full-spectrum compliance, factoring, and permit support. Built for the modern carrier.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto min-w-[180px] gap-2">
                  Partner With Us <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/services" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto min-w-[180px]">
                  Explore Services
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-10 mt-10 border-t border-border/50">
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">24/7</div>
                <div className="text-sm text-[#94A3B8] font-medium">Dispatch</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1 flex items-baseline">48<span className="text-[#D4AF37] text-xl ml-0.5 font-semibold">h</span></div>
                <div className="text-sm text-[#94A3B8] font-medium">Pay Processing</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-1 flex items-baseline">50<span className="text-[#D4AF37] text-xl ml-0.5 font-semibold">+</span></div>
                <div className="text-sm text-[#94A3B8] font-medium">State Coverage</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-[500px] shrink-0"
          >
            <div className="bg-card/80 backdrop-blur-xl border border-border p-8 md:p-10 rounded-[24px] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37]/20 blur-[60px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
              
              <h3 className="text-2xl font-bold mb-2 text-foreground">Request a Quote</h3>
              <p className="text-[15px] text-[#94A3B8] mb-8">Need freight moved or carrier support? Connect with our dispatch team.</p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                  <div className="grid grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="bg-background/50 border-border h-12 rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">Company</FormLabel>
                          <FormControl>
                            <Input placeholder="JD Trucking" {...field} className="bg-background/50 border-border h-12 rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} className="bg-background/50 border-border h-12 rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 000-0000" {...field} className="bg-background/50 border-border h-12 rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Equipment type, lanes, or services needed..." 
                            className="min-h-[120px] resize-none bg-background/50 border-border rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all p-4"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full mt-2 h-14 text-base" disabled={createLead.isPending}>
                    {createLead.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="py-24 md:py-32 bg-secondary relative overflow-hidden">
        {/* abstract geometric lines */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]" aria-hidden="true">
          <circle cx="90%" cy="10%" r="300" stroke="#D4AF37" strokeWidth="1" fill="none" strokeDasharray="4 12" />
        </svg>

        <div className="container mx-auto px-6 md:px-10 max-w-[1400px] relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8"
          >
            <div className="max-w-2xl">
              <span className="text-[#D4AF37] font-semibold tracking-widest uppercase text-sm mb-4 block">End-to-End Platform</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">Complete Carrier Solutions.</h2>
              <p className="text-[#CBD5E1] text-lg md:text-xl leading-relaxed">We don't just broker freight. We provide the modern infrastructure and support owner-operators need to scale their business securely.</p>
            </div>
            <Link href="/services" className="hidden md:block shrink-0">
              <Button variant="outline" className="gap-2">
                View All Services <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: "Rented Trailer Program",
                desc: "Scale your capacity without massive capital outlay. Flexible trailer rental solutions for owner-operators.",
                href: "/services/rented-trailer-program"
              },
              {
                icon: ShieldCheck,
                title: "Compliance & Permits",
                desc: "Navigate port security and state regulations smoothly with our guided application and renewal assistance.",
                href: "/services/twic-card-assistance"
              },
              {
                icon: BarChart3,
                title: "Factoring Support",
                desc: "Keep cash flowing predictably. We assist in registering with reputable factoring companies for fast payouts.",
                href: "/services/factoring-registration"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full"
              >
                <Link href={feature.href} className="group block h-full">
                  <div className="bg-card border border-border p-10 h-full rounded-[24px] transition-all duration-500 hover:border-[#D4AF37]/30 hover:bg-card/80 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.15)] relative overflow-hidden flex flex-col">
                    
                    {/* Hover Top Border */}
                    <span className="absolute inset-x-8 top-0 h-px scale-x-0 rounded-full opacity-0 transition-all duration-500 ease-out group-hover:scale-x-100 group-hover:opacity-100 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

                    <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37]/20 to-[#F4C542]/5 border border-[#D4AF37]/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                      <feature.icon className="w-7 h-7 text-[#D4AF37]" strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
                    <p className="text-[#CBD5E1] leading-relaxed mb-8 flex-1 text-[17px]">
                      {feature.desc}
                    </p>
                    
                    <div className="mt-auto flex items-center text-[15px] font-semibold text-[#D4AF37] tracking-wide transition-colors">
                      <span className="relative">
                        Learn More
                        <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#F4C542] transition-all duration-300 ease-out group-hover:w-full" />
                      </span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 md:hidden flex justify-center">
            <Link href="/services" className="w-full">
              <Button variant="outline" className="w-full gap-2 h-14">
                View All Services <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Track Shipment CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 md:px-10 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-card border border-border rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl relative">
              <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl rounded-2xl" />
              <MapPin className="w-8 h-8 text-[#D4AF37] relative z-10" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground tracking-tight">Real-Time Freight Visibility.</h2>
            <p className="text-lg md:text-xl text-[#CBD5E1] mb-12 leading-relaxed">
              Keep track of your loads with precision. Enter your tracking number to see current status, origin, and estimated delivery times instantly.
            </p>
            <Link href="/track" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="w-full sm:min-w-[240px] gap-3">
                Track a Shipment <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  )
}
