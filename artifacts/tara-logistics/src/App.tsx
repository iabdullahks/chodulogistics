import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

// Public Pages
import Home from '@/pages/home';
import About from '@/pages/about';
import Contact from '@/pages/contact';
import Track from '@/pages/track';
import PaymentProcess from '@/pages/payment-process';
import ServicesOverview from '@/pages/services/index';
import RentedTrailerProgram from '@/pages/services/rented-trailer-program';
import TwicCardAssistance from '@/pages/services/twic-card-assistance';
import InsuranceAssistance from '@/pages/services/insurance-assistance';
import FactoringRegistration from '@/pages/services/factoring-registration';
import LiquorPermit from '@/pages/services/liquor-permit';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/track" component={Track} />
      <Route path="/payment-process" component={PaymentProcess} />
      
      <Route path="/services" component={ServicesOverview} />
      <Route path="/services/rented-trailer-program" component={RentedTrailerProgram} />
      <Route path="/services/twic-card-assistance" component={TwicCardAssistance} />
      <Route path="/services/insurance-assistance" component={InsuranceAssistance} />
      <Route path="/services/factoring-registration" component={FactoringRegistration} />
      <Route path="/services/liquor-permit" component={LiquorPermit} />

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
