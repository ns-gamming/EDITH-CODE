import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { SiGoogle, SiGithub } from "react-icons/si";
import { Redirect } from "wouter";
import { isSupabaseConfigured } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Sign in fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign up fields - Step 1
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Sign up fields - Step 2
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  // Sign up fields - Step 3
  const [occupation, setOccupation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [favoriteLanguages, setFavoriteLanguages] = useState("");
  const [projectGoals, setProjectGoals] = useState("");

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

  const handleSignUpNext = () => {
    if (signupStep === 1) {
      if (!signupEmail || !signupPassword || !confirmPassword) {
        toast({
          title: "Missing Information",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }
      if (signupPassword !== confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
      setSignupStep(2);
    } else if (signupStep === 2) {
      if (!fullName || !username) {
        toast({
          title: "Missing Information",
          description: "Please provide your name and username",
          variant: "destructive",
        });
        return;
      }
      setSignupStep(3);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        favoriteLanguages,
        projectGoals,
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

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
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
    setBio("");
    setOccupation("");
    setExperienceLevel("");
    setFavoriteLanguages("");
    setProjectGoals("");
  };

  if (!isSupabaseConfigured() && typeof window !== 'undefined') {
    // If running on the client and Supabase is not configured, return null or a loading indicator
    // The Alert component will handle showing the configuration message
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 p-4">
      {!isSupabaseConfigured() && (
        <Alert className="absolute top-4 left-4 right-4 max-w-2xl mx-auto bg-destructive/10 border-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Required</AlertTitle>
          <AlertDescription>
            Please add your Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) to the Secrets tool to enable authentication.
          </AlertDescription>
        </Alert>
      )}
      <div className="container max-w-5xl mx-auto">
        <div className={`bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-purple-500/30 transition-all duration-500 ${isSignUp ? 'min-h-[700px]' : 'min-h-[600px]'}`}>
          <div className="grid md:grid-cols-2">
            {/* Sign In Form */}
            {!isSignUp && (
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-8">
                  <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Sign In
                  </h1>
                  <p className="text-gray-400">Welcome back to EDITH IDE</p>
                </div>

                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={loading || !isSupabaseConfigured()}
                    className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-all"
                  >
                    <SiGoogle className="w-5 h-5 mx-auto text-white" />
                  </button>
                  <button
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={loading || !isSupabaseConfigured()}
                    className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-all"
                  >
                    <SiGithub className="w-5 h-5 mx-auto text-white" />
                  </button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-2 text-gray-500">or use your email</span>
                  </div>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email" className="text-gray-300">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading || !isSupabaseConfigured()}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password" className="text-gray-300">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading || !isSupabaseConfigured()}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    disabled={loading || !isSupabaseConfigured()}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                  Don't have an account?{" "}
                  <button onClick={toggleMode} className="text-cyan-400 font-semibold hover:underline">
                    Sign Up
                  </button>
                </p>
              </div>
            )}

            {/* Multi-Step Sign Up Form */}
            {isSignUp && (
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-8">
                  <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Join EDITH
                  </h1>
                  <p className="text-gray-400">Step {signupStep} of 3 - Let's get to know you</p>
                  <div className="flex gap-2 mt-4">
                    <div className={`h-1 flex-1 rounded ${signupStep >= 1 ? 'bg-cyan-500' : 'bg-gray-700'}`} />
                    <div className={`h-1 flex-1 rounded ${signupStep >= 2 ? 'bg-cyan-500' : 'bg-gray-700'}`} />
                    <div className={`h-1 flex-1 rounded ${signupStep >= 3 ? 'bg-cyan-500' : 'bg-gray-700'}`} />
                  </div>
                </div>

                {signupStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        disabled={!isSupabaseConfigured()}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a secure password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        disabled={!isSupabaseConfigured()}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password" className="text-gray-300">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={!isSupabaseConfigured()}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleSignUpNext}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                      disabled={!isSupabaseConfigured()}
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {signupStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full-name" className="text-gray-300">Full Name *</Label>
                      <Input
                        id="full-name"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        disabled={!isSupabaseConfigured()}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username" className="text-gray-300">Username *</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={!isSupabaseConfigured()}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-gray-300">Bio (optional)</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        disabled={!isSupabaseConfigured()}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        variant="outline"
                        className="flex-1 border-gray-700"
                        disabled={!isSupabaseConfigured()}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSignUpNext}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                        disabled={!isSupabaseConfigured()}
                      >
                        Next <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {signupStep === 3 && (
                  <form onSubmit={handleSignUpSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="occupation" className="text-gray-300">Occupation</Label>
                      <Input
                        id="occupation"
                        type="text"
                        placeholder="e.g., Student, Developer, Designer"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        disabled={!isSupabaseConfigured()}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience" className="text-gray-300">Experience Level</Label>
                      <select
                        id="experience"
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        disabled={!isSupabaseConfigured()}
                        className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                      >
                        <option value="">Select...</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="languages" className="text-gray-300">Favorite Languages</Label>
                      <Input
                        id="languages"
                        type="text"
                        placeholder="e.g., JavaScript, Python, TypeScript"
                        value={favoriteLanguages}
                        onChange={(e) => setFavoriteLanguages(e.target.value)}
                        disabled={!isSupabaseConfigured()}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goals" className="text-gray-300">Project Goals</Label>
                      <Textarea
                        id="goals"
                        placeholder="What do you want to build with EDITH?"
                        value={projectGoals}
                        onChange={(e) => setProjectGoals(e.target.value)}
                        disabled={!isSupabaseConfigured()}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => setSignupStep(2)}
                        variant="outline"
                        className="flex-1 border-gray-700"
                        disabled={!isSupabaseConfigured()}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                        disabled={loading || !isSupabaseConfigured()}
                      >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                      </Button>
                    </div>
                  </form>
                )}

                <p className="mt-6 text-center text-sm text-gray-400">
                  Already have an account?{" "}
                  <button onClick={toggleMode} className="text-cyan-400 font-semibold hover:underline">
                    Sign In
                  </button>
                </p>
              </div>
            )}

            {/* Branding Panel */}
            <div className="hidden md:flex bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-700 text-white p-12 flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10 text-center">
                <div className="text-6xl font-bold mb-4 animate-pulse">EDITH</div>
                <div className="text-lg mb-2 opacity-90">Even Dead I Am The Hero</div>
                <div className="text-sm opacity-75 max-w-sm mx-auto mt-8">
                  Your AI-powered coding companion with real-time collaboration, multi-language support, and intelligent code generation
                </div>
                <div className="mt-12 text-xs opacity-60">
                  Created by <span className="font-semibold">NISHANT SARKAR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}