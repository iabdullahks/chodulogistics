import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import LiquorPermitServiceAgreement from '@/pages/liquor-permit-service-agreement';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LiquorPermitServiceAgreement />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
