import { DefaultTheme, ThemeProvider, Theme } from "@react-navigation/native";
import { DarkTheme } from "@/styles/DarkTheme";

import { TRPCProvider } from "@/lib/trpc";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import "@/global.css";

const queryClient = new QueryClient();

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";
import Dice from "@/components/Dice";

SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const setUser = useAuthStore((state) => state.setUser);

  const hasMounted = React.useRef(false);

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session);
    }

    loadSession();

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session);
    });
  }, [setUser]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <TRPCProvider>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="game-lobby" options={{ headerShown: true }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </GestureHandlerRootView>

          <Dice />

          <StatusBar style="dark" />
        </QueryClientProvider>
      </TRPCProvider>
    </ThemeProvider>
  );
}
