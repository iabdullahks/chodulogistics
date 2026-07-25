import { AdminLayout } from "@/components/admin-layout";
import {
  useAdminListRateConfirmations,
  useAdminCreateRateConfirmation,
  useAdminUpdateRateConfirmation,
  useAdminDeleteRateConfirmation,
  getAdminListRateConfirmationsQueryKey,
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
  Plus, Pencil, Trash2, Loader2, FileText, Hash, Building2,
  Route, Package, DollarSign, Save, MessageSquare, Printer, RotateCcw, AlertCircle
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
import type { RateConfirmation } from "@workspace/api-client-react";
import { useLocation } from "wouter";

const DEFAULT_SPECIAL_INSTRUCTIONS = `***Driver must accept MacroPoint and track for the duration of this load. Any failure to do so will result in a minimum of a $250 fine, deducted from the settlement of this load. Any delivery date and time, other than what is listed on the Rate Agreement, will result in a minimum of a $200 fine, deducted from the settlement of the load. Repair receipts must accompany any breakdowns in transit or carrier will be fined $200 if delivery date and time on this Rate Agreement is not met. That fine will be deducted from the settlement of this shipment ...

***brokeragecompanyofamericaninc.com MUST BE NOTIFIED 3 HOURS PRIOR TO DELIVERY APPOINTMENT IF THE DRIVER WILL BE LATE. ANY LATE OR MISSED DELIVERIES MAY RESULT IN LONG DWELL TIMES AND/OR LAYOVER(S) UNTIL NEXT AVAILABLE APPOINTMENT IS SCHEDULED.`;

const DEFAULT_REMARKS = `Please submit ALL pages of the POD with a receiver signature within 72 hours of delivery. ***CARRIERS MUST REPORT DETENTION 1 HOUR PRIOR TO OCCURANCE AND MUST SUBMIT LUMPER RECEIPT WITHIN 24-48 HOURS OF DELIVERY IF THERE IS ONE. FAILURE TO DO SO WILL RESULT IN NON-PAYMENT OF CHARGES.***

Failure to notify Brokerage Co. of American INC within 1HR of occurrence results in time starting 1 HR from time of Email. Arrival and Departure times to be clearly written on BOL by shipper/receiver. Please Email to billing@brokeragecompanyofamericaninc.com within 24HRS for payment.`;

const rcSchema = z.object({
  proNumber: z.string().optional(),
  daysDedicatedLane: z.string().optional(),
  rcDateTime: z.string().min(1, "Required"),
  fromCompany: z.string().min(1, "Required"),
  fromPhone: z.string().optional(),
  fromEmail: z.string().optional(),
  carrierName: z.string().min(1, "Required"),
  carrierPhone: z.string().optional(),
  mcNumber: z.string().optional(),
  dotNumber: z.string().optional(),
  driverName: z.string().optional(),
  truckNumber: z.string().optional(),
  trailerNumber: z.string().optional(),
  driverCell: z.string().optional(),
  miles: z.string().optional(),
  sizeType: z.string().optional(),
  pieces: z.string().optional(),
  description: z.string().optional(),
  weightLbs: z.string().optional(),
  hotLoad: z.string().optional(),
  lineHaulRate: z.string().optional(),
  totalRateUsd: z.string().optional(),
  outboundPickupAddress: z.string().optional(),
  outboundDeliveryAddress: z.string().optional(),
  outboundHours: z.string().optional(),
  outboundPhoneContact: z.string().optional(),
  outboundAppointmentDate: z.string().optional(),
  outboundAppointmentTime: z.string().optional(),
  outboundPieces: z.string().optional(),
  outboundWeight: z.string().optional(),
  dispatchNotes: z.string().optional(),
  returnPickupAddress: z.string().optional(),
  returnDeliveryAddress: z.string().optional(),
  returnHours: z.string().optional(),
  returnPhoneContact: z.string().optional(),
  returnAppointmentDate: z.string().optional(),
  returnAppointmentTime: z.string().optional(),
  returnPieces: z.string().optional(),
  returnWeight: z.string().optional(),
  specialInstructions: z.string().optional(),
  remarks: z.string().optional(),
});

type RcFormValues = z.infer<typeof rcSchema>;

function nowLocalDateTime(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const EMPTY_FORM_VALUES: RcFormValues = {
  proNumber: "",
  daysDedicatedLane: "",
  rcDateTime: nowLocalDateTime(),
  fromCompany: "Brokerage Co. of American INC",
  fromPhone: "",
  fromEmail: "",
  carrierName: "",
  carrierPhone: "",
  mcNumber: "",
  dotNumber: "",
  driverName: "",
  truckNumber: "",
  trailerNumber: "",
  driverCell: "",
  miles: "",
  sizeType: "",
  pieces: "",
  description: "",
  weightLbs: "",
  hotLoad: "no",
  lineHaulRate: "",
  totalRateUsd: "",
  outboundPickupAddress: "",
  outboundDeliveryAddress: "",
  outboundHours: "",
  outboundPhoneContact: "",
  outboundAppointmentDate: "",
  outboundAppointmentTime: "",
  outboundPieces: "",
  outboundWeight: "",
  dispatchNotes: "",
  returnPickupAddress: "",
  returnDeliveryAddress: "",
  returnHours: "",
  returnPhoneContact: "",
  returnAppointmentDate: "",
  returnAppointmentTime: "",
  returnPieces: "",
  returnWeight: "",
  specialInstructions: DEFAULT_SPECIAL_INSTRUCTIONS,
  remarks: DEFAULT_REMARKS,
};

function numOrUndefined(value?: string): number | undefined {
  if (value === undefined || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}

function toPayload(values: RcFormValues) {
  return {
    proNumber: values.proNumber || undefined,
    daysDedicatedLane: values.daysDedicatedLane || undefined,
    rcDateTime: new Date(values.rcDateTime).toISOString(),
    fromCompany: values.fromCompany,
    fromPhone: values.fromPhone || undefined,
    fromEmail: values.fromEmail || undefined,
    carrierName: values.carrierName,
    carrierPhone: values.carrierPhone || undefined,
    mcNumber: values.mcNumber || undefined,
    dotNumber: values.dotNumber || undefined,
    driverName: values.driverName || undefined,
    truckNumber: values.truckNumber || undefined,
    trailerNumber: values.trailerNumber || undefined,
    driverCell: values.driverCell || undefined,
    miles: numOrUndefined(values.miles),
    sizeType: values.sizeType || undefined,
    pieces: numOrUndefined(values.pieces),
    description: values.description || undefined,
    weightLbs: numOrUndefined(values.weightLbs),
    hotLoad: values.hotLoad === "yes",
    lineHaulRate: numOrUndefined(values.lineHaulRate),
    totalRateUsd: numOrUndefined(values.totalRateUsd),
    outboundPickupAddress: values.outboundPickupAddress || undefined,
    outboundDeliveryAddress: values.outboundDeliveryAddress || undefined,
    outboundHours: values.outboundHours || undefined,
    outboundPhoneContact: values.outboundPhoneContact || undefined,
    outboundAppointmentDate: values.outboundAppointmentDate || undefined,
    outboundAppointmentTime: values.outboundAppointmentTime || undefined,
    outboundPieces: numOrUndefined(values.outboundPieces),
    outboundWeight: numOrUndefined(values.outboundWeight),
    dispatchNotes: values.dispatchNotes || undefined,
    returnPickupAddress: values.returnPickupAddress || undefined,
    returnDeliveryAddress: values.returnDeliveryAddress || undefined,
    returnHours: values.returnHours || undefined,
    returnPhoneContact: values.returnPhoneContact || undefined,
    returnAppointmentDate: values.returnAppointmentDate || undefined,
    returnAppointmentTime: values.returnAppointmentTime || undefined,
    returnPieces: numOrUndefined(values.returnPieces),
    returnWeight: numOrUndefined(values.returnWeight),
    specialInstructions: values.specialInstructions || undefined,
    remarks: values.remarks || undefined,
  };
}

function fromRateConfirmation(rc: RateConfirmation): RcFormValues {
  return {
    proNumber: rc.proNumber ?? "",
    daysDedicatedLane: rc.daysDedicatedLane ?? "",
    rcDateTime: rc.rcDateTime.slice(0, 16),
    fromCompany: rc.fromCompany,
    fromPhone: rc.fromPhone ?? "",
    fromEmail: rc.fromEmail ?? "",
    carrierName: rc.carrierName,
    carrierPhone: rc.carrierPhone ?? "",
    mcNumber: rc.mcNumber ?? "",
    dotNumber: rc.dotNumber ?? "",
    driverName: rc.driverName ?? "",
    truckNumber: rc.truckNumber ?? "",
    trailerNumber: rc.trailerNumber ?? "",
    driverCell: rc.driverCell ?? "",
    miles: rc.miles != null ? String(rc.miles) : "",
    sizeType: rc.sizeType ?? "",
    pieces: rc.pieces != null ? String(rc.pieces) : "",
    description: rc.description ?? "",
    weightLbs: rc.weightLbs != null ? String(rc.weightLbs) : "",
    hotLoad: rc.hotLoad ? "yes" : "no",
    lineHaulRate: rc.lineHaulRate != null ? String(rc.lineHaulRate) : "",
    totalRateUsd: rc.totalRateUsd != null ? String(rc.totalRateUsd) : "",
    outboundPickupAddress: rc.outboundPickupAddress ?? "",
    outboundDeliveryAddress: rc.outboundDeliveryAddress ?? "",
    outboundHours: rc.outboundHours ?? "",
    outboundPhoneContact: rc.outboundPhoneContact ?? "",
    outboundAppointmentDate: rc.outboundAppointmentDate ?? "",
    outboundAppointmentTime: rc.outboundAppointmentTime ?? "",
    outboundPieces: rc.outboundPieces != null ? String(rc.outboundPieces) : "",
    outboundWeight: rc.outboundWeight != null ? String(rc.outboundWeight) : "",
    dispatchNotes: rc.dispatchNotes ?? "",
    returnPickupAddress: rc.returnPickupAddress ?? "",
    returnDeliveryAddress: rc.returnDeliveryAddress ?? "",
    returnHours: rc.returnHours ?? "",
    returnPhoneContact: rc.returnPhoneContact ?? "",
    returnAppointmentDate: rc.returnAppointmentDate ?? "",
    returnAppointmentTime: rc.returnAppointmentTime ?? "",
    returnPieces: rc.returnPieces != null ? String(rc.returnPieces) : "",
    returnWeight: rc.returnWeight != null ? String(rc.returnWeight) : "",
    specialInstructions: rc.specialInstructions ?? "",
    remarks: rc.remarks ?? "",
  };
}

function formatCurrency(value: number | null) {
  if (value == null) return "--";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function SectionHeader({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-6 first:pt-0">
      <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
      <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">{children}</span>
      <div className="flex-1 h-px bg-white/15" />
    </div>
  );
}

const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";

function RateConfirmationFormFields({ form }: { form: UseFormReturn<RcFormValues> }) {
  return (
    <div className="space-y-6">
      <SectionHeader icon={Hash}>Header Information</SectionHeader>
      <div className="grid grid-cols-3 gap-4">
        <FormField control={form.control} name="daysDedicatedLane" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Days of Lanes</FormLabel>
            <FormControl><Input {...field} placeholder="e.g. Mon, Wed, Fri" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="proNumber" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>PRO #</FormLabel>
            <FormControl><Input {...field} className="font-mono" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="rcDateTime" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Date & Time (EST)</FormLabel>
            <FormControl><Input type="datetime-local" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FormField control={form.control} name="fromCompany" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>From</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="fromPhone" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Phone</FormLabel>
            <FormControl><Input {...field} placeholder="(254) 6765-654" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="fromEmail" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Email</FormLabel>
            <FormControl><Input {...field} placeholder="email@brokeragecompanyofamericaninc.com" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <SectionHeader icon={Building2}>Carrier Information</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="carrierName" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Carrier Name</FormLabel>
            <FormControl><Input {...field} placeholder="Carrier name" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="carrierPhone" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Phone</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="mcNumber" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>MC #</FormLabel>
            <FormControl><Input {...field} className="font-mono" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="dotNumber" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>DOT #</FormLabel>
            <FormControl><Input {...field} className="font-mono" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="driverName" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Driver Name</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="driverCell" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Driver Cell #</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="truckNumber" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Truck #</FormLabel>
            <FormControl><Input {...field} className="font-mono" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="trailerNumber" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Trailer #</FormLabel>
            <FormControl><Input {...field} className="font-mono" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <SectionHeader icon={Package}>Load Details</SectionHeader>
      <div className="grid grid-cols-3 gap-4">
        <FormField control={form.control} name="miles" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Miles</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="sizeType" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Size & Type</FormLabel>
            <FormControl><Input {...field} placeholder="e.g. 53 VAN" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="pieces" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Pieces</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Description</FormLabel>
            <FormControl><Input {...field} placeholder="Freight" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="weightLbs" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Weight (lbs)</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="hotLoad" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Hot Load</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
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

      <SectionHeader icon={DollarSign}>Rate Information</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="lineHaulRate" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Line Haul Rate ($)</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="totalRateUsd" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Total Rate USD ($)</FormLabel>
            <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <SectionHeader icon={Route}>Outbound Route</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="outboundPickupAddress" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Pickup Address</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="outboundDeliveryAddress" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Delivery Address</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="outboundHours" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Hours</FormLabel>
            <FormControl><Input {...field} placeholder="0800-1100" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="outboundPhoneContact" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Phone / Contact</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FormField control={form.control} name="outboundAppointmentDate" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Appointment Date</FormLabel>
            <FormControl><Input type="date" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="outboundAppointmentTime" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Appointment Time</FormLabel>
            <FormControl><Input type="time" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="outboundPieces" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Pieces</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FormField control={form.control} name="outboundWeight" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Weight</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <FormField control={form.control} name="dispatchNotes" render={({ field }) => (
        <FormItem>
          <FormLabel className={labelClass}>Dispatch Notes</FormLabel>
          <FormControl><Textarea {...field} className="resize-none min-h-[100px]" /></FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <SectionHeader icon={RotateCcw}>Return Route</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="returnPickupAddress" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Pickup Address</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="returnDeliveryAddress" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Delivery Address</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField control={form.control} name="returnHours" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Hours</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="returnPhoneContact" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Phone / Contact</FormLabel>
            <FormControl><Input {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FormField control={form.control} name="returnAppointmentDate" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Appointment Date</FormLabel>
            <FormControl><Input type="date" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="returnAppointmentTime" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Appointment Time</FormLabel>
            <FormControl><Input type="time" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="returnPieces" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Pieces</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FormField control={form.control} name="returnWeight" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Weight</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>

      <SectionHeader icon={AlertCircle}>Special Instructions & Requirements</SectionHeader>
      <FormField control={form.control} name="specialInstructions" render={({ field }) => (
        <FormItem>
          <FormControl><Textarea {...field} className="resize-none min-h-[140px]" /></FormControl>
          <FormMessage />
        </FormItem>
      )} />

      <SectionHeader icon={MessageSquare}>Remarks</SectionHeader>
      <FormField control={form.control} name="remarks" render={({ field }) => (
        <FormItem>
          <FormControl><Textarea {...field} className="resize-none min-h-[120px]" /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
}

export default function AdminRateConfirmations() {
  const { data: rateConfirmations, isLoading } = useAdminListRateConfirmations();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRc, setEditingRc] = useState<RateConfirmation | null>(null);
  const [, setLocation] = useLocation();

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useAdminCreateRateConfirmation();
  const updateMutation = useAdminUpdateRateConfirmation();
  const deleteMutation = useAdminDeleteRateConfirmation();

  const createForm = useForm<RcFormValues>({
    resolver: zodResolver(rcSchema),
    defaultValues: EMPTY_FORM_VALUES,
  });

  const editForm = useForm<RcFormValues>({
    resolver: zodResolver(rcSchema),
    defaultValues: EMPTY_FORM_VALUES,
  });

  const onCreateSubmit = (values: RcFormValues) => {
    createMutation.mutate({ data: toPayload(values) }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListRateConfirmationsQueryKey() });
        setIsCreateOpen(false);
        createForm.reset({ ...EMPTY_FORM_VALUES, rcDateTime: nowLocalDateTime() });
        toast({ title: "Rate confirmation created successfully" });
      },
      onError: () => toast({ title: "Failed to create rate confirmation", variant: "destructive" }),
    });
  };

  const openEdit = (rc: RateConfirmation) => {
    editForm.reset(fromRateConfirmation(rc));
    setEditingRc(rc);
  };

  const onEditSubmit = (values: RcFormValues) => {
    if (!editingRc) return;
    updateMutation.mutate({ id: editingRc.id, data: toPayload(values) }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListRateConfirmationsQueryKey() });
        setEditingRc(null);
        toast({ title: "Rate confirmation updated successfully" });
      },
      onError: () => toast({ title: "Failed to update rate confirmation", variant: "destructive" }),
    });
  };

  const onDelete = (id: number) => {
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListRateConfirmationsQueryKey() });
        toast({ title: "Rate confirmation deleted successfully" });
      },
      onError: () => toast({ title: "Failed to delete rate confirmation", variant: "destructive" }),
    });
  };

  const total = rateConfirmations?.length ?? 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#F4C542]/5 border border-[#D4AF37]/20 w-11 h-11 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <FileText className="w-5 h-5 text-[#D4AF37]" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Brokerage Co. of American INC</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Rate Confirmation System</p>
            </div>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) createForm.reset({ ...EMPTY_FORM_VALUES, rcDateTime: nowLocalDateTime() });
          }}>
            <DialogTrigger asChild>
              <Button className="bg-[#D4AF37] hover:bg-[#F4C542] text-[#0B1220] font-bold rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                New Rate Confirmation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[960px] max-h-[85vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle>New Rate Confirmation</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">Complete all fields to generate a rate confirmation.</p>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4 py-2">
                  <RateConfirmationFormFields form={createForm} />
                  <DialogFooter>
                    <Button type="submit" className="bg-[#D4AF37] hover:bg-[#F4C542] text-black w-full sm:w-auto" disabled={createMutation.isPending}>
                      {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Rate Confirmation
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-black/30 border border-border/50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Total Rate Confirmations</span>
          </div>
          <div className="text-4xl font-bold tracking-tight">{total}</div>
        </div>

        <div>
          <h2 className="text-lg font-bold tracking-tight mb-3">All Rate Confirmations</h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="font-mono text-xs uppercase">PRO #</TableHead>
                  <TableHead className="font-mono text-xs uppercase">Carrier</TableHead>
                  <TableHead className="font-mono text-xs uppercase">Driver</TableHead>
                  <TableHead className="font-mono text-xs uppercase">Truck</TableHead>
                  <TableHead className="font-mono text-xs uppercase">Total Rate</TableHead>
                  <TableHead className="font-mono text-xs uppercase">Date</TableHead>
                  <TableHead className="font-mono text-xs uppercase text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#D4AF37]" />
                    </TableCell>
                  </TableRow>
                ) : rateConfirmations?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No rate confirmations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rateConfirmations?.map((rc) => (
                    <TableRow key={rc.id} className="border-border/50 hover:bg-white/5 transition-colors group">
                      <TableCell className="font-mono font-medium">{rc.proNumber || "--"}</TableCell>
                      <TableCell className="text-sm">{rc.carrierName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{rc.driverName || "--"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">{rc.truckNumber || "--"}</TableCell>
                      <TableCell className="text-sm font-bold">{formatCurrency(rc.totalRateUsd)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{rc.rcDateTime.slice(0, 10)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-[#D4AF37]" onClick={() => setLocation(`/rate-confirmations/${rc.id}/print`)}>
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-[#D4AF37]" onClick={() => openEdit(rc)}>
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
                                <AlertDialogTitle>Delete Rate Confirmation</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this rate confirmation? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent border-border">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(rc.id)}
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

      <Dialog open={!!editingRc} onOpenChange={(open) => !open && setEditingRc(null)}>
        <DialogContent className="sm:max-w-[960px] max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Rate Confirmation {editingRc?.proNumber ? `#${editingRc.proNumber}` : ""}</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-2">
              <RateConfirmationFormFields form={editForm} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingRc(null)}>Cancel</Button>
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
