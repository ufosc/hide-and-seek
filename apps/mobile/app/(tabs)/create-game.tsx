import { env } from "@/lib/env";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";

import {
  CreateGameInput,
  CreateGameSchema,
} from "@repo/shared-types/games.api";

const CreateGameForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${env.EXPO_PUBLIC_SUPABASE_API_URL}create-game`, // Replace with your actual Supabase function URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.EXPO_PUBLIC_SUPABASE_API_ANON_KEY}`,
            // Add any necessary authorization headers here
          },
          body: JSON.stringify({ title, description } as CreateGameInput),
        }
      );
      console.log({ title, description });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to create game: ${response.status} - ${
            errorData.error || JSON.stringify(errorData)
          }`
        );
      }

      const newGame = await response.json();
      Alert.alert(
        "Game Created",
        `Successfully created game with id: ${newGame.id}`
      );
      setTitle("");
      setDescription("");
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log(error.message);
    }
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
      <Button title="Create Game" onPress={handleSubmit} />
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
