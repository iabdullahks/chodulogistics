import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowRight, ShieldCheck, Truck, BarChart3, Clock, MapPin } from "lucide-react"
import { Link } from "wouter"

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
      <section className="relative min-h-[90vh] flex items-center bg-background border-b overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Truck on highway at sunset" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/85 bg-gradient-to-r from-background/95 to-background/50 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 md:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-secondary border border-border">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-display uppercase tracking-widest text-muted-foreground font-semibold">Established Prestige</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-[1.1]">
              Heavy Duty <br />
              <span className="text-primary italic">Logistics</span> <br />
              Support.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              We connect owner-operators with dependable freight and provide full-spectrum compliance, factoring, and permit support to keep your wheels turning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/services" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2">
                  View Services <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full">
                  Partner With Us
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-border mt-12">
              <div>
                <div className="text-4xl font-serif text-foreground">24/7</div>
                <div className="text-xs text-muted-foreground font-display uppercase tracking-widest mt-2">Dispatch</div>
              </div>
              <div>
                <div className="text-4xl font-serif text-foreground">48<span className="text-primary text-2xl italic">h</span></div>
                <div className="text-xs text-muted-foreground font-display uppercase tracking-widest mt-2">Pay Processing</div>
              </div>
              <div>
                <div className="text-4xl font-serif text-foreground">50+</div>
                <div className="text-xs text-muted-foreground font-display uppercase tracking-widest mt-2">State Coverage</div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[480px] shrink-0">
            <div className="bg-card/80 backdrop-blur-md border border-border p-8 rounded-sm shadow-2xl relative">
              <div className="absolute -top-1 -right-1 w-24 h-24 bg-primary/10 blur-2xl rounded-full pointer-events-none" />
              <h3 className="text-3xl font-serif mb-2 text-foreground">Request a Quote</h3>
              <p className="text-sm text-muted-foreground mb-6 font-light">Need freight moved or carrier support? Tell us what you need.</p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-display uppercase tracking-wider text-xs text-muted-foreground">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="bg-background/50 border-border" />
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
                          <FormLabel className="font-display uppercase tracking-wider text-xs text-muted-foreground">Company</FormLabel>
                          <FormControl>
                            <Input placeholder="JD Trucking" {...field} className="bg-background/50 border-border" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-display uppercase tracking-wider text-xs text-muted-foreground">Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} className="bg-background/50 border-border" />
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
                          <FormLabel className="font-display uppercase tracking-wider text-xs text-muted-foreground">Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 000-0000" {...field} className="bg-background/50 border-border" />
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
                        <FormLabel className="font-display uppercase tracking-wider text-xs text-muted-foreground">Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Equipment type, lanes, or services needed..." 
                            className="min-h-[100px] resize-none bg-background/50 border-border"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full font-display uppercase tracking-widest font-semibold text-xs mt-2" disabled={createLead.isPending}>
                    {createLead.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Complete Carrier Solutions.</h2>
              <p className="text-muted-foreground text-lg font-light">We don't just broker freight. We provide the infrastructure and support owner-operators need to scale their business securely.</p>
            </div>
            <Link href="/services" className="hidden md:block">
              <Button variant="outline" className="gap-2 font-display uppercase tracking-widest text-xs">
                All Services <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: "Rented Trailer Program",
                desc: "Flexible trailer solutions to help carriers scale without massive upfront capital.",
                href: "/services/rented-trailer-program"
              },
              {
                icon: ShieldCheck,
                title: "Compliance & Permits",
                desc: "Expert guidance for TWIC cards, liquor permits, and DOT compliance.",
                href: "/services/twic-card-assistance"
              },
              {
                icon: BarChart3,
                title: "Factoring Support",
                desc: "Improve cash flow with reliable factoring registration and processing assistance.",
                href: "/services/factoring-registration"
              }
            ].map((feature, i) => (
              <Link key={i} href={feature.href} className="group block h-full">
                <div className="bg-secondary/30 border border-border p-8 h-full transition-all duration-300 hover:border-primary/50 hover:bg-secondary/50 rounded-sm">
                  <div className="w-12 h-12 bg-background border border-border rounded-sm flex items-center justify-center mb-8 group-hover:border-primary/50 transition-colors">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-2xl font-serif mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-8 font-light">
                    {feature.desc}
                  </p>
                  <div className="flex items-center text-xs font-display text-primary uppercase tracking-widest font-semibold">
                    Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 md:hidden">
            <Link href="/services" className="block w-full">
              <Button variant="outline" className="w-full gap-2 font-display uppercase tracking-widest text-xs">
                All Services <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Track Shipment CTA */}
      <section className="py-24 border-y border-border relative overflow-hidden bg-secondary">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-3xl">
          <div className="w-16 h-16 bg-background border border-border rounded-sm flex items-center justify-center mx-auto mb-8">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-foreground">Real-Time Freight Visibility.</h2>
          <p className="text-xl text-muted-foreground mb-10 font-light">
            Keep track of your loads with our precise tracking tool. Enter your tracking number to see current status, origin, and estimated delivery.
          </p>
          <Link href="/track" className="inline-block w-full sm:w-auto">
            <Button size="lg" className="w-full min-w-[200px] text-base h-14 font-display uppercase tracking-widest">
              Track a Shipment
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  )
}
