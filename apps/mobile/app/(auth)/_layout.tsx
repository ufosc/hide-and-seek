import { Stack } from "expo-router";
import React from "react";

// import { useColorScheme } from "@/hooks/useColorScheme";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Signup",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
