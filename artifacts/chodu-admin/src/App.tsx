import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import AdminLogin from '@/pages/login';
import AdminDashboard from '@/pages/dashboard';
import AdminShipments from '@/pages/shipments';
import AdminLeads from '@/pages/leads';
import AdminUsers from '@/pages/users';
import AdminLoads from '@/pages/loads';
import AdminRateConfirmations from '@/pages/rate-confirmations';
import RateConfirmationPrint from '@/pages/rate-confirmation-print';
import AdminTodos from '@/pages/todos';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/login" component={AdminLogin} />
      <Route path="/" component={AdminDashboard} />
      <Route path="/shipments" component={AdminShipments} />
      <Route path="/leads" component={AdminLeads} />
      <Route path="/users" component={AdminUsers} />
      <Route path="/loads" component={AdminLoads} />
      <Route path="/rate-confirmations" component={AdminRateConfirmations} />
      <Route path="/rate-confirmations/:id/print" component={RateConfirmationPrint} />
      <Route path="/todos" component={AdminTodos} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
