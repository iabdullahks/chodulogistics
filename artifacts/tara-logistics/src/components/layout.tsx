import { Link, useLocation } from "wouter"
import { Truck, Menu, X, ChevronRight } from "lucide-react"
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
  }, [location])

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 border-b",
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-border py-4 shadow-sm"
            : "bg-background border-transparent py-6"
        )}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="bg-primary/10 border border-primary/30 p-2.5 rounded-sm flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-serif text-2xl tracking-tight text-foreground">
              Tara<span className="text-primary italic">Logistics</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-display uppercase tracking-widest text-xs font-semibold transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link href="/contact">
              <Button className="font-display uppercase tracking-widest text-xs font-semibold rounded-sm">Get a Quote</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background pt-24 px-4 flex flex-col gap-6 border-b border-border">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-serif text-2xl py-4 border-b border-border flex justify-between items-center",
                  location === link.href ? "text-primary italic" : "text-foreground"
                )}
              >
                {link.label}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            ))}
          </nav>
          <div className="mt-8">
            <Link href="/contact" className="w-full block">
              <Button size="lg" className="w-full font-display uppercase tracking-widest text-xs font-semibold h-14">Get a Quote</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pt-[88px] md:pt-[96px] flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border mt-auto">
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="md:col-span-1 space-y-6">
              <Link href="/" className="flex items-center gap-4 group inline-flex">
                <div className="bg-primary/10 border border-primary/30 p-2.5 rounded-sm flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <span className="font-serif text-2xl tracking-tight text-foreground">
                  Tara<span className="text-primary italic">Logistics</span>
                </span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-light">
                Comprehensive freight brokerage and compliance support for carriers nationwide. Built on trust, driven by performance.
              </p>
            </div>
            
            <div>
              <h4 className="font-display uppercase tracking-widest font-semibold mb-8 text-foreground text-sm">Services</h4>
              <ul className="space-y-4">
                <li><Link href="/services/rented-trailer-program" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light">Rented Trailer Program</Link></li>
                <li><Link href="/services/twic-card-assistance" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light">TWIC Card Assistance</Link></li>
                <li><Link href="/services/insurance-assistance" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light">Insurance Application</Link></li>
                <li><Link href="/services/factoring-registration" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light">Factoring Support</Link></li>
                <li><Link href="/services/liquor-permit" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light">Liquor Permits</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display uppercase tracking-widest font-semibold mb-8 text-foreground text-sm">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light">About Us</Link></li>
                <li><Link href="/payment-process" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light">Payment Process</Link></li>
                <li><Link href="/track" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light">Track Shipment</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display uppercase tracking-widest font-semibold mb-8 text-foreground text-sm">Contact</h4>
              <ul className="space-y-4 text-sm text-muted-foreground font-light">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">T:</span> 
                  <span>(800) 555-0199</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">E:</span> 
                  <span>dispatch@taralogistics.com</span>
                </li>
                <li className="mt-8 pt-8 border-t border-border">
                  <span className="block font-bold text-foreground mb-2 font-display uppercase tracking-widest text-xs">Hours of Operation</span>
                  Mon-Fri: 24/7 Support<br />
                  Weekends: On-Call Dispatch
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-light">
            <div>&copy; {new Date().getFullYear()} Tara Logistics. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
