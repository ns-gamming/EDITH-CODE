import { Switch, Route, Redirect, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LandingPage from "@/pages/landing";
import AuthPage from "@/pages/auth";
import DashboardPage from "@/pages/dashboard";
import IDEPage from "@/pages/ide";
import ProfilePage from "@/pages/profile";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import TermsPage from "@/pages/terms";
import DisclaimerPage from "@/pages/disclaimer";
import NotFound from "@/pages/not-found";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  if (!user) {
    return null;
  }

  return <Component />;
}

function PublicRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  if (user) {
    return null;
  }

  return <Component />;
}

function Router() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={() => <PublicRoute component={AuthPage} />} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={DashboardPage} />} />
      <Route path="/ide/:projectId?" component={() => <ProtectedRoute component={IDEPage} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={ProfilePage} />} />
      <Route path="/privacy" component={PrivacyPolicyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/disclaimer" component={DisclaimerPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}