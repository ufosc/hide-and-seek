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
import { api } from "@/lib/trpc";
import { CreateGameInput } from "@repo/shared-types/games.api";

const CreateGameForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createGameMutation = api.game.create.useMutation({
    onSuccess: (data) => {
      Alert.alert(
        "Game Created",
        `Successfully created game with id: ${data.id}`
      );
      setTitle("");
      setDescription("");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
      console.error(error);
    },
  });

  const handleSubmit = () => {
    const input: CreateGameInput = {
      title,
      description: description || null,
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
        title={createGameMutation.isPending ? "Creating..." : "Create Game"} 
        onPress={handleSubmit}
        disabled={createGameMutation.isPending} 
      />
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
