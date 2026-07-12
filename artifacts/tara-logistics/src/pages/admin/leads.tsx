import { AdminLayout } from "@/components/admin/admin-layout";
import { 
  useAdminListLeads, 
  useAdminUpdateLead,
  getAdminListLeadsQueryKey
} from "@workspace/api-client-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Loader2, Mail, Phone, Building, ExternalLink, Calendar } from "lucide-react";
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription 
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Lead } from "@workspace/api-client-react";
import { format } from "date-fns";

export default function AdminLeads() {
  const { data: leads, isLoading } = useAdminListLeads();
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateMutation = useAdminUpdateLead();

  const [editStatus, setEditStatus] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  const filteredLeads = leads?.filter(l => 
    l.fullName.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.companyName && l.companyName.toLowerCase().includes(search.toLowerCase())) ||
    (l.subject && l.subject.toLowerCase().includes(search.toLowerCase()))
  );

  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status || "New");
    setEditNotes(lead.notes || "");
  };

  const handleSaveLead = () => {
    if (!selectedLead) return;
    updateMutation.mutate({ 
      id: selectedLead.id, 
      data: { status: editStatus, notes: editNotes } 
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListLeadsQueryKey() });
        toast({ title: "Lead updated successfully" });
        // Update local state to reflect changes without closing the panel
        setSelectedLead({ ...selectedLead, status: editStatus, notes: editNotes });
      },
      onError: () => toast({ title: "Failed to update lead", variant: "destructive" })
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "contacted": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "won": return "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20";
      case "lost": return "text-muted-foreground bg-white/5 border-border";
      default: return "text-foreground bg-white/5 border-border";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leads & Inquiries</h1>
            <p className="text-muted-foreground">Manage quote requests and contact form submissions.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-card border border-border rounded-xl p-2 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground ml-2" />
          <Input 
            placeholder="Search name, email, company..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
          />
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-mono text-xs uppercase">Date</TableHead>
                <TableHead className="font-mono text-xs uppercase">Contact</TableHead>
                <TableHead className="font-mono text-xs uppercase">Subject</TableHead>
                <TableHead className="font-mono text-xs uppercase">Service</TableHead>
                <TableHead className="font-mono text-xs uppercase">Status</TableHead>
                <TableHead className="font-mono text-xs uppercase text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#D4AF37]" />
                  </TableCell>
                </TableRow>
              ) : filteredLeads?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No leads found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads?.map((lead) => (
                  <TableRow key={lead.id} className="border-border/50 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => openLeadDetails(lead)}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(lead.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{lead.fullName}</span>
                        <span className="text-xs text-muted-foreground">{lead.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">
                      {lead.subject || "Contact Request"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                      {lead.serviceInterested || "-"}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs uppercase tracking-wider font-mono px-2 py-1 rounded border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                        View <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent className="bg-card border-l-border sm:max-w-[600px] w-full overflow-y-auto p-0 flex flex-col">
          {selectedLead && (
            <>
              <div className="p-6 border-b border-border bg-black/20">
                <SheetHeader className="text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs uppercase tracking-wider font-mono px-2 py-1 rounded border ${getStatusColor(selectedLead.status)}`}>
                      {selectedLead.status}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(selectedLead.createdAt), "MMM d, yyyy h:mm a")}
                    </span>
                  </div>
                  <SheetTitle className="text-2xl">{selectedLead.subject || "Contact Request"}</SheetTitle>
                  <SheetDescription className="text-base text-foreground mt-2">
                    {selectedLead.serviceInterested && (
                      <span className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-sm font-medium mb-4">
                        Interested in: {selectedLead.serviceInterested}
                      </span>
                    )}
                  </SheetDescription>
                </SheetHeader>
              </div>

              <div className="p-6 flex-1 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-background/50 p-4 rounded-xl border border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                      <span className="font-bold text-xs">{selectedLead.fullName.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">Name</div>
                      <div className="font-medium text-sm">{selectedLead.fullName}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">Email</div>
                      <a href={`mailto:${selectedLead.email}`} className="font-medium text-sm text-[#D4AF37] hover:underline">{selectedLead.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">Phone</div>
                      <a href={`tel:${selectedLead.phone}`} className="font-medium text-sm text-[#D4AF37] hover:underline">{selectedLead.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-1">Company</div>
                      <div className="font-medium text-sm">{selectedLead.companyName || "N/A"}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3 border-b border-border pb-2">Message</h4>
                  <div className="bg-background/50 border border-border/50 rounded-xl p-4 text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedLead.message}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Lead Management</h4>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Update Status</label>
                      <Select value={editStatus} onValueChange={setEditStatus}>
                        <SelectTrigger className="bg-background/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Contacted">Contacted</SelectItem>
                          <SelectItem value="Won">Won</SelectItem>
                          <SelectItem value="Lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Internal Notes</label>
                      <Textarea 
                        placeholder="Add notes about this lead..."
                        className="min-h-[100px] bg-background/50 border-border resize-none"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                      />
                    </div>

                    <Button 
                      onClick={handleSaveLead} 
                      className="w-full bg-[#D4AF37] hover:bg-[#F4C542] text-black font-bold"
                      disabled={updateMutation.isPending || (editStatus === selectedLead.status && editNotes === (selectedLead.notes || ""))}
                    >
                      {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Save Updates
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
