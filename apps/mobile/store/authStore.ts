import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { trpcClient } from "@/lib/trpc";

interface AuthState {
  session: Session | null;
  user: any | null;
  isLoading: boolean;
  setUser: (session: Session | null) => void;
  signOut: () => Promise<void>;
  signInWithEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  signUpWithEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
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
      signUpWithEmail: async (
        name: string,
        email: string,
        password: string
      ) => {
        set({ isLoading: true });
        try {
          // Step 1: Register with Supabase Auth
          const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
          });

          console.log(data);

          if (error) {
            throw error;
          }

          if (data?.user) {
            // Step 2: Create user in database using tRPC
            try {
              trpcClient.user.create.mutate({
                name,
                email: email,
                auth_id: data.user.id,
              });
              console.log("User created in database");
            } catch (dbError: any) {
              console.error(
                "Error creating user in database:",
                dbError.message
              );
            }
          }
        } catch (error) {
          console.error("SignUp error:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
