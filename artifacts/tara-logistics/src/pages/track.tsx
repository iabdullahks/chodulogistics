import { useState, useEffect } from "react"
import { useParams, useLocation } from "wouter"
import { 
  Search, Package, Calendar, Clock, AlertCircle, 
  CheckCircle2, ArrowRight, RotateCcw, Navigation, ShieldCheck
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useTrackShipment, getTrackShipmentQueryKey } from "@workspace/api-client-react"
import { Layout } from "@/components/layout"
import { format } from "date-fns"

// Approximate coordinate mapping for US states/cities to SVG grid (800x500 space)
const getCoordinatesForLocation = (locStr: string) => {
  const clean = locStr.trim();
  const parts = clean.split(",");
  const state = parts[parts.length - 1]?.trim().toUpperCase() || "";
  
  const stateMap: Record<string, { x: number; y: number }> = {
    CA: { x: 120, y: 250 },
    NY: { x: 680, y: 160 },
    IL: { x: 450, y: 200 },
    TX: { x: 380, y: 400 },
    FL: { x: 620, y: 440 },
    GA: { x: 570, y: 350 },
    WA: { x: 100, y: 80 },
    OR: { x: 80, y: 140 },
    NV: { x: 150, y: 220 },
    AZ: { x: 200, y: 340 },
    CO: { x: 280, y: 260 },
    OH: { x: 550, y: 210 },
    PA: { x: 630, y: 180 },
    MI: { x: 520, y: 160 },
    NC: { x: 620, y: 280 },
    SC: { x: 600, y: 320 },
    TN: { x: 520, y: 300 },
    KY: { x: 530, y: 260 },
    VA: { x: 640, y: 240 },
    MA: { x: 720, y: 140 },
    NJ: { x: 690, y: 190 },
    MD: { x: 660, y: 210 },
  };

  if (stateMap[state]) {
    // Add slight jitter based on location name hash for uniqueness
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = clean.charCodeAt(i) + ((hash << 5) - hash);
    }
    const dx = (hash % 16) - 8;
    const dy = ((hash >> 2) % 16) - 8;
    return { x: stateMap[state].x + dx, y: stateMap[state].y + dy };
  }

  // Fallback central US coordinate with hash-based jitter
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  const x = 320 + Math.abs(hash % 250);
  const y = 180 + Math.abs((hash >> 4) % 180);
  return { x, y };
};

const getLatLongForLocation = (locStr: string) => {
  const clean = locStr.trim().toUpperCase();
  if (clean.includes("IL") || clean.includes("CHICAGO")) {
    return { lat: 41.8781, lng: -87.6298 };
  }
  if (clean.includes("NY") || clean.includes("NEW YORK") || clean.includes("BRENTWOOD")) {
    return { lat: 40.7812, lng: -73.2462 };
  }
  if (clean.includes("CA") || clean.includes("LOS ANGELES")) {
    return { lat: 34.0522, lng: -118.2437 };
  }
  if (clean.includes("TX") || clean.includes("HOUSTON") || clean.includes("DALLAS")) {
    return { lat: 29.7604, lng: -95.3698 };
  }
  if (clean.includes("FL") || clean.includes("MIAMI")) {
    return { lat: 25.7617, lng: -80.1918 };
  }
  // Fallback: hash based lat/long
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  const lat = 32.5 + Math.abs(hash % 12);
  const lng = -118.0 + Math.abs((hash >> 3) % 40);
  return { lat, lng };
};



