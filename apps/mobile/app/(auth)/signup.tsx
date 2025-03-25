import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { signUpWithEmail, isLoading } = useAuthStore();

  async function handleSignUp() {
    try {
      await signUpWithEmail(email, password);
      if (!isLoading) {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      Alert.alert("Sign-up Error", error.message);
    }
  }
  return (
    <View className="flex-1 bg-gray-900 justify-between px-5 pb-10 pt-20">
      <View className="max-w-md w-full mx-auto space-y-4">
        <Text className="text-white text-2xl font-bold mb-12 text-center">
          Create Account
        </Text>

        <View>
          <View>
            <TextInput
              className="w-full bg-gray-800 text-white p-4 rounded-lg mb-5"
              placeholder="Username"
              placeholderTextColor="#A3A3A3"
              onChangeText={setUsername}
              value={username}
            />
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

          <TouchableOpacity
            className="w-full bg-white py-4 rounded-lg items-center mb-5"
            onPress={handleSignUp}
          >
            <Text className="text-black font-bold text-base">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-center gap-3 my-2">
        <Text className="text-gray-400 text-center">
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text className="text-white font-bold">Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
