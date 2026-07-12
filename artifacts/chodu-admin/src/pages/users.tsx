import { AdminLayout } from "@/components/admin-layout";
import {
  useAdminListUsers,
  useAdminListRoles,
  useAdminCreateUser,
  useAdminUpdateUser,
  useAdminDeleteUser,
  useAdminMe,
  getAdminListUsersQueryKey,
  getAdminMeQueryKey,
} from "@workspace/api-client-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Loader2, KeyRound, ShieldCheck } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { AdminUserDetail } from "@workspace/api-client-react";
import { format } from "date-fns";

const createSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "At least 8 characters"),
  roleId: z.coerce.number().min(1, "Select a role"),
});

const editSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional().or(z.literal("")),
  roleId: z.coerce.number().min(1, "Select a role"),
  isActive: z.boolean(),
});

type CreateFormValues = z.infer<typeof createSchema>;
type EditFormValues = z.infer<typeof editSchema>;

export default function AdminUsers() {
  const { data: users, isLoading } = useAdminListUsers();
  const { data: roles } = useAdminListRoles();
  const { data: me } = useAdminMe({ query: { queryKey: getAdminMeQueryKey() } });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserDetail | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useAdminCreateUser();
  const updateMutation = useAdminUpdateUser();
  const deleteMutation = useAdminDeleteUser();

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: "", email: "", password: "", roleId: undefined as unknown as number },
  });

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: "", email: "", password: "", roleId: 0, isActive: true },
  });

  const onCreateSubmit = (values: CreateFormValues) => {
    createMutation.mutate({ data: values }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey() });
        setIsCreateOpen(false);
        createForm.reset({ name: "", email: "", password: "", roleId: undefined as unknown as number });
        toast({ title: "Admin created successfully" });
      },
      onError: (error: any) => {
        const message = error?.response?.status === 409 ? "That email is already in use" : "Failed to create admin";
        toast({ title: message, variant: "destructive" });
      }
    });
  };

  const openEdit = (user: AdminUserDetail) => {
    editForm.reset({
      name: user.name,
      email: user.email,
      password: "",
      roleId: user.roleId,
      isActive: user.isActive,
    });
    setEditingUser(user);
  };

  const onEditSubmit = (values: EditFormValues) => {
    if (!editingUser) return;
    const data: Record<string, unknown> = {
      name: values.name,
      email: values.email,
      roleId: values.roleId,
      isActive: values.isActive,
    };
    if (values.password) data.password = values.password;

    updateMutation.mutate({ id: editingUser.id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey() });
        setEditingUser(null);
        toast({ title: "Admin updated successfully" });
      },
      onError: (error: any) => {
        const message = error?.response?.status === 409 ? "That email is already in use" : "Failed to update admin";
        toast({ title: message, variant: "destructive" });
      }
    });
  };

  const onDelete = (id: number) => {
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey() });
        toast({ title: "Admin deleted successfully" });
      },
      onError: () => toast({ title: "Failed to delete admin", variant: "destructive" })
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Users</h1>
            <p className="text-muted-foreground">Manage who can access this control room and what they can do.</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#D4AF37] hover:bg-[#F4C542] text-[#0B1220] font-bold rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                New Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-border">
              <DialogHeader>
                <DialogTitle>Create Admin User</DialogTitle>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4 py-4">
                  <FormField control={createForm.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={createForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" {...field} className="bg-background/50" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={createForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temporary Password</FormLabel>
                      <FormControl><Input type="text" {...field} className="bg-background/50 font-mono" /></FormControl>
                      <FormDescription>Share this with the new admin directly; there's no email invite flow yet.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={createForm.control} name="roleId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value ? String(field.value) : undefined}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles?.map((role) => (
                            <SelectItem key={role.id} value={String(role.id)}>{role.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <DialogFooter>
                    <Button type="submit" className="bg-[#D4AF37] text-black w-full sm:w-auto" disabled={createMutation.isPending}>
                      {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Create Admin
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-mono text-xs uppercase">Name</TableHead>
                <TableHead className="font-mono text-xs uppercase">Email</TableHead>
                <TableHead className="font-mono text-xs uppercase">Role</TableHead>
                <TableHead className="font-mono text-xs uppercase">Status</TableHead>
                <TableHead className="font-mono text-xs uppercase">Last Login</TableHead>
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
              ) : users?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No admin users found.
                  </TableCell>
                </TableRow>
              ) : (
                users?.map((user) => (
                  <TableRow key={user.id} className="border-border/50 hover:bg-white/5 transition-colors group">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.name}
                        {me?.id === user.id && (
                          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-mono border border-[#D4AF37]/30 rounded px-1.5 py-0.5">You</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <span className="text-xs uppercase tracking-wider font-mono bg-black/40 px-2 py-1 rounded border border-border/50 inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                        {user.roleName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs uppercase tracking-wider font-mono px-2 py-1 rounded border ${
                        user.isActive
                          ? "text-green-400 bg-green-400/10 border-green-400/20"
                          : "text-muted-foreground bg-white/5 border-border"
                      }`}>
                        {user.isActive ? "Active" : "Disabled"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLoginAt ? format(new Date(user.lastLoginAt), "MMM d, yyyy h:mm a") : "Never"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-[#D4AF37]" onClick={() => openEdit(user)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              disabled={me?.id === user.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Admin</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {user.name}'s access? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-transparent border-border">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onDelete(user.id)}
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

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit {editingUser?.name}</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
              <FormField control={editForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" {...field} className="bg-background/50" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><KeyRound className="w-3.5 h-3.5" /> Reset Password</FormLabel>
                  <FormControl><Input type="text" placeholder="Leave blank to keep current password" {...field} className="bg-background/50 font-mono" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="roleId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles?.map((role) => (
                        <SelectItem key={role.id} value={String(role.id)}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Account Active</FormLabel>
                    <FormDescription>Disabled admins cannot log in.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={me?.id === editingUser?.id}
                    />
                  </FormControl>
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
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
