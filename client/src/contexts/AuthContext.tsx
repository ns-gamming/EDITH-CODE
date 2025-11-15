import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, isSupabaseConfigured, getSupabaseConfigError } from "@/lib/supabase";
import type { User } from "@shared/schema";

// Define UserProfile type if it's not already defined elsewhere
interface UserProfile {
  id: string;
  full_name?: string;
  username?: string;
  bio?: string;
  occupation?: string;
  experience_level?: string;
  favoriteLanguages?: string[];
  projectGoals?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    email: string;
    password: string;
    fullName: string;
    username: string;
    bio?: string;
    occupation?: string;
    experienceLevel?: string;
    favoriteLanguages?: string[];
    projectGoals?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      console.warn(getSupabaseConfigError());
      setLoading(false);
      return;
    }

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
    } catch (error) {
      console.error("Session check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error(getSupabaseConfigError());
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    if (data.user) {
      await fetchProfile(data.user.id);
    }
  };

  const signUp = async (signupData: {
    email: string;
    password: string;
    fullName: string;
    username: string;
    bio?: string;
    occupation?: string;
    experienceLevel?: string;
    favoriteLanguages?: string[];
    projectGoals?: string;
  }) => {
    if (!supabase) throw new Error(getSupabaseConfigError());
    const { data, error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        data: {
          full_name: signupData.fullName,
          username: signupData.username,
          // Ensure other profile fields are also passed if needed by Supabase RLS or schema
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Separate profile data from auth data
      const profileDataToInsert: Partial<UserProfile> = {
        id: data.user.id,
        full_name: signupData.fullName,
        username: signupData.username,
        bio: signupData.bio,
        occupation: signupData.occupation,
        experience_level: signupData.experienceLevel,
        favoriteLanguages: signupData.favoriteLanguages,
        projectGoals: signupData.projectGoals,
        created_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .insert(profileDataToInsert);

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw profileError;
      }
      await fetchProfile(data.user.id); // Fetch the newly created profile
    }
  };

  const signOut = async () => {
    if (!supabase) throw new Error(getSupabaseConfigError());
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!supabase) throw new Error(getSupabaseConfigError());
    if (!user) throw new Error("No user logged in");

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) throw error;
    await fetchProfile(user.id); // Re-fetch profile to reflect updates
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}