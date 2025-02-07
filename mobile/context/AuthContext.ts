import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@lib/supabase";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  session: Session | null;
  user: any | null;
  isLoading: boolean;
  setUser: (session: Session | null) => void;
  signOut: () => Promise<void>;
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
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
