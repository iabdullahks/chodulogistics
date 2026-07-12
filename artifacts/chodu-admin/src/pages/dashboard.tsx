import { AdminLayout } from "@/components/admin-layout";
import { useAdminListShipments, useAdminListLeads } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Inbox, Activity, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: shipments } = useAdminListShipments();
  const { data: leads } = useAdminListLeads();

  // Shipments calculations
  const totalShipments = shipments?.length || 0;
  const inTransitCount = shipments?.filter(s => s.status.toLowerCase() === 'in transit').length || 0;
  const deliveredCount = shipments?.filter(s => s.status.toLowerCase() === 'delivered').length || 0;
  const pendingCount = shipments?.filter(s => s.status.toLowerCase() === 'pending pickup').length || 0;
  const exceptionCount = shipments?.filter(s => s.status.toLowerCase() === 'exception').length || 0;

  // Leads calculations
  const totalLeads = leads?.length || 0;
  const newLeadsCount = leads?.filter(l => l.status.toLowerCase() === 'new').length || 0;
  const contactedLeadsCount = leads?.filter(l => l.status.toLowerCase() === 'contacted').length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">System telemetry and active metrics.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground font-mono uppercase">Total Shipments</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                <Truck className="h-4 w-4 text-[#D4AF37]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalShipments}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-[#D4AF37] font-medium">{inTransitCount}</span> active in transit
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground font-mono uppercase">Shipment Alerts</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{exceptionCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Requiring immediate attention
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground font-mono uppercase">Total Leads</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                <Inbox className="h-4 w-4 text-[#D4AF37]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalLeads}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all service requests
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground font-mono uppercase">New Leads</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{newLeadsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Unread or uncontacted
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Shipments */}
          <Card className="col-span-1 bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Shipments</CardTitle>
                <p className="text-sm text-muted-foreground">Latest active tracking numbers.</p>
              </div>
              <Link href="/shipments" className="text-xs font-mono uppercase text-[#D4AF37] hover:underline">View All</Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipments?.slice(0, 5).map(shipment => (
                  <div key={shipment.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-black/20 hover:border-[#D4AF37]/30 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-mono font-medium">{shipment.trackingNumber}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">{shipment.origin} → {shipment.destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider font-mono bg-black/40 px-2 py-1 rounded">
                        {shipment.status}
                      </span>
                    </div>
                  </div>
                ))}
                {(!shipments || shipments.length === 0) && (
                  <div className="text-center p-4 text-muted-foreground text-sm">No shipments found.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card className="col-span-1 bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Leads</CardTitle>
                <p className="text-sm text-muted-foreground">Latest contact & quote requests.</p>
              </div>
              <Link href="/leads" className="text-xs font-mono uppercase text-[#D4AF37] hover:underline">View All</Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads?.slice(0, 5).map(lead => (
                  <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-black/20 hover:border-[#D4AF37]/30 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-medium">{lead.fullName}</span>
                      <span className="text-xs text-muted-foreground">{lead.subject || 'Contact Request'}</span>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider font-mono bg-black/40 px-2 py-1 rounded">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
                {(!leads || leads.length === 0) && (
                  <div className="text-center p-4 text-muted-foreground text-sm">No leads found.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
