import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { SiGoogle, SiGithub, SiLinkedin, SiFacebook } from "react-icons/si";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
        toast({
          title: "Welcome to EDITH!",
          description: "Your account has been created successfully.",
        });
      } else {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background p-4">
      <div className={`container max-w-4xl mx-auto bg-card rounded-3xl shadow-2xl overflow-hidden relative transition-all duration-600 ${isSignUp ? 'active' : ''}`}>
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Sign In Form */}
          <div className={`form-container p-8 md:p-12 flex flex-col justify-center transition-all duration-600 ${isSignUp ? 'opacity-0 pointer-events-none md:translate-x-full' : 'opacity-100'}`}>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sign In
              </h1>
              <p className="text-muted-foreground">Welcome back to EDITH</p>
            </div>

            <div className="flex gap-3 mb-6">
              <button className="flex-1 p-3 border border-border rounded-xl hover-elevate active-elevate-2 transition-all" data-testid="button-google-signin">
                <SiGoogle className="w-5 h-5 mx-auto" />
              </button>
              <button className="flex-1 p-3 border border-border rounded-xl hover-elevate active-elevate-2 transition-all" data-testid="button-github-signin">
                <SiGithub className="w-5 h-5 mx-auto" />
              </button>
              <button className="flex-1 p-3 border border-border rounded-xl hover-elevate active-elevate-2 transition-all" data-testid="button-facebook-signin">
                <SiFacebook className="w-5 h-5 mx-auto" />
              </button>
              <button className="flex-1 p-3 border border-border rounded-xl hover-elevate active-elevate-2 transition-all" data-testid="button-linkedin-signin">
                <SiLinkedin className="w-5 h-5 mx-auto" />
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or use your email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-signin-email"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-signin-password"
                  className="mt-1"
                />
              </div>
              <a href="#" className="text-sm text-primary hover:underline block">Forgot your password?</a>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-testid="button-signin-submit"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </div>

          {/* Sign Up Form */}
          <div className={`form-container p-8 md:p-12 flex flex-col justify-center transition-all duration-600 md:absolute md:left-0 md:w-1/2 ${isSignUp ? 'opacity-100 md:translate-x-full z-10' : 'opacity-0 pointer-events-none'}`}>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-muted-foreground">Join EDITH today</p>
            </div>

            <div className="flex gap-3 mb-6">
              <button className="flex-1 p-3 border border-border rounded-xl hover-elevate active-elevate-2 transition-all" data-testid="button-google-signup">
                <SiGoogle className="w-5 h-5 mx-auto" />
              </button>
              <button className="flex-1 p-3 border border-border rounded-xl hover-elevate active-elevate-2 transition-all" data-testid="button-github-signup">
                <SiGithub className="w-5 h-5 mx-auto" />
              </button>
              <button className="flex-1 p-3 border border-border rounded-xl hover-elevate active-elevate-2 transition-all" data-testid="button-facebook-signup">
                <SiFacebook className="w-5 h-5 mx-auto" />
              </button>
              <button className="flex-1 p-3 border border-border rounded-xl hover-elevate active-elevate-2 transition-all" data-testid="button-linkedin-signup">
                <SiLinkedin className="w-5 h-5 mx-auto" />
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or register with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  data-testid="input-signup-name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-signup-email"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-signup-password"
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-testid="button-signup-submit"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </form>
          </div>

          {/* Toggle Panel */}
          <div className={`hidden md:flex toggle-panel absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-primary/90 to-accent/90 text-primary-foreground transition-all duration-600 ${isSignUp ? 'translate-x-[-100%] rounded-r-3xl' : 'rounded-l-3xl'}`}>
            <div className="flex flex-col items-center justify-center p-12 text-center">
              {!isSignUp ? (
                <>
                  <h1 className="text-4xl font-bold mb-4">Hello, Friend!</h1>
                  <p className="mb-8 text-primary-foreground/90">
                    Register with your details to start your AI coding journey
                  </p>
                  <Button
                    variant="outline"
                    className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    onClick={toggleMode}
                    data-testid="button-switch-to-signup"
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                  <p className="mb-8 text-primary-foreground/90">
                    Enter your credentials to access your projects
                  </p>
                  <Button
                    variant="outline"
                    className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    onClick={toggleMode}
                    data-testid="button-switch-to-signin"
                  >
                    Sign In
                  </Button>
                </>
              )}
              <div className="mt-12">
                <div className="text-2xl font-bold mb-2 gaming:glow-text">EDITH</div>
                <div className="text-xs opacity-70">Even Dead I Am The Hero</div>
              </div>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 p-6 text-center bg-card/50 backdrop-blur-sm">
            {!isSignUp ? (
              <p className="text-sm">
                Don't have an account?{" "}
                <button onClick={toggleMode} className="text-primary font-semibold hover:underline" data-testid="button-mobile-switch-to-signup">
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-sm">
                Already have an account?{" "}
                <button onClick={toggleMode} className="text-primary font-semibold hover:underline" data-testid="button-mobile-switch-to-signin">
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer Branding */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground opacity-70">
          Created by <span className="font-semibold text-foreground">NISHANT SARKAR</span>
        </div>
      </div>
    </div>
  );
}
