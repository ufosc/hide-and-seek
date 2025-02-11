import React from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Input } from "@rneui/themed";
import { ChatInput } from "@/components/chat/ChatInput";

export default function ChatScreen() {
  const [input, setInput] = React.useState("");

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.text}>Chat Screen</Text>
      <ChatInput
        value={input}
        onChangeText={(text: string) => {
          setInput(text);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
