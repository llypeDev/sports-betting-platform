import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EnhancedSidebar } from "@/components/EnhancedSidebar";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import AddBet from "@/pages/AddBet";
import BetHistory from "@/pages/BetHistory";
import Bankroll from "@/pages/Bankroll";
import Analytics from "@/pages/Analytics";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/add-bet" component={AddBet} />
          <Route path="/history" component={BetHistory} />
          <Route path="/bankroll" component={Bankroll} />
          <Route path="/analytics" component={Analytics} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Custom sidebar width for betting application
  const style = {
    "--sidebar-width": "18rem",       // 288px for enhanced navigation
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  if (!isLoading && isAuthenticated) {
    return (
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full bg-background">
          <EnhancedSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
              <SidebarTrigger 
                data-testid="button-sidebar-toggle" 
                className="hover:bg-accent/50 transition-colors rounded-lg p-2"
              />
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
              <Router />
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return <Router />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="bettracker-ui-theme">
        <TooltipProvider>
          <AuthenticatedApp />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
