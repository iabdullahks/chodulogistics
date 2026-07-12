import { AdminLayout } from "@/components/admin-layout";
import {
  useAdminListShipments,
  useAdminCreateShipment,
  useAdminUpdateShipment,
  useAdminDeleteShipment,
  getAdminListShipmentsQueryKey
} from "@workspace/api-client-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Shipment } from "@workspace/api-client-react";

const shipmentSchema = z.object({
  trackingNumber: z.string().min(1, "Required"),
  status: z.string().min(1, "Required"),
  origin: z.string().min(1, "Required"),
  destination: z.string().min(1, "Required"),
  carrierName: z.string().min(1, "Required"),
  estimatedDelivery: z.string(),
  lastUpdate: z.string().min(1, "Required"),
});

type ShipmentFormValues = z.infer<typeof shipmentSchema>;

export default function AdminShipments() {
  const { data: shipments, isLoading } = useAdminListShipments();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useAdminCreateShipment();
  const updateMutation = useAdminUpdateShipment();
  const deleteMutation = useAdminDeleteShipment();

  const filteredShipments = shipments?.filter(s =>
    s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.origin.toLowerCase().includes(search.toLowerCase()) ||
    s.destination.toLowerCase().includes(search.toLowerCase())
  );

  const createForm = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      trackingNumber: "",
      status: "Pending Pickup",
      origin: "",
      destination: "",
      carrierName: "",
      estimatedDelivery: "",
      lastUpdate: "Shipment created",
    }
  });

  const editForm = useForm<ShipmentFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      trackingNumber: "",
      status: "",
      origin: "",
      destination: "",
      carrierName: "",
      estimatedDelivery: "",
      lastUpdate: "",
    }
  });

  const onCreateSubmit = (values: ShipmentFormValues) => {
    createMutation.mutate({ data: values }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListShipmentsQueryKey() });
        setIsCreateOpen(false);
        createForm.reset();
        toast({ title: "Shipment created successfully" });
      },
      onError: () => toast({ title: "Failed to create shipment", variant: "destructive" })
    });
  };

  const onEditSubmit = (values: ShipmentFormValues) => {
    if (!editingShipment) return;
    updateMutation.mutate({ id: editingShipment.id, data: values }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListShipmentsQueryKey() });
        setEditingShipment(null);
        toast({ title: "Shipment updated successfully" });
      },
      onError: () => toast({ title: "Failed to update shipment", variant: "destructive" })
    });
  };

  const onDelete = (id: number) => {
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListShipmentsQueryKey() });
        toast({ title: "Shipment deleted successfully" });
      },
      onError: () => toast({ title: "Failed to delete shipment", variant: "destructive" })
    });
  };

  const openEdit = (shipment: Shipment) => {
    editForm.reset({
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      origin: shipment.origin,
      destination: shipment.destination,
      carrierName: shipment.carrierName,
      estimatedDelivery: shipment.estimatedDelivery,
      lastUpdate: shipment.lastUpdate,
    });
    setEditingShipment(shipment);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
            <p className="text-muted-foreground">Manage active freight and tracking status.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#D4AF37] hover:bg-[#F4C542] text-[#0B1220] font-bold rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                New Shipment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-card border-border">
              <DialogHeader>
                <DialogTitle>Create New Shipment</DialogTitle>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={createForm.control} name="trackingNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracking Number</FormLabel>
                        <FormControl><Input {...field} className="bg-background/50 font-mono" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={createForm.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pending Pickup">Pending Pickup</SelectItem>
                            <SelectItem value="In Transit">In Transit</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                            <SelectItem value="Exception">Exception</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={createForm.control} name="origin" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin</FormLabel>
                        <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={createForm.control} name="destination" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={createForm.control} name="carrierName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carrier</FormLabel>
                        <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={createForm.control} name="estimatedDelivery" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Est. Delivery</FormLabel>
                        <FormControl><Input {...field} className="bg-background/50" placeholder="e.g. YYYY-MM-DD" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={createForm.control} name="lastUpdate" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Update Text</FormLabel>
                      <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <DialogFooter>
                    <Button type="submit" className="bg-[#D4AF37] text-black w-full sm:w-auto" disabled={createMutation.isPending}>
                      {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Create Shipment
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center space-x-2 bg-card border border-border rounded-xl p-2 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground ml-2" />
          <Input
            placeholder="Search tracking, origin, destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
          />
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-mono text-xs uppercase">Tracking #</TableHead>
                <TableHead className="font-mono text-xs uppercase">Status</TableHead>
                <TableHead className="font-mono text-xs uppercase">Route</TableHead>
                <TableHead className="font-mono text-xs uppercase">Carrier</TableHead>
                <TableHead className="font-mono text-xs uppercase">Est. Delivery</TableHead>
                <TableHead className="font-mono text-xs uppercase text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#D4AF37]" />
                  </TableCell>
                </TableRow>
              ) : filteredShipments?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No shipments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments?.map((shipment) => (
                  <TableRow key={shipment.id} className="border-border/50 hover:bg-white/5 transition-colors group">
                    <TableCell className="font-mono font-medium">{shipment.trackingNumber}</TableCell>
                    <TableCell>
                      <span className="text-xs uppercase tracking-wider font-mono bg-black/40 px-2 py-1 rounded border border-border/50">
                        {shipment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{shipment.origin}</span>
                        <span className="text-xs text-muted-foreground">to {shipment.destination}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{shipment.carrierName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{shipment.estimatedDelivery || "TBD"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-[#D4AF37]" onClick={() => openEdit(shipment)}>
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
                              <AlertDialogTitle>Delete Shipment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete shipment {shipment.trackingNumber}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-transparent border-border">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(shipment.id)}
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

      <Dialog open={!!editingShipment} onOpenChange={(open) => !open && setEditingShipment(null)}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Shipment {editingShipment?.trackingNumber}</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={editForm.control} name="trackingNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tracking Number</FormLabel>
                    <FormControl><Input {...field} className="bg-background/50 font-mono" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editForm.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pending Pickup">Pending Pickup</SelectItem>
                        <SelectItem value="In Transit">In Transit</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Exception">Exception</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editForm.control} name="origin" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editForm.control} name="destination" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editForm.control} name="carrierName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carrier</FormLabel>
                    <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editForm.control} name="estimatedDelivery" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Est. Delivery</FormLabel>
                    <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={editForm.control} name="lastUpdate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Update Text</FormLabel>
                  <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingShipment(null)}>Cancel</Button>
                <Button type="submit" className="bg-[#D4AF37] hover:bg-[#F4C542] text-black w-full sm:w-auto" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
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
