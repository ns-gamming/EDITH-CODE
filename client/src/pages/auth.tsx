
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { SiGoogle, SiGithub, SiFacebook, SiLinkedin } from "react-icons/si";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  
  // Sign In fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Sign Up - Step 1: Basic Info
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  
  // Sign Up - Step 2: Professional Info
  const [occupation, setOccupation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  
  // Sign Up - Step 3: Personal Details
  const [bio, setBio] = useState("");
  const [goals, setGoals] = useState("");
  const [skills, setSkills] = useState("");
  const [timezone, setTimezone] = useState("");
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in to EDITH.",
      });
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupStep < 3) {
      // Validate current step
      if (signupStep === 1) {
        if (!signupEmail || !signupPassword || !fullName || !username) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
          return;
        }
        if (signupPassword !== confirmPassword) {
          toast({
            title: "Password Mismatch",
            description: "Passwords do not match.",
            variant: "destructive",
          });
          return;
        }
        if (signupPassword.length < 6) {
          toast({
            title: "Weak Password",
            description: "Password must be at least 6 characters.",
            variant: "destructive",
          });
          return;
        }
      }
      setSignupStep(signupStep + 1);
      return;
    }

    // Final submission
    setLoading(true);
    try {
      await signUp({
        email: signupEmail,
        password: signupPassword,
        fullName,
        username,
        bio,
        occupation,
        experienceLevel,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        goals,
        preferredLanguage,
        timezone,
      });
      toast({
        title: "Welcome to EDITH!",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Sign up failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'facebook' | 'azure') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "OAuth sign-in failed",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setSignupStep(1);
    setEmail("");
    setPassword("");
    setSignupEmail("");
    setSignupPassword("");
    setConfirmPassword("");
    setFullName("");
    setUsername("");
    setOccupation("");
    setExperienceLevel("");
    setBio("");
    setGoals("");
    setSkills("");
    setPreferredLanguage("");
    setTimezone("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className={`container max-w-5xl mx-auto bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden relative transition-all duration-700 ${isSignUp ? 'active' : ''}`}>
        <div className="grid md:grid-cols-2 min-h-[700px]">
          {/* Sign In Form */}
          <div className={`form-container p-8 md:p-12 flex flex-col justify-center transition-all duration-700 ${isSignUp ? 'opacity-0 pointer-events-none md:translate-x-full' : 'opacity-100'}`}>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Sign In
                </h1>
              </div>
              <p className="text-muted-foreground">Welcome back to EDITH</p>
            </div>

            <div className="flex gap-3 mb-6">
              <button 
                onClick={() => handleOAuthSignIn('google')}
                disabled={loading}
                className="flex-1 p-3 border border-border rounded-xl hover:bg-primary/10 hover:scale-105 active:scale-95 transition-all duration-200" 
                data-testid="button-google-signin"
              >
                <SiGoogle className="w-5 h-5 mx-auto" />
              </button>
              <button 
                onClick={() => handleOAuthSignIn('github')}
                disabled={loading}
                className="flex-1 p-3 border border-border rounded-xl hover:bg-primary/10 hover:scale-105 active:scale-95 transition-all duration-200" 
                data-testid="button-github-signin"
              >
                <SiGithub className="w-5 h-5 mx-auto" />
              </button>
              <button 
                onClick={() => handleOAuthSignIn('facebook')}
                disabled={loading}
                className="flex-1 p-3 border border-border rounded-xl hover:bg-primary/10 hover:scale-105 active:scale-95 transition-all duration-200" 
                data-testid="button-facebook-signin"
              >
                <SiFacebook className="w-5 h-5 mx-auto" />
              </button>
              <button 
                onClick={() => handleOAuthSignIn('azure')}
                disabled={loading}
                className="flex-1 p-3 border border-border rounded-xl hover:bg-primary/10 hover:scale-105 active:scale-95 transition-all duration-200" 
                data-testid="button-linkedin-signin"
              >
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

            <form onSubmit={handleSignIn} className="space-y-4">
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

          {/* Sign Up Form - Multi-Step */}
          <div className={`form-container p-8 md:p-12 flex flex-col justify-center transition-all duration-700 md:absolute md:left-0 md:w-1/2 ${isSignUp ? 'opacity-100 md:translate-x-full z-10' : 'opacity-0 pointer-events-none'}`}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Join EDITH
                  </h1>
                </div>
                <div className="text-sm text-muted-foreground">Step {signupStep}/3</div>
              </div>
              <div className="flex gap-2 mt-3">
                <div className={`h-1 flex-1 rounded-full transition-all ${signupStep >= 1 ? 'bg-primary' : 'bg-muted'}`}></div>
                <div className={`h-1 flex-1 rounded-full transition-all ${signupStep >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
                <div className={`h-1 flex-1 rounded-full transition-all ${signupStep >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
              </div>
            </div>

            {signupStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                <h3 className="font-semibold text-lg mb-2">Basic Information</h3>
                <div>
                  <Label htmlFor="signup-fullname">Full Name *</Label>
                  <Input
                    id="signup-fullname"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    data-testid="input-signup-name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-username">Username *</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    data-testid="input-signup-username"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email *</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    data-testid="input-signup-email"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password *</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    data-testid="input-signup-password"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-confirm-password">Confirm Password *</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {signupStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                <h3 className="font-semibold text-lg mb-2">Professional Background</h3>
                <div>
                  <Label htmlFor="signup-occupation">Occupation</Label>
                  <Input
                    id="signup-occupation"
                    type="text"
                    placeholder="e.g., Software Developer, Student, Designer"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-experience">Experience Level</Label>
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - Just starting out</SelectItem>
                      <SelectItem value="intermediate">Intermediate - 1-3 years</SelectItem>
                      <SelectItem value="advanced">Advanced - 3-5 years</SelectItem>
                      <SelectItem value="expert">Expert - 5+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="signup-language">Preferred Programming Language</Label>
                  <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose your favorite language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript/TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="signup-skills">Skills (comma-separated)</Label>
                  <Input
                    id="signup-skills"
                    type="text"
                    placeholder="React, Node.js, Python, Machine Learning"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {signupStep === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                <h3 className="font-semibold text-lg mb-2">Tell Us About Yourself</h3>
                <div>
                  <Label htmlFor="signup-bio">Bio</Label>
                  <Textarea
                    id="signup-bio"
                    placeholder="Tell us a bit about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-goals">Your Goals with EDITH</Label>
                  <Textarea
                    id="signup-goals"
                    placeholder="What do you want to achieve with EDITH?"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    className="mt-1 min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <form onSubmit={handleSignUp} className="mt-6">
              <div className="flex gap-3">
                {signupStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSignupStep(signupStep - 1)}
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                  data-testid="button-signup-submit"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {signupStep < 3 ? (
                    <>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Toggle Panel */}
          <div className={`hidden md:flex toggle-panel absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-primary/90 to-accent/90 text-primary-foreground transition-all duration-700 ${isSignUp ? 'translate-x-[-100%] rounded-r-3xl' : 'rounded-l-3xl'}`}>
            <div className="flex flex-col items-center justify-center p-12 text-center">
              {!isSignUp ? (
                <>
                  <Sparkles className="w-16 h-16 mb-4 animate-pulse" />
                  <h1 className="text-4xl font-bold mb-4">Hello, Friend!</h1>
                  <p className="mb-8 text-primary-foreground/90">
                    Register with your details to start your AI coding journey with EDITH
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
                  <Sparkles className="w-16 h-16 mb-4 animate-pulse" />
                  <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                  <p className="mb-8 text-primary-foreground/90">
                    Enter your credentials to access your AI-powered projects
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
                <div className="text-3xl font-bold mb-2">EDITH</div>
                <div className="text-sm opacity-70">Even Dead I Am The Hero</div>
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
