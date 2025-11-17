
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronRight, ChevronLeft, Shield, Lock, Eye, EyeOff } from "lucide-react";
import { SiGoogle, SiGithub } from "react-icons/si";
import { isSupabaseConfigured } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

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
        description: "You've successfully signed in to VibeCoder.",
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
      if (signupPassword.length < 8) {
        toast({
          title: "Weak Password",
          description: "Password must be at least 8 characters",
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
        favoriteLanguages: favoriteLanguages ? favoriteLanguages.split(',').map(lang => lang.trim()) : [],
        projectGoals,
      });
      toast({
        title: "Welcome to VibeCoder!",
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
    if (!supabase) {
      toast({
        title: "Error",
        description: "Supabase is not configured",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const redirectUrl = window.location.hostname === 'localhost' 
        ? `${window.location.origin}/dashboard`
        : 'https://edith-code.vercel.app/dashboard';
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          scopes: provider === 'github' ? 'read:user user:email repo' : undefined,
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
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 p-4 perspective-1000 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {!isSupabaseConfigured() && (
        <Alert className="absolute top-4 left-4 right-4 max-w-2xl mx-auto bg-destructive/10 border-destructive animate-float z-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Required</AlertTitle>
          <AlertDescription>
            Please add your Supabase credentials to the Secrets tool to enable authentication.
          </AlertDescription>
        </Alert>
      )}

      <div className="container max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`bg-gray-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-purple-500/30 transition-all duration-700 transform-3d ${isSignUp ? 'min-h-[750px]' : 'min-h-[650px]'}`}
          style={{
            boxShadow: "0 0 80px rgba(139, 92, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.2)",
          }}
        >
          <div className="grid md:grid-cols-2">
            <AnimatePresence mode="wait">
              {!isSignUp ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="p-8 md:p-12 flex flex-col justify-center relative"
                >
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                  >
                    <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                      Sign In
                    </h1>
                    <p className="text-gray-400 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      Secure access to VibeCoder
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-3 mb-6"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOAuthSignIn('google')}
                      disabled={loading || !isSupabaseConfigured()}
                      className="flex-1 p-4 bg-gradient-to-br from-red-600 to-yellow-500 border border-red-500/50 rounded-xl hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform-3d relative overflow-hidden group"
                    >
                      <SiGoogle className="w-5 h-5 mx-auto text-white relative z-10" />
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOAuthSignIn('github')}
                      disabled={loading || !isSupabaseConfigured()}
                      className="flex-1 p-4 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600/50 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform-3d relative overflow-hidden group"
                    >
                      <SiGithub className="w-5 h-5 mx-auto text-white relative z-10" />
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </motion.button>
                  </motion.div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-gray-900 px-2 text-gray-500">or use your email</span>
                    </div>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label htmlFor="signin-email" className="text-gray-300">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading || !isSupabaseConfigured()}
                        className="mt-1 bg-gray-800/50 border-gray-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Label htmlFor="signin-password" className="text-gray-300">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading || !isSupabaseConfigured()}
                          className="mt-1 bg-gray-800/50 border-gray-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform-3d relative overflow-hidden group"
                        disabled={loading || !isSupabaseConfigured()}
                      >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Lock className="mr-2 h-4 w-4" />
                        Sign In Securely
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                      </Button>
                    </motion.div>
                  </form>

                  <p className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <button onClick={toggleMode} className="text-cyan-400 font-semibold hover:underline">
                      Sign Up
                    </button>
                  </p>
                  <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
                    <a href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</a>
                    <span>•</span>
                    <a href="/terms" className="hover:text-cyan-400 transition-colors">Terms</a>
                    <span>•</span>
                    <a href="/disclaimer" className="hover:text-cyan-400 transition-colors">Disclaimer</a>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="p-8 md:p-12 flex flex-col justify-center"
                >
                  <div className="mb-8">
                    <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                      Join VibeCoder
                    </h1>
                    <p className="text-gray-400">Step {signupStep} of 3 - Let's get to know you</p>
                    <div className="flex gap-2 mt-4">
                      <motion.div
                        className={`h-1 flex-1 rounded transition-all duration-500 ${signupStep >= 1 ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50' : 'bg-gray-700'}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.2 }}
                      />
                      <motion.div
                        className={`h-1 flex-1 rounded transition-all duration-500 ${signupStep >= 2 ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50' : 'bg-gray-700'}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: signupStep >= 2 ? 1 : 0 }}
                        transition={{ delay: 0.3 }}
                      />
                      <motion.div
                        className={`h-1 flex-1 rounded transition-all duration-500 ${signupStep >= 3 ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50' : 'bg-gray-700'}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: signupStep >= 3 ? 1 : 0 }}
                        transition={{ delay: 0.4 }}
                      />
                    </div>
                    {signupStep === 1 && (
                      <>
                        <div className="flex gap-3 mt-6">
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOAuthSignIn('google')}
                            disabled={loading || !isSupabaseConfigured()}
                            className="flex-1 p-4 bg-gradient-to-br from-red-600 to-yellow-500 border border-red-500/50 rounded-xl hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform-3d relative overflow-hidden"
                          >
                            <SiGoogle className="w-5 h-5 mx-auto text-white relative z-10" />
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              initial={{ x: "-100%" }}
                              whileHover={{ x: "100%" }}
                              transition={{ duration: 0.6 }}
                            />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOAuthSignIn('github')}
                            disabled={loading || !isSupabaseConfigured()}
                            className="flex-1 p-4 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600/50 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform-3d relative overflow-hidden"
                          >
                            <SiGithub className="w-5 h-5 mx-auto text-white relative z-10" />
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              initial={{ x: "-100%" }}
                              whileHover={{ x: "100%" }}
                              transition={{ duration: 0.6 }}
                            />
                          </motion.button>
                        </div>
                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gray-900 px-2 text-gray-500">or use email</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {signupStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
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
                            className="mt-1 bg-gray-800/50 border-gray-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a secure password"
                              value={signupPassword}
                              onChange={(e) => setSignupPassword(e.target.value)}
                              required
                              disabled={!isSupabaseConfigured()}
                              className="mt-1 bg-gray-800/50 border-gray-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-white transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="confirm-password" className="text-gray-300">Confirm Password</Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              disabled={!isSupabaseConfigured()}
                              className="mt-1 bg-gray-800/50 border-gray-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-gray-400 hover:text-white transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            type="button"
                            onClick={handleSignUpNext}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 relative overflow-hidden"
                            disabled={!isSupabaseConfigured()}
                          >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}

                    {signupStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
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
                            className="mt-1 bg-gray-800/50 border-gray-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
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
                            className="mt-1 bg-gray-800/50 border-gray-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
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
                            className="mt-1 bg-gray-800/50 border-gray-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
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
                      </motion.div>
                    )}

                    {signupStep === 3 && (
                      <motion.form
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleSignUpSubmit}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="occupation" className="text-gray-300">Occupation</Label>
                          <Input
                            id="occupation"
                            type="text"
                            placeholder="e.g., Student, Developer, Designer"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            disabled={!isSupabaseConfigured()}
                            className="mt-1 bg-gray-800/50 border-gray-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="experience" className="text-gray-300">Experience Level</Label>
                          <select
                            id="experience"
                            value={experienceLevel}
                            onChange={(e) => setExperienceLevel(e.target.value)}
                            disabled={!isSupabaseConfigured()}
                            className="w-full mt-1 p-2 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
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
                            className="mt-1 bg-gray-800/50 border-gray-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="goals" className="text-gray-300">Project Goals</Label>
                          <Textarea
                            id="goals"
                            placeholder="What do you want to build?"
                            value={projectGoals}
                            onChange={(e) => setProjectGoals(e.target.value)}
                            disabled={!isSupabaseConfigured()}
                            className="mt-1 bg-gray-800/50 border-gray-700 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
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
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <button onClick={toggleMode} className="text-cyan-400 font-semibold hover:underline">
                      Sign In
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="hidden md:flex bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-700 text-white p-12 flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/20"></div>
              
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                  backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                  backgroundSize: "200% 200%",
                }}
              />

              <div className="relative z-10 text-center">
                <motion.div
                  className="text-7xl font-bold mb-4"
                  animate={{
                    scale: [1, 1.05, 1],
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 40px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  VibeCoder
                </motion.div>
                <motion.div
                  className="text-2xl mb-2 opacity-90"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.9 }}
                  transition={{ delay: 0.3 }}
                >
                  Powered by Edith AI
                </motion.div>
                <motion.div
                  className="text-sm opacity-75 max-w-sm mx-auto mt-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.75 }}
                  transition={{ delay: 0.5 }}
                >
                  Your AI-powered coding companion with real-time collaboration, multi-language support, and intelligent code generation
                </motion.div>
                
                <motion.div
                  className="mt-12 flex gap-4 justify-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Shield className="w-8 h-8" />
                  </motion.div>
                  <motion.div
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  >
                    <Lock className="w-8 h-8" />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="mt-12 text-xs opacity-60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1 }}
                >
                  Created by <span className="font-semibold">NS GAMMING / Nishant Sarkar</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
