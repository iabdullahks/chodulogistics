import { Link, useLocation } from "wouter"
import { Truck, Menu, X, ChevronRight, Mail, Phone, MapPin, ArrowRight, Instagram, Linkedin, Twitter, Facebook } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/payment-process", label: "Payment Process" },
  { href: "/track", label: "Track Shipment" },
  { href: "/contact", label: "Contact" },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location])

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans bg-background text-foreground selection:bg-primary/30 selection:text-primary">
      {/* Header */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500 ease-out border-b",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-border py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            : "bg-transparent border-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 md:px-10 flex items-center justify-between max-w-[1400px]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#F4C542]/5 border border-[#D4AF37]/20 w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Truck className="w-5 h-5 text-[#D4AF37]" strokeWidth={2} />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              Brokerage<span className="text-[#D4AF37]"> Co. of American INC</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-[15px] font-medium transition-colors hover:text-foreground",
                  location === link.href ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {link.label}
                {location === link.href && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-[#D4AF37] rounded-full" />
                )}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-[#D4AF37] rounded-full transition-all duration-300 ease-out opacity-0 group-hover:w-full group-hover:opacity-100" />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link href="/contact">
              <Button className="rounded-xl px-6 h-11 text-[15px]">Get a Quote</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-foreground relative z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}
      >
        <div className="flex flex-col h-full pt-28 px-6 pb-10 overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-2xl font-bold py-4 border-b border-border/50 flex justify-between items-center transition-colors",
                  location === link.href ? "text-[#D4AF37]" : "text-foreground"
                )}
              >
                {link.label}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            ))}
          </nav>
          <div className="mt-8">
            <Link href="/contact" className="w-full block">
              <Button className="w-full rounded-xl h-14 text-lg">Get a Quote</Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border pt-20 pb-10 relative overflow-hidden">
        {/* subtle abstract background lines */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]" aria-hidden="true">
          <line x1="10%" y1="0%" x2="35%" y2="100%" stroke="#D4AF37" strokeWidth="1" />
          <line x1="90%" y1="0%" x2="65%" y2="100%" stroke="#D4AF37" strokeWidth="1" />
        </svg>

        <div className="container mx-auto px-6 md:px-10 max-w-[1400px] relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            <div className="lg:col-span-4 space-y-6">
              <Link href="/" className="flex items-center gap-3 group inline-flex">
                <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#F4C542]/5 border border-[#D4AF37]/20 w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Truck className="w-5 h-5 text-[#D4AF37]" strokeWidth={2} />
                </div>
                <span className="font-bold text-xl tracking-tight text-foreground">
                  Brokerage<span className="text-[#D4AF37]"> Co. of American INC</span>
                </span>
              </Link>
              <p className="text-[#CBD5E1] text-[15px] leading-relaxed max-w-sm">
                Empowering truck carriers and owner-operators with the resources, freight, and administrative support needed to run a profitable business.
              </p>

              {/* Newsletter */}
              <div className="pt-4">
                <h4 className="text-[14px] font-semibold text-foreground mb-3">Subscribe to updates</h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="flex-1 bg-background/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all text-foreground"
                  />
                  <Button size="icon" className="shrink-0 rounded-xl w-11 h-11">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-semibold text-foreground mb-6 text-[15px]">Services</h4>
              <ul className="space-y-4">
                <li><Link href="/services/rented-trailer-program" className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors text-[15px]">Trailer Rental</Link></li>
                <li><Link href="/services/twic-card-assistance" className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors text-[15px]">TWIC Card</Link></li>
                <li><Link href="/services/insurance-assistance" className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors text-[15px]">Insurance</Link></li>
                <li><Link href="/services/factoring-registration" className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors text-[15px]">Factoring</Link></li>
                <li><Link href="/services/liquor-permit" className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors text-[15px]">Liquor Permits</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-semibold text-foreground mb-6 text-[15px]">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors text-[15px]">About Us</Link></li>
                <li><Link href="/payment-process" className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors text-[15px]">Payment Process</Link></li>
                <li><Link href="/track" className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors text-[15px]">Track Shipment</Link></li>
                <li><Link href="/contact" className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors text-[15px]">Contact</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h4 className="font-semibold text-foreground mb-6 text-[15px]">Contact Info</h4>
              <ul className="space-y-5">
                <li className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-background/50 border border-border flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/50 transition-colors">
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-[13px] text-[#94A3B8] mb-0.5">24/7 Support</div>
                    <div className="text-[15px] font-medium text-foreground">(330) 756-7732</div>
                  </div>
                </li>
                <li className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-background/50 border border-border flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/50 transition-colors">
                    <Mail className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-[13px] text-[#94A3B8] mb-0.5">Email Us</div>
                    <a href="mailto:winston@brokeragecompanyofamericaninc.com" className="text-[15px] font-medium text-foreground break-all hover:text-[#D4AF37] transition-colors">winston@brokeragecompanyofamericaninc.com</a>
                  </div>
                </li>
                <li className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-background/50 border border-border flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/50 transition-colors">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-[13px] text-[#94A3B8] mb-0.5">Headquarters</div>
                    <div className="text-[15px] font-medium text-foreground leading-snug">50 Emjay Blvd<br />Brentwood, NY 11786</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[14px] text-[#94A3B8]">
              &copy; {new Date().getFullYear()} Brokerage Company of American INC. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-[#94A3B8] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all hover:scale-110">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-[#94A3B8] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all hover:scale-110">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-[#94A3B8] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all hover:scale-110">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
