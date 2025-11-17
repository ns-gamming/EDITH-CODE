import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, isSupabaseConfigured, getSupabaseConfigError } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "@shared/schema";

interface AuthContextType {
  user: SupabaseUser | null;
  profile: User | null;
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
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
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
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (data) {
        setProfile(data as User);
      }
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

  const signUp = async (data: {
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
    if (!supabase) {
      throw new Error(getSupabaseConfigError());
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          username: data.username,
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("No user data returned");

    // Wait for the trigger to create the user record
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update user profile with additional information
    const { error: profileError } = await supabase
      .from('users')
      .update({
        full_name: data.fullName,
        username: data.username,
        bio: data.bio || null,
        occupation: data.occupation || null,
        experience_level: data.experienceLevel || null,
        favorite_languages: data.favoriteLanguages || null,
        project_goals: data.projectGoals || null,
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error("Profile update error:", profileError);
    }

    await fetchProfile(authData.user.id);
  };

  const signOut = async () => {
    if (!supabase) throw new Error(getSupabaseConfigError());
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!supabase) throw new Error(getSupabaseConfigError());
    if (!user) throw new Error("No user logged in");

    const { error } = await supabase
      .from("users")
      .update(updates as any)
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

export { AuthContext };