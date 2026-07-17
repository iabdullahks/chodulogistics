import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import CarrierSetupAgreement from '@/pages/carrier-setup-agreement';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CarrierSetupAgreement />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
