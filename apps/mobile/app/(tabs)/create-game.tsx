import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { api } from "@/lib/trpc";
import { CreateGameInput } from "@repo/shared-types/games.api";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";

const CreateGameForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const createGameMutation = api.game.create.useMutation({
    onSuccess: (data) => {
      Alert.alert("Game Created", `Successfully created game: ${data.title}`);
      setTitle("");
      setDescription("");

      // Navigate to the game lobby
      router.push(`/game-lobby/${data.id}`);
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
      console.error(error);
    },
  });

  const handleSubmit = () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to create a game");
      return;
    }

    const input: CreateGameInput = {
      title,
      description: description || null,
      creator_id: user.id, // Use the authenticated user's ID
    };

    createGameMutation.mutate(input);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create New Game</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button
        disabled={createGameMutation.isPending || !title || title.length < 3}
        onPress={handleSubmit}
      >
        <Text>
          {createGameMutation.isPending ? "Creating..." : "Create Game"}
        </Text>
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
});

export default CreateGameForm;