// Helper for status colors
const getStatusColorConfig = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("delivered")) {
    return {
      text: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      pulse: "bg-emerald-400",
      title: "Delivered",
      progress: 1.0
    };
  }
  if (s.includes("transit")) {
    return {
      text: "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20",
      pulse: "bg-[#D4AF37]",
      title: "In Transit",
      progress: 0.65
    };
  }
  if (s.includes("exception") || s.includes("delayed")) {
    return {
      text: "text-red-400 bg-red-400/10 border-red-400/20",
      pulse: "bg-red-400",
      title: "Delayed",
      progress: 0.45
    };
  }
  if (s.includes("pickup") || s.includes("arrived")) {
    return {
      text: "text-blue-400 bg-blue-400/10 border-blue-400/20",
      pulse: "bg-blue-400",
      title: "Arrived at Pickup",
      progress: 0.20
    };
  }
  return {
    text: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    pulse: "bg-sky-400",
    title: "Dispatched",
    progress: 0.05
  };
};

export default function Track() {
  const params = useParams<{ shipmentId?: string }>()
  const [, setLocation] = useLocation()
  
  const [searchInput, setSearchInput] = useState(params.shipmentId || "")
  const [activeTracking, setActiveTracking] = useState<string | null>(params.shipmentId || null)

  // Zooming & view state of vector map
  const [zoom, setZoom] = useState(1)
  const [mapCenterOffset, setMapCenterOffset] = useState({ x: 0, y: 0 })
  const [liveGpsJitter, setLiveGpsJitter] = useState({ lat: 0, lng: 0 })

  const { data: shipment, isLoading, isError } = useTrackShipment(
    activeTracking as string, 
    { 
      query: { 
        enabled: !!activeTracking, 
        queryKey: getTrackShipmentQueryKey(activeTracking || "") 
      } 
    }
  )

  // Synchronize route param changes with state
  useEffect(() => {
    if (params.shipmentId) {
      const formatted = params.shipmentId.toUpperCase()
      setActiveTracking(formatted)
      setSearchInput(formatted)
    } else {
      setActiveTracking(null)
      setSearchInput("")
    }
  }, [params.shipmentId])

  // Periodic coordinates jitter simulator for real-time tracking dashboard
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (shipment && !shipment.status.toLowerCase().includes("delivered")) {
      interval = setInterval(() => {
        setLiveGpsJitter({
          lat: (Math.random() - 0.5) * 0.0015,
          lng: (Math.random() - 0.5) * 0.0015
        })
      }, 2500)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [shipment])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      const tracking = searchInput.trim().toUpperCase()
      setLocation(`/track/${tracking}`)
    }
  }

  const handleZoom = (factor: number) => {
    setZoom(prev => Math.max(1, Math.min(prev + factor, 3.5)))
  }

  const handleResetZoom = () => {
    setZoom(1)
    setMapCenterOffset({ x: 0, y: 0 })
  }

  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return "--"
    try {
      return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a")
    } catch {
      return String(dateStr)
    }
  }

  // Parse shipment properties
  const origin = shipment?.origin || ""
  const destination = shipment?.destination || ""
  const status = shipment?.status || "Dispatched"
  const carrierName = shipment?.carrierName || "Brokerage Co. of American INC"
  const shipmentId = shipment?.id || 0

  const originCoord = getCoordinatesForLocation(origin)
  const destCoord = getCoordinatesForLocation(destination)
  const statusConfig = getStatusColorConfig(status)


  // Bezier routing math
  const bezierControl = {
    x: (originCoord.x + destCoord.x) / 2,
    y: Math.min(originCoord.y, destCoord.y) - 60
  }

  // Sample bezier coordinate point at progression time t
  const t = statusConfig.progress
  const getBezierPoint = (p0: {x: number, y: number}, p1: {x: number, y: number}, p2: {x: number, y: number}, time: number) => {
    const x = (1 - time) * (1 - time) * p0.x + 2 * (1 - time) * time * p1.x + time * time * p2.x
    const y = (1 - time) * (1 - time) * p0.y + 2 * (1 - time) * time * p1.y + time * time * p2.y
    return { x, y }
  }

  const assetPos = getBezierPoint(originCoord, bezierControl, destCoord, t)

  // Real-world coordinates interpolation
  const originLL = getLatLongForLocation(origin)
  const destLL = getLatLongForLocation(destination)
  const currentLat = originLL.lat + (destLL.lat - originLL.lat) * t + liveGpsJitter.lat
  const currentLng = originLL.lng + (destLL.lng - originLL.lng) * t + liveGpsJitter.lng

  // Estimated checkpoints creation based on shipment dates
  const buildCheckpoints = () => {
    const deliveryDate = shipment ? new Date(shipment.estimatedDelivery) : new Date()
    const baseDate = new Date(deliveryDate.getTime() - 3 * 24 * 60 * 60 * 1000)
    const diffMs = deliveryDate.getTime() - baseDate.getTime()
    
    const steps = [
      {
        id: 1,
        title: "Dispatched",
        location: origin,
        time: baseDate,
        description: "Shipment details received and driver assigned",
        isCompleted: t >= 0.05
      },
      {
        id: 2,
        title: "Arrived at Pickup",
        location: origin,
        time: new Date(baseDate.getTime() + Math.min(diffMs * 0.15, 3 * 3600 * 1000)),
        description: "Trailer loaded and cargo secured",
        isCompleted: t >= 0.20
      },
      {
        id: 3,
        title: "In Transit",
        location: "En Route via Logistics Corridor",
        time: new Date(baseDate.getTime() + diffMs * 0.5),
        description: "Cargo is on schedule and tracking live",
        isCompleted: t >= 0.65
      },
      {
        id: 4,
        title: "Out for Delivery",
        location: destination,
        time: new Date(deliveryDate.getTime() - Math.min(diffMs * 0.08, 2 * 3600 * 1000)),
        description: "Approaching delivery facility for unloading",
        isCompleted: t >= 0.90
      },
      {
        id: 5,
        title: "Delivered",
        location: destination,
        time: deliveryDate,
        description: "Cargo successfully hand-off. Sign-off recorded.",
        isCompleted: t >= 1.0
      }
    ]
    return steps
  }

  const checkpoints = buildCheckpoints()

  // Calculate grid coordinates path
  const pathD = `M ${originCoord.x} ${originCoord.y} Q ${bezierControl.x} ${bezierControl.y} ${destCoord.x} ${destCoord.y}`

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
              Enter your Brokerage Company of American INC tracking number below to view real-time status and delivery estimates.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto relative z-20">
              <Input 
                type="text"
                placeholder="e.g. TL-TEST12345"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-16 text-lg px-8 bg-background uppercase tracking-widest placeholder:normal-case rounded-xl border-border focus-visible:border-[#D4AF37] focus-visible:ring-[#D4AF37]/20 shadow-lg transition-all"
              />
              <Button type="submit" size="lg" className="h-16 px-10 text-base sm:w-auto w-full rounded-xl shadow-[0_12px_24px_-8px_rgba(212,175,55,0.4)]">
                Track Load <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
            
            <p className="text-[15px] text-[#94A3B8] mt-8">
              Try test number: <span className="text-foreground font-medium bg-background/50 px-2 py-1 rounded border border-border">TL-TEST12345</span>
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-16 bg-background min-h-[50vh]">
        <div className="container mx-auto px-6 md:px-10 max-w-[1400px]">
          
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
                <Card className="border-red-500/30 bg-red-500/5 shadow-2xl overflow-hidden rounded-[24px] max-w-2xl mx-auto">
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
                {/* Unified Layout: Split Panel View */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  
                  {/* Left Column / Main Panel: Map View */}
                  <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-6">
                    
                    {/* Header Summary for Map Column */}
                    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Active Tracker</span>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold text-foreground tracking-tight">{shipment.trackingNumber}</h2>
                          <div className={`px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${statusConfig.text}`}>
                            <span className={`w-2 h-2 rounded-full ${statusConfig.pulse} ${!status.toLowerCase().includes("delivered") ? "animate-pulse" : ""}`} />
                            {statusConfig.title}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm border-l border-border pl-0 sm:pl-6 pt-2 sm:pt-0">
                        <span className="text-xs text-muted-foreground block mb-0.5">Carrier Service</span>
                        <span className="font-semibold text-foreground flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-primary" /> {carrierName}
                        </span>
                      </div>
                    </div>

                    {/* Vector Interactive Map Box */}
                    <div className="bg-card border border-border rounded-3xl overflow-hidden relative shadow-2xl w-full aspect-[4/3] md:aspect-[16/10] flex flex-col group/map">
                      {/* Grid background layer */}
                      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
                      
                      {/* SVG Vector Drawing */}
                      <div className="w-full h-full relative overflow-hidden bg-[#0a0f1d] cursor-grab active:cursor-grabbing">
                        <svg 
                          className="w-full h-full select-none" 
                          viewBox={`${(400 - 400 / zoom) + mapCenterOffset.x} ${(250 - 250 / zoom) + mapCenterOffset.y} ${800 / zoom} ${500 / zoom}`}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Map Background Hubs & Lanes (Abstract logistic network lines) */}
                          <g stroke="rgba(255,255,255,0.02)" strokeWidth="1" fill="none">
                            <line x1="120" y1="250" x2="380" y2="400" />
                            <line x1="380" y1="400" x2="620" y2="440" />
                            <line x1="620" y1="440" x2="570" y2="350" />
                            <line x1="570" y1="350" x2="680" y2="160" />
                            <line x1="450" y1="200" x2="680" y2="160" />
                            <line x1="120" y1="250" x2="450" y2="200" />
                            <line x1="100" y1="80" x2="450" y2="200" />
                            <line x1="380" y1="400" x2="450" y2="200" />
                            <line x1="280" y1="260" x2="450" y2="200" />
                            <line x1="120" y1="250" x2="280" y2="260" />
                          </g>

                          {/* Network Hub Dots */}
                          <g fill="rgba(255,255,255,0.08)">
                            <circle cx="120" cy="250" r="3" />
                            <circle cx="380" cy="400" r="3" />
                            <circle cx="620" cy="440" r="3" />
                            <circle cx="570" cy="350" r="3" />
                            <circle cx="680" cy="160" r="3" />
                            <circle cx="450" cy="200" r="3" />
                            <circle cx="100" cy="80" r="3" />
                            <circle cx="280" cy="260" r="3" />
                          </g>

                          {/* 1. Main Route Bezier Path */}
                          <path 
                            d={pathD} 
                            fill="none" 
                            stroke="rgba(212, 175, 55, 0.15)" 
                            strokeWidth="5" 
                            strokeLinecap="round" 
                          />
                          <path 
                            id="route-path"
                            d={pathD} 
                            fill="none" 
                            stroke="#D4AF37" 
                            strokeWidth="3.5" 
                            strokeDasharray="8 6" 
                            strokeLinecap="round"
                            className="stroke-[url(#gradient-path)]"
                          />

                          {/* SVG Glow Filter Definition */}
                          <defs>
                            <linearGradient id="gradient-path" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                              <stop offset="50%" stopColor="#F4C542" stopOpacity="1" />
                              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.4" />
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="6" result="blur" />
                              <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                          </defs>

                          {/* 2. Origin Pin */}
                          <g transform={`translate(${originCoord.x}, ${originCoord.y})`}>
                            <circle r="16" fill="rgba(16, 185, 129, 0.15)" className="animate-pulse" />
                            <circle r="8" fill="rgba(16, 185, 129, 0.3)" />
                            <circle r="4" fill="#10B981" />
                            {/* Text label */}
                            <text y="-18" textAnchor="middle" className="fill-[#10B981] font-sans text-[11px] font-semibold tracking-wider uppercase">
                              Origin
                            </text>
                            <text y="22" textAnchor="middle" className="fill-[#CBD5E1] font-sans text-[10px]">
                              {origin.split(',')[0]}
                            </text>
                          </g>

                          {/* 3. Destination Pin */}
                          <g transform={`translate(${destCoord.x}, ${destCoord.y})`}>
                            <circle r="16" fill="rgba(212, 175, 55, 0.15)" className="animate-pulse" />
                            <circle r="8" fill="rgba(212, 175, 55, 0.3)" />
                            <circle r="4" fill="#D4AF37" />
                            {/* Text label */}
                            <text y="-18" textAnchor="middle" className="fill-[#D4AF37] font-sans text-[11px] font-semibold tracking-wider uppercase">
                              Destination
                            </text>
                            <text y="22" textAnchor="middle" className="fill-[#CBD5E1] font-sans text-[10px]">
                              {destination.split(',')[0]}
                            </text>
                          </g>

                          {/* 4. Live Asset Tracker Marker (Truck/Dot) */}
                          <g transform={`translate(${assetPos.x}, ${assetPos.y})`}>
                            {/* Glowing rings */}
                            {!status.toLowerCase().includes("delivered") && (
                              <>
                                <circle r="28" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.2" className="scale-0 origin-center animate-[ping_2s_infinite]" />
                                <circle r="18" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.4" className="scale-0 origin-center animate-[ping_1.5s_infinite]" />
                              </>
                            )}
                            {/* Background fill */}
                            <circle r="11" className="fill-background stroke-primary stroke-2" style={{ filter: "drop-shadow(0 0 8px rgba(212,175,55,0.6))" }} />
                            
                            {/* Truck icon overlay inside map marker */}
                            <g transform="translate(-5.5, -5.5) scale(0.45)">
                              <path 
                                d="M14 9V5a2 2 0 0 0-2-2l-4 0M14 9h4a2 2 0 0 1 2 2v2M14 9l-6 0M2 13h18M2 13V9a2 2 0 0 1 2-2h4M6 13a3 3 0 1 1-6 0" 
                                stroke="#D4AF37" 
                                strokeWidth="2.5" 
                                fill="none" 
                                strokeLinecap="round"
                              />
                              <circle cx="7" cy="13" r="2" fill="#D4AF37" />
                              <circle cx="17" cy="13" r="2" fill="#D4AF37" />
                            </g>
                          </g>
                        </svg>

                        {/* Interactive Zoom Controls */}
                        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="w-10 h-10 rounded-xl bg-background/95 hover:bg-secondary border border-border shadow-lg"
                            onClick={() => handleZoom(0.3)}
                          >
                            <span className="text-xl font-bold text-foreground">+</span>
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="w-10 h-10 rounded-xl bg-background/95 hover:bg-secondary border border-border shadow-lg"
                            onClick={() => handleZoom(-0.3)}
                          >
                            <span className="text-xl font-bold text-foreground">-</span>
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="w-10 h-10 rounded-xl bg-background/95 hover:bg-secondary border border-border shadow-lg"
                            onClick={handleResetZoom}
                          >
                            <RotateCcw className="w-4 h-4 text-foreground" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Map Footer status */}
                      <div className="border-t border-border p-4 bg-background/40 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Navigation className="w-3.5 h-3.5 text-primary" />
                          Curved routing visualizes logistics corridor direction.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column / Side Panel: Shipment Details */}
                  <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-6">
                    
                    {/* Live Progress Card (ETA & Transit Completion) */}
                    <Card className="shadow-lg border-border bg-card overflow-hidden">
                      <CardContent className="p-6 md:p-8 space-y-6">
                        <div>
                          <h3 className="font-semibold uppercase tracking-wider text-muted-foreground text-xs mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" /> Expected Delivery
                          </h3>
                          <div className="text-2xl font-bold text-foreground tracking-tight leading-tight">
                            {formatDate(shipment.estimatedDelivery)}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-muted-foreground block uppercase tracking-wider">Transit Progress</span>
                            <span className="text-primary font-bold">{(t * 100).toFixed(0)}%</span>
                          </div>
                          
                          {/* Progress Line */}
                          <div className="relative w-full h-2 bg-background border border-border rounded-full overflow-hidden">
                            <div 
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-[#F4C542] transition-all duration-1000 ease-out"
                              style={{ width: `${t * 100}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                            <span className="truncate max-w-[120px]">{origin.split(',')[0]}</span>
                            <span>{status.toLowerCase().includes("delivered") ? "Arrived" : "In Transit"}</span>
                            <span className="truncate max-w-[120px] text-right">{destination.split(',')[0]}</span>
                          </div>
                        </div>

                        <div className="h-px bg-border" />

                         <div>
                           <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider mb-1">Last Update Status</span>
                           <span className="text-xs font-semibold text-foreground leading-relaxed block">{shipment.lastUpdate}</span>
                         </div>

                         <div className="h-px bg-border" />

                         <div className="bg-background/40 border border-border/50 rounded-xl p-4 flex items-center justify-between">
                           <div>
                             <span className="text-[10px] font-bold text-muted-foreground block uppercase tracking-wider mb-0.5">Setup & Lane Fees</span>
                             <span className="text-sm font-semibold text-foreground">{shipment.pendingFees || "Pending 460$"}</span>
                           </div>
                           <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                             (shipment.pendingFees || "Pending").toLowerCase().includes("paid") 
                               ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" 
                               : "text-amber-400 bg-amber-400/10 border-amber-400/20 animate-pulse"
                           }`}>
                             {(shipment.pendingFees || "Pending").toLowerCase().includes("paid") ? "Paid" : "Pending Action"}
                           </span>
                         </div>
                      </CardContent>
                    </Card>

                    {/* Chronological Checkpoint Timeline */}
                    <Card className="shadow-lg border-border bg-card">
                      <CardContent className="p-6 md:p-8 space-y-6">
                        <h4 className="font-semibold uppercase tracking-wider text-muted-foreground text-xs flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" /> Shipment Checkpoints
                        </h4>

                        <div className="relative pl-6 space-y-8 before:absolute before:inset-y-1.5 before:left-[11px] before:w-0.5 before:bg-border">
                          {checkpoints.map((cp) => {
                            const isCurrent = (cp.id === 3 && t >= 0.20 && t < 0.90) || 
                                              (cp.id === 4 && t >= 0.90 && t < 1.0) || 
                                              (cp.id === 5 && t >= 1.0) ||
                                              (cp.id === 2 && t >= 0.20 && t < 0.65 && cp.id === 2);
                            
                            return (
                              <div key={cp.id} className="relative group">
                                {/* Connector Dot */}
                                <div className={`absolute -left-[23px] top-1.5 w-[18px] h-[18px] rounded-full border bg-background flex items-center justify-center transition-all ${
                                  cp.isCompleted 
                                    ? "border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)] text-emerald-400" 
                                    : isCurrent 
                                      ? "border-primary shadow-[0_0_8px_rgba(212,175,55,0.4)] text-primary"
                                      : "border-border text-muted-foreground"
                                }`}>
                                  {cp.isCompleted ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-400/10 stroke-[2.5]" />
                                  ) : isCurrent ? (
                                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                                  )}
                                </div>

                                <div className="space-y-1">
                                  <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-0.5">
                                    <span className={`text-sm font-bold tracking-tight ${
                                      cp.isCompleted ? "text-foreground" : isCurrent ? "text-primary" : "text-muted-foreground"
                                    }`}>
                                      {cp.title}
                                    </span>
                                    <span className="text-[10px] font-semibold text-muted-foreground font-mono">
                                      {formatDate(cp.time)}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground font-medium">{cp.location}</div>
                                  <p className="text-[11px] text-[#CBD5E1] leading-normal">{cp.description}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </Layout>
  )
}