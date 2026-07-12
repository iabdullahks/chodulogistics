import { Link, useLocation } from "wouter";
import { useAdminMe, useAdminLogout, getAdminMeQueryKey } from "@workspace/api-client-react";
import { useEffect, useState } from "react";
import { LayoutDashboard, Truck, Inbox, Users, LogOut, Loader2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: admin, isLoading, isError } = useAdminMe({
    query: { retry: false, queryKey: getAdminMeQueryKey() }
  });
  const logout = useAdminLogout();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isError) {
      setLocation("/login");
    }
  }, [isError, setLocation]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        setLocation("/login");
      }
    });
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mb-4" />
        <div className="text-sm text-muted-foreground font-mono uppercase tracking-widest">INITIALIZING SECURE SESSION</div>
      </div>
    );
  }

  if (!admin) return null;

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/shipments", label: "Shipments", icon: Truck },
    { href: "/leads", label: "Leads", icon: Inbox },
    { href: "/users", label: "Admin Users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#F4C542]/5 border border-[#D4AF37]/20 w-8 h-8 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Truck className="w-4 h-4 text-[#D4AF37]" strokeWidth={2} />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            OPS<span className="text-[#D4AF37]">Portal</span>
          </span>
        </div>
        <button className="p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#F4C542]/5 border border-[#D4AF37]/20 w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)]">
              <Truck className="w-5 h-5 text-[#D4AF37]" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-foreground leading-none">
                OPS<span className="text-[#D4AF37]">Portal</span>
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Control Room</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
              )}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-foreground truncate">{admin.name}</span>
              <span className="text-xs text-muted-foreground truncate">{admin.email}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-lg">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
