import { useState } from "react"
import { Search, Package, MapPin, Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react"

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
    if (s.includes("delivered")) return "text-green-500 bg-green-500/10 border-green-500/20"
    if (s.includes("transit")) return "text-primary bg-primary/10 border-primary/20"
    if (s.includes("exception") || s.includes("delayed")) return "text-destructive bg-destructive/10 border-destructive/20"
    return "text-muted-foreground bg-secondary border-border"
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
      <div className="bg-secondary/30 border-b border-border py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <div className="w-16 h-16 bg-background border border-border rounded-sm flex items-center justify-center mx-auto mb-8">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 text-foreground">
            Track <span className="text-primary italic">Shipment.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto font-light">
            Enter your Tara Logistics tracking number below to view real-time status and delivery estimates.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <Input 
              type="text"
              placeholder="e.g. TL-48213"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-16 text-lg px-6 bg-background uppercase tracking-widest placeholder:normal-case font-display rounded-sm border-border focus-visible:border-primary"
            />
            <Button type="submit" size="lg" className="h-16 px-10 text-base sm:w-auto w-full font-display uppercase tracking-widest rounded-sm font-semibold">
              Track Load
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-6 font-light">
            Try test numbers: TL-48213, TL-90217, TL-33064
          </p>
        </div>
      </div>

      <div className="py-24 bg-background min-h-[40vh]">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          
          {!activeTracking && !isLoading && (
            <div className="text-center text-muted-foreground py-20 flex flex-col items-center border border-dashed border-border rounded-sm bg-secondary/10">
              <Package className="w-12 h-12 mb-6 opacity-30 text-primary" />
              <p className="text-lg font-light">Enter a tracking number above to see shipment details.</p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-20 space-y-6">
              <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground font-display uppercase tracking-widest animate-pulse text-sm">Locating Shipment...</p>
            </div>
          )}

          {isError && (
            <Card className="border-destructive/30 bg-destructive/5 shadow-none overflow-hidden rounded-sm">
              <div className="h-1 w-full bg-destructive" />
              <CardContent className="pt-12 pb-12 text-center flex flex-col items-center">
                <AlertCircle className="w-12 h-12 text-destructive mb-6" />
                <h3 className="text-3xl font-serif text-foreground mb-4">Shipment Not Found</h3>
                <p className="text-muted-foreground text-lg font-light">
                  No shipment found for tracking number <span className="font-bold text-foreground">"{activeTracking}"</span>. 
                  Please check the number and try again.
                </p>
              </CardContent>
            </Card>
          )}

          {shipment && !isLoading && !isError && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
                <div>
                  <div className="text-xs font-display uppercase tracking-widest text-muted-foreground mb-2">Tracking Number</div>
                  <div className="text-4xl font-serif text-foreground tracking-wider">{shipment.trackingNumber}</div>
                </div>
                <div className={`px-5 py-2.5 rounded-sm border inline-flex items-center gap-3 font-display uppercase tracking-widest text-xs font-semibold ${getStatusColor(shipment.status)}`}>
                  {shipment.status.toLowerCase() === "delivered" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  {shipment.status}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-none border-border rounded-sm bg-secondary/10">
                  <CardContent className="p-8">
                    <h4 className="font-display font-semibold uppercase tracking-widest text-muted-foreground text-xs mb-8 flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary" /> Route Details
                    </h4>
                    
                    <div className="relative pl-10 space-y-10 before:absolute before:inset-y-3 before:left-[19px] before:w-px before:bg-border">
                      <div className="relative">
                        <div className="absolute -left-[45px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-muted-foreground" />
                        <div className="text-xs text-muted-foreground font-display uppercase tracking-widest mb-2">Origin</div>
                        <div className="text-xl font-serif text-foreground">{shipment.origin}</div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[45px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary" />
                        <div className="text-xs text-muted-foreground font-display uppercase tracking-widest mb-2">Destination</div>
                        <div className="text-xl font-serif text-foreground">{shipment.destination}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-none border-border rounded-sm bg-secondary/10">
                  <CardContent className="p-8 space-y-8">
                    <div>
                      <h4 className="font-display font-semibold uppercase tracking-widest text-muted-foreground text-xs mb-3 flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-primary" /> Estimated Delivery
                      </h4>
                      <div className="text-2xl font-serif text-foreground">
                        {formatDate(shipment.estimatedDelivery)}
                      </div>
                    </div>
                    
                    <div className="h-px w-full bg-border" />
                    
                    <div>
                      <h4 className="font-display font-semibold uppercase tracking-widest text-muted-foreground text-xs mb-3">Carrier</h4>
                      <div className="text-xl font-serif text-foreground">{shipment.carrierName}</div>
                    </div>

                    <div>
                      <h4 className="font-display font-semibold uppercase tracking-widest text-muted-foreground text-xs mb-3">Last Updated</h4>
                      <div className="text-base font-light text-muted-foreground">{formatDate(shipment.lastUpdate)}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}
