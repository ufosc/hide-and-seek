import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  session: Session | null;
  user: any | null;
  isLoading: boolean;
  setUser: (session: Session | null) => void;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      user: null,
      isLoading: false,
      setUser: (session: Session | null) => {
        set({ session: session, user: session?.user || null });
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.log("Error signing out:", error);
        } else {
          set({ session: null, user: null });
        }
      },
      signInWithEmail: async (email: string, password: string) => {
        set({ isLoading: true });
        const { error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          throw error;
        }
        set({ isLoading: false });
      },
      signUpWithEmail: async (email: string, password: string) => {
        set({ isLoading: true });
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (error) {
          throw error;
        } else {
          console.log("Check your email for verification!");
        }
        set({ isLoading: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
