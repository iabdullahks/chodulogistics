import { useState } from "react"
import { Search, Package, MapPin, Calendar, Clock, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useTrackShipment, getTrackShipmentQueryKey } from "@workspace/api-client-react"
import { Layout } from "@/components/layout"
import { format } from "date-fns"

export default function Track() {
  const [searchInput, setSearchInput] = useState("")
  const [activeTracking, setActiveTracking] = useState<string | null>(null)

  const { data: shipment, isLoading, isError, error } = useTrackShipment(
    activeTracking as string, 
    { 
      query: { 
        enabled: !!activeTracking, 
        queryKey: getTrackShipmentQueryKey(activeTracking || "") 
      } 
    }
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setActiveTracking(searchInput.trim().toUpperCase())
    }
  }

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("delivered")) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
    if (s.includes("transit")) return "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20"
    if (s.includes("exception") || s.includes("delayed")) return "text-red-400 bg-red-400/10 border-red-400/20"
    return "text-[#CBD5E1] bg-secondary border-border"
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a")
    } catch {
      return dateStr
    }
  }

  return (
    <Layout>
      <div className="bg-secondary relative border-b border-border py-24 md:py-32 pt-32 lg:pt-40 overflow-hidden">
        {/* abstract geometric lines */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]" aria-hidden="true">
          <circle cx="50%" cy="50%" r="400" stroke="#D4AF37" strokeWidth="1" fill="none" strokeDasharray="4 12" />
          <circle cx="50%" cy="50%" r="600" stroke="#D4AF37" strokeWidth="1" fill="none" strokeDasharray="4 12" />
        </svg>
        
        <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        <div className="container mx-auto px-6 md:px-10 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="w-20 h-20 bg-background border border-border rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(212,175,55,0.1)] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent opacity-50 rounded-2xl" />
              <Search className="w-8 h-8 text-[#D4AF37] relative z-10" strokeWidth={2.5} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground tracking-tight leading-[1.05]">
              Track <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4C542]">Shipment.</span>
            </h1>
            
            <p className="text-xl text-[#CBD5E1] leading-relaxed mb-12 max-w-2xl mx-auto">
              Enter your Tara Logistics tracking number below to view real-time status and delivery estimates.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto relative z-20">
              <Input 
                type="text"
                placeholder="e.g. TL-48213"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-16 text-lg px-8 bg-background uppercase tracking-widest placeholder:normal-case rounded-xl border-border focus-visible:border-[#D4AF37] focus-visible:ring-[#D4AF37]/20 shadow-lg transition-all"
              />
              <Button type="submit" size="lg" className="h-16 px-10 text-base sm:w-auto w-full rounded-xl shadow-[0_12px_24px_-8px_rgba(212,175,55,0.4)]">
                Track Load <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
            
            <p className="text-[15px] text-[#94A3B8] mt-8">
              Try test numbers: <span className="text-foreground font-medium bg-background/50 px-2 py-1 rounded border border-border">TL-48213</span>, <span className="text-foreground font-medium bg-background/50 px-2 py-1 rounded border border-border">TL-90217</span>, <span className="text-foreground font-medium bg-background/50 px-2 py-1 rounded border border-border">TL-33064</span>
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-24 md:py-32 bg-background min-h-[50vh]">
        <div className="container mx-auto px-6 md:px-10 max-w-[1000px]">
          
          <AnimatePresence mode="wait">
            {!activeTracking && !isLoading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-[#94A3B8] py-24 flex flex-col items-center border border-dashed border-border rounded-[32px] bg-secondary/30"
              >
                <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center mb-8 border border-border">
                  <Package className="w-10 h-10 opacity-50 text-[#D4AF37]" strokeWidth={1.5} />
                </div>
                <p className="text-xl">Enter a tracking number above to see shipment details.</p>
              </motion.div>
            )}

            {isLoading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-32 flex flex-col items-center"
              >
                <div className="relative w-20 h-20 mb-8">
                  <div className="absolute inset-0 border-4 border-border rounded-full" />
                  <div className="absolute inset-0 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-[#D4AF37] font-semibold uppercase tracking-widest text-sm animate-pulse">Locating Shipment...</p>
              </motion.div>
            )}

            {isError && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-red-500/30 bg-red-500/5 shadow-2xl overflow-hidden rounded-[24px]">
                  <div className="h-1.5 w-full bg-red-500" />
                  <CardContent className="pt-16 pb-16 text-center flex flex-col items-center px-6">
                    <div className="w-20 h-20 bg-background rounded-full border border-red-500/20 flex items-center justify-center mb-8 shadow-lg">
                      <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">Shipment Not Found</h3>
                    <p className="text-[#CBD5E1] text-lg max-w-lg mx-auto">
                      No shipment found for tracking number <span className="font-bold text-foreground bg-background px-2 py-1 rounded border border-border">"{activeTracking}"</span>. 
                      Please check the number and try again.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {shipment && !isLoading && !isError && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Header Card */}
                <div className="bg-card border border-border rounded-[32px] p-10 md:p-12 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.3)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 blur-[60px] rounded-full pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-wider text-[#94A3B8] mb-3">Tracking Number</div>
                      <div className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">{shipment.trackingNumber}</div>
                    </div>
                    <div className={`px-6 py-3 rounded-xl border inline-flex items-center gap-3 font-semibold uppercase tracking-widest text-[13px] shadow-sm ${getStatusColor(shipment.status)}`}>
                      {shipment.status.toLowerCase() === "delivered" ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      {shipment.status}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Route Card */}
                  <Card className="shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)] border-border rounded-[24px] bg-card overflow-hidden">
                    <CardContent className="p-10 md:p-12 h-full flex flex-col">
                      <h4 className="font-semibold uppercase tracking-wider text-[#94A3B8] text-xs mb-10 flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#D4AF37]" /> Route Details
                      </h4>
                      
                      <div className="relative pl-12 space-y-12 before:absolute before:inset-y-4 before:left-[23px] before:w-0.5 before:bg-border flex-1">
                        <div className="relative">
                          <div className="absolute -left-[53px] top-1.5 w-6 h-6 rounded-full bg-background border-[3px] border-[#94A3B8] shadow-sm" />
                          <div className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mb-3">Origin</div>
                          <div className="text-2xl font-bold text-foreground">{shipment.origin}</div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[53px] top-1.5 w-6 h-6 rounded-full bg-background border-[3px] border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                          <div className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mb-3">Destination</div>
                          <div className="text-2xl font-bold text-foreground">{shipment.destination}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Info Card */}
                  <Card className="shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)] border-border rounded-[24px] bg-card overflow-hidden">
                    <CardContent className="p-10 md:p-12 space-y-10">
                      <div>
                        <h4 className="font-semibold uppercase tracking-wider text-[#94A3B8] text-xs mb-4 flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-[#D4AF37]" /> Estimated Delivery
                        </h4>
                        <div className="text-3xl font-bold text-foreground tracking-tight">
                          {formatDate(shipment.estimatedDelivery)}
                        </div>
                      </div>
                      
                      <div className="h-px w-full bg-border" />
                      
                      <div>
                        <h4 className="font-semibold uppercase tracking-wider text-[#94A3B8] text-xs mb-4">Carrier</h4>
                        <div className="text-xl font-bold text-foreground">{shipment.carrierName}</div>
                      </div>

                      <div>
                        <h4 className="font-semibold uppercase tracking-wider text-[#94A3B8] text-xs mb-3">Last Updated</h4>
                        <div className="text-[15px] text-[#CBD5E1]">{formatDate(shipment.lastUpdate)}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </Layout>
  )
}