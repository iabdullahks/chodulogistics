import { Layout } from "@/components/layout"
import { CheckCircle2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"

import loadingDockImage from "@/assets/photos/loading-dock.jpg"

export default function TwicCardAssistance() {
  return (
    <Layout>
      <div className="relative border-b border-border py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={loadingDockImage} alt="Loading dock" className="w-full h-full object-cover grayscale-[30%]" />
          <div className="absolute inset-0 bg-background/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-background/50 border border-border mb-6 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-display uppercase tracking-widest text-primary font-semibold">Service Detail</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif mb-6 text-foreground max-w-4xl">
            TWIC Card <br /><span className="text-primary italic">Assistance.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
            Unlock high-paying port and maritime loads. We guide you step-by-step through the Transportation Worker Identification Credential process.
          </p>
        </div>
      </div>

      <div className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-3xl md:text-4xl font-serif mb-6 text-foreground">Open Doors to Port Freight</h2>
                <div className="w-12 h-0.5 bg-primary mb-8" />
                <div className="prose prose-invert max-w-none text-muted-foreground text-lg leading-relaxed space-y-6 font-light">
                  <p>
                    A TWIC (Transportation Worker Identification Credential) card is mandatory for unescorted access to secure areas of maritime facilities and vessels. Without it, you are locked out of lucrative drayage and port-adjacent freight opportunities.
                  </p>
                  <p>
                    The application process involves background checks, TSA coordination, and specific documentation. Tara Logistics simplifies this bureaucratic hurdle, ensuring your application is accurate, complete, and processed as quickly as possible.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-serif mb-6 text-foreground">Our Assistance Includes</h2>
                <ul className="grid sm:grid-cols-2 gap-6">
                  {[
                    "Pre-screening eligibility assessment",
                    "Application paperwork completion assistance",
                    "Appointment scheduling at enrollment centers",
                    "Required documentation checklists",
                    "Status tracking and follow-ups",
                    "Renewal reminders and processing"
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
                <h3 className="text-3xl font-serif mb-4 text-foreground">Start Your Application</h3>
                <p className="text-muted-foreground mb-8 font-light">
                  Stop missing out on port loads. Contact our compliance team to get your TWIC application started today.
                </p>
                <Link href="/contact" className="block w-full">
                  <Button size="lg" className="w-full h-14 font-display uppercase tracking-widest text-xs font-semibold">Get TWIC Assistance</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
