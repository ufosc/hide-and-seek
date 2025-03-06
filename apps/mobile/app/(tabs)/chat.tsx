import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";

// Message type definition
type Message = {
  id: string;
  text: string;
  isSent: boolean;
  timestamp: Date;
};

// Component for an individual message bubble
const MessageBubble = ({ message }: { message: Message }) => {
  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      className={`max-w-[80%] mb-2 ${message.isSent ? "self-end" : "self-start"}`}
    >
      <View
        className={`px-4 py-2 rounded-2xl ${
          message.isSent
            ? "bg-blue-500 rounded-br-none"
            : "bg-gray-200 rounded-bl-none dark:bg-gray-700"
        }`}
      >
        <Text
          className={`${message.isSent ? "text-white" : "text-black dark:text-white"}`}
        >
          {message.text}
        </Text>
      </View>
      <Text className="text-xs text-gray-500 mt-1 ml-1">{formattedTime}</Text>
    </View>
  );
};

// Initial dummy messages
const initialMessages: Message[] = [
  {
    id: "1",
    text: "Hey, how are you?",
    isSent: false,
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    text: "I'm good! Just finished setting up the new app.",
    isSent: true,
    timestamp: new Date(Date.now() - 3500000),
  },
  {
    id: "3",
    text: "That's great! How's the NativeWind implementation going?",
    isSent: false,
    timestamp: new Date(Date.now() - 3400000),
  },
  {
    id: "4",
    text: "It's amazing! Tailwind classes make styling so much easier.",
    isSent: true,
    timestamp: new Date(Date.now() - 3300000),
  },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isSent: true,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="p-4 border-b border-gray-200 dark:border-gray-800 flex-row items-center">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800 dark:text-white">
            Chat
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Online
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        className="flex-1 px-4"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={{ paddingVertical: 20 }}
      />

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View className="p-2 border-t border-gray-200 dark:border-gray-800 flex-row items-center">
          <TextInput
            className="flex-1 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-full px-4 py-2 mr-2"
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            className="bg-blue-500 w-10 h-10 rounded-full items-center justify-center"
          >
            <Text className="text-white font-bold text-xl">→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
