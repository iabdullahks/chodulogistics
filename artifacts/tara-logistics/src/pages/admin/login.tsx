import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminLogin, useAdminMe, getAdminMeQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Truck, LockKeyhole, ArrowRight, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: admin, isLoading: isChecking } = useAdminMe({ 
    query: { retry: false, queryKey: getAdminMeQueryKey() } 
  });

  const login = useAdminLogin();

  useEffect(() => {
    if (admin) {
      setLocation("/admin");
    }
  }, [admin, setLocation]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate({ data: values }, {
      onSuccess: (data) => {
        queryClient.setQueryData(getAdminMeQueryKey(), data);
        setLocation("/admin");
      },
      onError: (error) => {
        toast({
          title: "Authentication Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  if (isChecking) return null;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[120px] rounded-full" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.03]" aria-hidden="true">
          <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="#D4AF37" strokeWidth="1" />
          <line x1="100%" y1="0%" x2="0%" y2="100%" stroke="#D4AF37" strokeWidth="1" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-8 border-b border-border/50 flex flex-col items-center justify-center bg-black/20 relative overflow-hidden">
            {/* abstract scanner line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent animate-[scan_3s_ease-in-out_infinite]" />
            
            <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#F4C542]/5 border border-[#D4AF37]/20 w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)] mb-6">
              <LockKeyhole className="w-7 h-7 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-center">
              SECURE <span className="text-[#D4AF37]">ACCESS</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 font-mono uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>

          <div className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="admin@chodulogistics.com" 
                          {...field} 
                          className="bg-background/50 border-border focus-visible:ring-[#D4AF37]/50 h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          className="bg-background/50 border-border focus-visible:ring-[#D4AF37]/50 h-11 font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-[#D4AF37] hover:bg-[#F4C542] text-[#0B1220] font-bold tracking-wide mt-2 rounded-xl transition-all"
                  disabled={login.isPending}
                >
                  {login.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      AUTHENTICATE <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="p-4 bg-black/40 border-t border-border text-center text-xs text-muted-foreground font-mono uppercase tracking-wider">
            All access is monitored and logged
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(180px); opacity: 0; }
        }
      `}} />
    </div>
  );
}
