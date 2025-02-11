import React from "react";
import { View, StyleSheet } from "react-native";
import { Icon, Input } from "@rneui/themed";

interface ChatInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  invalid?: boolean;
  onSend?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
}) => {
  return (
    <View style={styles.container}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder="Type a message"
        rightIcon={<Icon type="font-awesome" name="paperclip" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderTopWidth: 1,
  },
});
