import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useCreateLead } from "@workspace/api-client-react"
import { Layout } from "@/components/layout"

import sunsetImage from "@/assets/photos/hero-highway-sunset-2.jpg"

const contactFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Valid phone number required." }),
  companyName: z.string().optional(),
  serviceInterested: z.string().optional(),
  message: z.string().min(10, { message: "Please provide some details." }),
})

export default function Contact() {
  const { toast } = useToast()
  const createLead = useCreateLead()

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      serviceInterested: "General Inquiry",
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    createLead.mutate(
      {
        data: {
          ...values,
          subject: `Contact Form: ${values.serviceInterested}`,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Message Sent",
            description: "Our team will review your inquiry and get back to you shortly.",
          })
          form.reset()
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to send message. Please try again or call us.",
          })
        },
      }
    )
  }

  return (
    <Layout>
      <div className="relative border-b border-border py-24 md:py-32 overflow-hidden pt-32 lg:pt-40">
        <div className="absolute inset-0 z-0">
          <img src={sunsetImage} alt="Highway at sunset" className="w-full h-full object-cover opacity-30 grayscale-[30%] mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-10 max-w-[1400px]">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="text-[#D4AF37] font-semibold tracking-widest uppercase text-sm mb-6 block">Get in Touch</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground tracking-tight leading-[1.05]">
              Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4C542]">Dispatch.</span>
            </h1>
            <p className="text-xl text-[#CBD5E1] leading-relaxed max-w-2xl">
              Ready to move freight or need compliance assistance? Reach out to our team. We're available 24/7 to support our carriers and shippers.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6 md:px-10 max-w-[1400px]">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 space-y-16"
            >
              <div>
                <h3 className="text-3xl font-bold mb-10 text-foreground">Contact Information</h3>
                <div className="space-y-10">
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-secondary border border-border rounded-2xl flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/50 transition-colors shadow-lg">
                      <Phone className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="font-semibold uppercase tracking-wider text-xs text-[#94A3B8] mb-2">Phone</div>
                      <div className="text-2xl font-medium text-foreground">(800) 555-0199</div>
                      <div className="text-[15px] text-[#CBD5E1] mt-2">24/7 Dispatch Support</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-secondary border border-border rounded-2xl flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/50 transition-colors shadow-lg">
                      <Mail className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="font-semibold uppercase tracking-wider text-xs text-[#94A3B8] mb-2">Email</div>
                      <div className="text-2xl font-medium text-foreground">dispatch@choudulogistics.com</div>
                      <div className="text-[15px] text-[#CBD5E1] mt-2">Average response: &lt; 30 mins</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-secondary border border-border rounded-2xl flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/50 transition-colors shadow-lg">
                      <MapPin className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="font-semibold uppercase tracking-wider text-xs text-[#94A3B8] mb-2">Corporate HQ</div>
                      <div className="text-xl font-medium text-foreground leading-relaxed">
                        50 Emjay Blvd<br />
                        Brentwood, NY 11786
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 border border-border rounded-[24px] p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 blur-[40px] rounded-full pointer-events-none" />
                <h3 className="text-2xl font-bold mb-8 text-foreground relative z-10">Hours of Operation</h3>
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center border-b border-border/50 pb-6">
                    <div className="flex items-center gap-3 text-foreground font-medium text-[15px]">
                      <Clock className="w-5 h-5 text-[#D4AF37]" /> Monday - Friday
                    </div>
                    <div className="text-[#CBD5E1] text-[15px]">8:00 AM - 6:00 PM EST</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-foreground font-medium text-[15px]">
                      <Clock className="w-5 h-5 text-[#D4AF37]" /> After Hours
                    </div>
                    <div className="text-[#D4AF37] font-semibold text-[15px]">On-Call Dispatch</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="lg:col-span-7"
            >
              <div className="bg-card border border-border p-10 md:p-14 rounded-[32px] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Send a Message</h2>
                <p className="text-[#CBD5E1] mb-12 text-lg">Fill out the form below and the appropriate department will contact you directly.</p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="bg-background/80 h-14 rounded-xl border-border focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all text-base px-5" />
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
                            <FormLabel className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="JD Trucking LLC" {...field} className="bg-background/80 h-14 rounded-xl border-border focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all text-base px-5" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} className="bg-background/80 h-14 rounded-xl border-border focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all text-base px-5" />
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
                            <FormLabel className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 000-0000" {...field} className="bg-background/80 h-14 rounded-xl border-border focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all text-base px-5" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="serviceInterested"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">Topic / Service</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/80 h-14 rounded-xl border-border focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all text-base px-5">
                                <SelectValue placeholder="Select a topic" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-border bg-card">
                              <SelectItem value="General Inquiry" className="rounded-lg">General Inquiry</SelectItem>
                              <SelectItem value="Freight Brokerage / Loads" className="rounded-lg">Freight Brokerage / Loads</SelectItem>
                              <SelectItem value="Rented Trailer Program" className="rounded-lg">Rented Trailer Program</SelectItem>
                              <SelectItem value="TWIC / Permit Assistance" className="rounded-lg">TWIC / Permit Assistance</SelectItem>
                              <SelectItem value="Insurance Assistance" className="rounded-lg">Insurance Assistance</SelectItem>
                              <SelectItem value="Factoring" className="rounded-lg">Factoring Support</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">Message *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you?" 
                              className="min-h-[160px] resize-y bg-background/80 rounded-xl border-border focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all text-base p-5"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full h-14 mt-4 text-base" disabled={createLead.isPending}>
                      {createLead.isPending ? "Sending..." : "Submit Message"} <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </Form>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </Layout>
  )
}