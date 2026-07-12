import { AdminLayout } from "@/components/admin-layout";
import {
  useAdminListLoads,
  useAdminCreateLoad,
  useAdminUpdateLoad,
  useAdminDeleteLoad,
  getAdminListLoadsQueryKey
} from "@workspace/api-client-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Pencil, Trash2, Loader2, Truck, FileText, Hash, Building2,
  Route, Package, DollarSign, Paperclip, Save, Upload, Check, ExternalLink
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpload } from "@workspace/object-storage-web";
import type { Load } from "@workspace/api-client-react";

const loadSchema = z.object({
  trackingId: z.string().min(1, "Required"),
  status: z.string().min(1, "Required"),
  carrierName: z.string().min(1, "Required"),
  dot: z.string().optional(),
  truck: z.string().optional(),
  slotFeeStatus: z.string().optional(),
  tripsPerWeek: z.string().optional(),
  outboundRoute: z.string().optional(),
  returnRoute: z.string().optional(),
  pickupAddress: z.string().optional(),
  deliveryAddress: z.string().optional(),
  milesPerSide: z.string().optional(),
  totalRoundTripMiles: z.string().optional(),
  commodity: z.string().optional(),
  outboundWeightLbs: z.string().optional(),
  backhaulWeightLbs: z.string().optional(),
  outboundRate: z.string().min(1, "Required"),
  startDate: z.string().min(1, "Required"),
  contractType: z.string().optional(),
  purpose: z.string().optional(),
  refundableStatus: z.string().optional(),
  appliesTowardContract: z.string().optional(),
});

type LoadFormValues = z.infer<typeof loadSchema>;

const STATUS_OPTIONS = ["Booked", "In Transit", "Delivered", "Cancelled"];

const EMPTY_FORM_VALUES: LoadFormValues = {
  trackingId: "",
  status: "Booked",
  carrierName: "",
  dot: "",
  truck: "",
  slotFeeStatus: "",
  tripsPerWeek: "",
  outboundRoute: "",
  returnRoute: "",
  pickupAddress: "",
  deliveryAddress: "",
  milesPerSide: "",
  totalRoundTripMiles: "",
  commodity: "",
  outboundWeightLbs: "",
  backhaulWeightLbs: "",
  outboundRate: "",
  startDate: "",
  contractType: "",
  purpose: "",
  refundableStatus: "",
  appliesTowardContract: "",
};

