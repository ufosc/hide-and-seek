import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { signInWithEmail, isLoading } = useAuthStore();

  async function handleSignIn() {
    try {
      await signInWithEmail(email, password);
      if (!isLoading) {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      Alert.alert("Sign-in Error", error.message);
    }
  }

  return (
    <View className="flex-1 bg-gray-900 justify-between px-5 pb-10 pt-20">
      <View className="max-w-md w-full mx-auto space-y-4">
        <Text className="text-white text-2xl font-bold mb-12 text-center">
          Welcome Back!
        </Text>

        <View>
          <View>
            <TextInput
              className="w-full bg-gray-800 text-white p-4 rounded-lg mb-5"
              placeholder="Email"
              placeholderTextColor="#A3A3A3"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
            />
            <TextInput
              className="w-full bg-gray-800 text-white p-4 rounded-lg mb-5"
              placeholder="Password"
              placeholderTextColor="#A3A3A3"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
          </View>
          <Text className="text-gray-400 text-sm self-end mb-5">
            Forgot your password?
          </Text>

          <TouchableOpacity
            className="w-full bg-white py-4 rounded-lg items-center mb-5"
            onPress={handleSignIn}
          >
            <Text className="text-black font-bold text-base">Login</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center w-full mb-5">
          <View className="flex-1 h-px bg-white" />
          <Text className="text-gray-400 mx-2">or continue with</Text>
          <View className="flex-1 h-px bg-white" />
        </View>

        <View className="space-y-3">
          <TouchableOpacity
            className="flex-row items-center justify-center w-full border border-gray-600 py-4 rounded-lg mb-2"
            disabled={isLoading}
          >
            <Image
              source={require("@/assets/images/google-icon.png")}
              className="w-6 h-6"
            />
            <Text className="text-white ml-2 text-base">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center w-full border border-gray-600 py-4 rounded-lg mb-2"
            disabled={isLoading}
          >
            <AntDesign name="apple1" size={24} color="white" />
            <Text className="text-white ml-2 text-base">
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-center gap-3 my-2">
        <Text className="text-gray-400 text-center">
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/signup")}>
          <Text className="text-white font-bold">Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
