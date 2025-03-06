import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
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
    <View style={styles.container}>
      <View style={styles.containerForm}>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.form}>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A3A3A3"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#A3A3A3"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
          </View>

          <View>
            <TextInput
              style={styles.input}
              placeholder="Your Name Here"
              placeholderTextColor="#A3A3A3"
              onChangeText={setUserName}
              value={userName}
            >

            </TextInput>
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.loginLink}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1525",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 80,
  },
  containerForm: {
    maxWidth: 450,
    width: "100%",
    marginHorizontal: "auto",
    gap: 16,
  },
  form: {},
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 50,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#2A213D",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  signUpButton: {
    width: "100%",
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  signUpText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    margin: 10,
  },
  loginText: {
    color: "#A3A3A3",
    textAlign: "center",
  },
  loginLink: {
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
});