function numOrUndefined(value?: string): number | undefined {
  if (value === undefined || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

function toPayload(values: LoadFormValues, billOfLadingPath: string | null) {
  return {
    trackingId: values.trackingId,
    status: values.status,
    carrierName: values.carrierName,
    dot: values.dot || undefined,
    truck: values.truck || undefined,
    slotFeeStatus: values.slotFeeStatus || undefined,
    tripsPerWeek: numOrUndefined(values.tripsPerWeek),
    outboundRoute: values.outboundRoute || undefined,
    returnRoute: values.returnRoute || undefined,
    pickupAddress: values.pickupAddress || undefined,
    deliveryAddress: values.deliveryAddress || undefined,
    milesPerSide: numOrUndefined(values.milesPerSide),
    totalRoundTripMiles: numOrUndefined(values.totalRoundTripMiles),
    commodity: values.commodity || undefined,
    outboundWeightLbs: numOrUndefined(values.outboundWeightLbs),
    backhaulWeightLbs: numOrUndefined(values.backhaulWeightLbs),
    outboundRate: Number(values.outboundRate),
    startDate: values.startDate,
    contractType: values.contractType || undefined,
    purpose: values.purpose || undefined,
    refundableStatus: values.refundableStatus || undefined,
    appliesTowardContract:
      values.appliesTowardContract === "yes" ? true :
      values.appliesTowardContract === "no" ? false : undefined,
    billOfLadingPath: billOfLadingPath || undefined,
  };
}

function statusBadgeClasses(status: string) {
  switch (status) {
    case "Delivered":
      return "text-green-400 bg-green-400/10 border-green-400/20";
    case "In Transit":
      return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    case "Cancelled":
      return "text-red-400 bg-red-400/10 border-red-400/20";
    default:
      return "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20";
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function SectionHeader({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
      <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">{children}</span>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  );
}

function BillOfLadingField({
  billOfLadingPath,
  onUploaded,
}: {
  billOfLadingPath: string | null;
  onUploaded: (path: string) => void;
}) {
  const { toast } = useToast();
  const { uploadFile, isUploading } = useUpload({
    onSuccess: (res) => {
      onUploaded(res.objectPath);
      toast({ title: "Bill of lading uploaded" });
    },
    onError: () => toast({ title: "Failed to upload file", variant: "destructive" }),
  });

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Upload Bill of Lading (optional)
      </label>
      <label className="flex items-center gap-2 border border-dashed border-border rounded-lg px-4 py-3 text-sm text-muted-foreground cursor-pointer hover:border-[#D4AF37]/50 hover:text-foreground transition-colors bg-background/50">
        {isUploading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
        ) : billOfLadingPath ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        <span>
          {isUploading ? "Uploading..." : billOfLadingPath ? "File uploaded — click to replace" : "Click to upload PDF, DOC, JPG, or PNG"}
        </span>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          disabled={isUploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
            e.target.value = "";
          }}
        />
      </label>
      {billOfLadingPath && (
        <a
          href={`/api/storage${billOfLadingPath}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"
        >
          <ExternalLink className="w-3 h-3" /> View current attachment
        </a>
      )}
    </div>
  );
}

function LoadFormFields({ form }: { form: UseFormReturn<LoadFormValues> }) {
  return (
    <div className="space-y-5">
      <SectionHeader icon={Hash}>Basic Info</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="trackingId" render={({ field }) => (
          <FormItem>
            <FormLabel>Tracking ID</FormLabel>
            <FormControl><Input {...field} className="bg-background/50 font-mono" placeholder="Enter tracking ID" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem>
            <FormLabel>Load Status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <SectionHeader icon={Building2}>Carrier Details</SectionHeader>
      <div className="grid grid-cols-3 gap-4">
        <FormField control={form.control} name="carrierName" render={({ field }) => (
          <FormItem>
            <FormLabel>Carrier</FormLabel>
            <FormControl><Input {...field} className="bg-background/50" placeholder="Carrier name" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="dot" render={({ field }) => (
          <FormItem>
            <FormLabel>DOT</FormLabel>
            <FormControl><Input {...field} className="bg-background/50 font-mono" placeholder="DOT number" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="truck" render={({ field }) => (
          <FormItem>
            <FormLabel>Truck #</FormLabel>
            <FormControl><Input {...field} className="bg-background/50 font-mono" placeholder="Truck number" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="slotFeeStatus" render={({ field }) => (
          <FormItem>
            <FormLabel>Slot Fee Status</FormLabel>
            <FormControl><Input {...field} className="bg-background/50" placeholder="Slot fee status" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="tripsPerWeek" render={({ field }) => (
          <FormItem>
            <FormLabel>Total Trips in a Week</FormLabel>
            <FormControl><Input type="number" {...field} className="bg-background/50" placeholder="Number of trips" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <SectionHeader icon={Route}>Route Information</SectionHeader>
      <FormField control={form.control} name="outboundRoute" render={({ field }) => (
        <FormItem>
          <FormLabel>Outbound Route</FormLabel>
          <FormControl><Textarea {...field} className="bg-background/50 resize-none" placeholder="Enter outbound route details" /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="returnRoute" render={({ field }) => (
        <FormItem>
          <FormLabel>Return Route</FormLabel>
          <FormControl><Textarea {...field} className="bg-background/50 resize-none" placeholder="Enter return route details" /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="pickupAddress" render={({ field }) => (
        <FormItem>
          <FormLabel>Pickup Address</FormLabel>
          <FormControl><Textarea {...field} className="bg-background/50 resize-none" placeholder="Enter pickup address" /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="deliveryAddress" render={({ field }) => (
        <FormItem>
          <FormLabel>Delivery Address</FormLabel>
          <FormControl><Textarea {...field} className="bg-background/50 resize-none" placeholder="Enter delivery address" /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="milesPerSide" render={({ field }) => (
          <FormItem>
            <FormLabel>Each Side Miles</FormLabel>
            <FormControl><Input type="number" {...field} className="bg-background/50" placeholder="Miles per side" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="totalRoundTripMiles" render={({ field }) => (
          <FormItem>
            <FormLabel>Total Round Trip Miles</FormLabel>
            <FormControl><Input type="number" {...field} className="bg-background/50" placeholder="Total miles" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <SectionHeader icon={Package}>Commodity & Weights</SectionHeader>
      <div className="grid grid-cols-3 gap-4">
        <FormField control={form.control} name="commodity" render={({ field }) => (
          <FormItem>
            <FormLabel>Commodity</FormLabel>
            <FormControl><Input {...field} className="bg-background/50" placeholder="Type of commodity" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="outboundWeightLbs" render={({ field }) => (
          <FormItem>
            <FormLabel>Outbound Weight (lbs)</FormLabel>
            <FormControl><Input type="number" {...field} className="bg-background/50" placeholder="Weight in lbs" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="backhaulWeightLbs" render={({ field }) => (
          <FormItem>
            <FormLabel>Backhaul Weight (lbs)</FormLabel>
            <FormControl><Input type="number" {...field} className="bg-background/50" placeholder="Weight in lbs" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <SectionHeader icon={DollarSign}>Rate & Schedule</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="outboundRate" render={({ field }) => (
          <FormItem>
            <FormLabel>Total Amount Paid Per Round Trip</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field} className="bg-background/50" placeholder="Enter amount" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="startDate" render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date</FormLabel>
            <FormControl><Input type="date" {...field} className="bg-background/50" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <SectionHeader icon={FileText}>Contract Details</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="contractType" render={({ field }) => (
          <FormItem>
            <FormLabel>Contract Type</FormLabel>
            <FormControl><Input {...field} className="bg-background/50" placeholder="Contract type" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="purpose" render={({ field }) => (
          <FormItem>
            <FormLabel>Purpose</FormLabel>
            <FormControl><Input {...field} className="bg-background/50" placeholder="Purpose" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="refundableStatus" render={({ field }) => (
          <FormItem>
            <FormLabel>Refundable Status</FormLabel>
            <FormControl><Input {...field} className="bg-background/50" placeholder="Refundable status" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="appliesTowardContract" render={({ field }) => (
          <FormItem>
            <FormLabel>Applies Toward Contract</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Yes / No" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
      </div>
    </div>
  );
}

export default function AdminLoads() {
  const { data: loads, isLoading } = useAdminListLoads();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLoad, setEditingLoad] = useState<Load | null>(null);
  const [createBolPath, setCreateBolPath] = useState<string | null>(null);
  const [editBolPath, setEditBolPath] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useAdminCreateLoad();
  const updateMutation = useAdminUpdateLoad();
  const deleteMutation = useAdminDeleteLoad();

  const createForm = useForm<LoadFormValues>({
    resolver: zodResolver(loadSchema),
    defaultValues: EMPTY_FORM_VALUES,
  });

  const editForm = useForm<LoadFormValues>({
    resolver: zodResolver(loadSchema),
    defaultValues: EMPTY_FORM_VALUES,
  });

  const onCreateSubmit = (values: LoadFormValues) => {
    createMutation.mutate({ data: toPayload(values, createBolPath) }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListLoadsQueryKey() });
        setIsCreateOpen(false);
        createForm.reset(EMPTY_FORM_VALUES);
        setCreateBolPath(null);
        toast({ title: "Load created successfully" });
      },
      onError: (error: any) => {
        const message = error?.response?.status === 409 ? "That tracking ID is already in use" : "Failed to create load";
        toast({ title: message, variant: "destructive" });
      }
    });
  };

  const openEdit = (load: Load) => {
    editForm.reset({
      trackingId: load.trackingId,
      status: load.status,
      carrierName: load.carrierName,
      dot: load.dot ?? "",
      truck: load.truck ?? "",
      slotFeeStatus: load.slotFeeStatus ?? "",
      tripsPerWeek: load.tripsPerWeek != null ? String(load.tripsPerWeek) : "",
      outboundRoute: load.outboundRoute ?? "",
      returnRoute: load.returnRoute ?? "",
      pickupAddress: load.pickupAddress ?? "",
      deliveryAddress: load.deliveryAddress ?? "",
      milesPerSide: load.milesPerSide != null ? String(load.milesPerSide) : "",
      totalRoundTripMiles: load.totalRoundTripMiles != null ? String(load.totalRoundTripMiles) : "",
      commodity: load.commodity ?? "",
      outboundWeightLbs: load.outboundWeightLbs != null ? String(load.outboundWeightLbs) : "",
      backhaulWeightLbs: load.backhaulWeightLbs != null ? String(load.backhaulWeightLbs) : "",
      outboundRate: String(load.outboundRate),
      startDate: load.startDate.slice(0, 10),
      contractType: load.contractType ?? "",
      purpose: load.purpose ?? "",
      refundableStatus: load.refundableStatus ?? "",
      appliesTowardContract: load.appliesTowardContract === true ? "yes" : load.appliesTowardContract === false ? "no" : "",
    });
    setEditBolPath(load.billOfLadingPath ?? null);
    setEditingLoad(load);
  };

  const onEditSubmit = (values: LoadFormValues) => {
    if (!editingLoad) return;
    updateMutation.mutate({ id: editingLoad.id, data: toPayload(values, editBolPath) }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListLoadsQueryKey() });
        setEditingLoad(null);
        toast({ title: "Load updated successfully" });
      },
      onError: (error: any) => {
        const message = error?.response?.status === 409 ? "That tracking ID is already in use" : "Failed to update load";
        toast({ title: message, variant: "destructive" });
      }
    });
  };

  const onDelete = (id: number) => {
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListLoadsQueryKey() });
        toast({ title: "Load deleted successfully" });
      },
      onError: () => toast({ title: "Failed to delete load", variant: "destructive" })
    });
  };

  const totalLoads = loads?.length ?? 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#F4C542]/5 border border-[#D4AF37]/20 w-11 h-11 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <Truck className="w-5 h-5 text-[#D4AF37]" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">TARA LOGISTICS LLC</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Load Management Dashboard</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Dialog open={isCreateOpen} onOpenChange={(open) => {
              setIsCreateOpen(open);
              if (!open) {
                createForm.reset(EMPTY_FORM_VALUES);
                setCreateBolPath(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-[#D4AF37] hover:bg-[#F4C542] text-[#0B1220] font-bold rounded-xl flex-1 sm:flex-none">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Load
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[680px] max-h-[85vh] overflow-y-auto bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Add New Load</DialogTitle>
                </DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4 py-2">
                    <LoadFormFields form={createForm} />
                    <SectionHeader icon={Paperclip}>Attachment</SectionHeader>
                    <BillOfLadingField billOfLadingPath={createBolPath} onUploaded={setCreateBolPath} />
                    <DialogFooter>
                      <Button type="submit" className="bg-[#D4AF37] hover:bg-[#F4C542] text-black w-full sm:w-auto" disabled={createMutation.isPending}>
                        {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Load
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              className="rounded-xl border-border flex-1 sm:flex-none"
              onClick={() => toast({ title: "Rate confirmation documents are coming soon" })}
            >
              <FileText className="w-4 h-4 mr-2" />
              Rate Confirmation
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-black/30 border border-border/50 flex items-center justify-center">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Total Loads</span>
          </div>
          <div className="text-4xl font-bold tracking-tight">{totalLoads}</div>
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Hash className="w-3 h-3" /> All time
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold tracking-tight mb-3">All Loads</h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-mono text-xs uppercase">Tracking ID</TableHead>
                  <TableHead className="font-mono text-xs uppercase">Status</TableHead>
                  <TableHead className="font-mono text-xs uppercase">Carrier</TableHead>
                  <TableHead className="font-mono text-xs uppercase">DOT</TableHead>
                  <TableHead className="font-mono text-xs uppercase">Truck</TableHead>
                  <TableHead className="font-mono text-xs uppercase">Outbound Rate</TableHead>
                  <TableHead className="font-mono text-xs uppercase">Start Date</TableHead>
                  <TableHead className="font-mono text-xs uppercase text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#D4AF37]" />
                    </TableCell>
                  </TableRow>
                ) : loads?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No loads found.
                    </TableCell>
                  </TableRow>
                ) : (
                  loads?.map((load) => (
                    <TableRow key={load.id} className="border-border/50 hover:bg-white/5 transition-colors group">
                      <TableCell className="font-mono font-medium">#{load.trackingId}</TableCell>
                      <TableCell>
                        <span className={`text-xs uppercase tracking-wider font-mono px-2 py-1 rounded border inline-flex items-center gap-1.5 ${statusBadgeClasses(load.status)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {load.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{load.carrierName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">{load.dot || "--"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">{load.truck || "--"}</TableCell>
                      <TableCell className="text-sm font-bold">{formatCurrency(load.outboundRate)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{load.startDate.slice(0, 10)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-[#D4AF37]" onClick={() => openEdit(load)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Load</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete load #{load.trackingId}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent border-border">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(load.id)}
                                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={!!editingLoad} onOpenChange={(open) => !open && setEditingLoad(null)}>
        <DialogContent className="sm:max-w-[680px] max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Load #{editingLoad?.trackingId}</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-2">
              <LoadFormFields form={editForm} />
              <SectionHeader icon={Paperclip}>Attachment</SectionHeader>
              <BillOfLadingField billOfLadingPath={editBolPath} onUploaded={setEditBolPath} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingLoad(null)}>Cancel</Button>
                <Button type="submit" className="bg-[#D4AF37] hover:bg-[#F4C542] text-black w-full sm:w-auto" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
