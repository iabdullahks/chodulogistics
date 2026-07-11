import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

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
      <div className="relative border-b border-border py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={sunsetImage} alt="Highway at sunset" className="w-full h-full object-cover grayscale-[20%]" />
          <div className="absolute inset-0 bg-background/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-serif mb-6 text-foreground">
              Contact <span className="text-primary italic">Dispatch.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-light">
              Ready to move freight or need compliance assistance? Reach out to our team. We're available 24/7 to support our carriers and shippers.
            </p>
          </div>
        </div>
      </div>

      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-5 gap-16 lg:gap-24">
            
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-16">
              <div>
                <h3 className="text-3xl font-serif mb-8 text-foreground">Get in Touch</h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-secondary border border-border rounded-sm flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-display uppercase tracking-widest text-xs text-muted-foreground mb-2">Phone</div>
                      <div className="text-xl font-medium text-foreground">(800) 555-0199</div>
                      <div className="text-sm text-muted-foreground mt-1 font-light">24/7 Dispatch Support</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-secondary border border-border rounded-sm flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-display uppercase tracking-widest text-xs text-muted-foreground mb-2">Email</div>
                      <div className="text-xl font-medium text-foreground">dispatch@taralogistics.com</div>
                      <div className="text-sm text-muted-foreground mt-1 font-light">Average response: &lt; 30 mins</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-secondary border border-border rounded-sm flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-display uppercase tracking-widest text-xs text-muted-foreground mb-2">Corporate HQ</div>
                      <div className="text-xl font-medium text-foreground leading-snug">
                        100 Logistics Blvd, Ste 400<br />
                        Dallas, TX 75201
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-serif mb-8 text-foreground">Hours of Operation</h3>
                <div className="bg-secondary/40 p-8 border border-border rounded-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-border pb-6">
                    <div className="flex items-center gap-3 text-foreground font-medium">
                      <Clock className="w-4 h-4 text-primary" /> Monday - Friday
                    </div>
                    <div className="text-muted-foreground font-light">8:00 AM - 6:00 PM EST</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-foreground font-medium">
                      <Clock className="w-4 h-4 text-primary" /> After Hours
                    </div>
                    <div className="text-primary font-serif italic text-lg">On-Call Dispatch</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border p-10 md:p-14 rounded-sm shadow-2xl">
                <h2 className="text-4xl font-serif mb-4 text-foreground">Send a Message</h2>
                <p className="text-muted-foreground mb-10 font-light">Fill out the form below and the appropriate department will contact you.</p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-display uppercase tracking-wider text-xs text-muted-foreground">Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="bg-background/50 h-12 border-border" />
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
                            <FormLabel className="font-display uppercase tracking-wider text-xs text-muted-foreground">Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="JD Trucking LLC" {...field} className="bg-background/50 h-12 border-border" />
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
                            <FormLabel className="font-display uppercase tracking-wider text-xs text-muted-foreground">Email Address *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john@example.com" {...field} className="bg-background/50 h-12 border-border" />
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
                            <FormLabel className="font-display uppercase tracking-wider text-xs text-muted-foreground">Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 000-0000" {...field} className="bg-background/50 h-12 border-border" />
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
                          <FormLabel className="font-display uppercase tracking-wider text-xs text-muted-foreground">Topic / Service</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 bg-background/50 border-border">
                                <SelectValue placeholder="Select a topic" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                              <SelectItem value="Freight Brokerage / Loads">Freight Brokerage / Loads</SelectItem>
                              <SelectItem value="Rented Trailer Program">Rented Trailer Program</SelectItem>
                              <SelectItem value="TWIC / Permit Assistance">TWIC / Permit Assistance</SelectItem>
                              <SelectItem value="Insurance Assistance">Insurance Assistance</SelectItem>
                              <SelectItem value="Factoring">Factoring Support</SelectItem>
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
                          <FormLabel className="font-display uppercase tracking-wider text-xs text-muted-foreground">Message *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you?" 
                              className="min-h-[150px] resize-y bg-background/50 border-border"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full h-14 font-display font-semibold uppercase tracking-widest text-xs" disabled={createLead.isPending}>
                      {createLead.isPending ? "Sending..." : "Submit Message"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}
