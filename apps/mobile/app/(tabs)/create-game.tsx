import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
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

  // Check if the user already has a created game
  const {
    data: userGames,
    isLoading: isCheckingGames,
    error: userGamesError,
  } = api.game.getByCreator.useQuery(
    { creator_id: user?.id || "" },
    {
      enabled: !!user?.id,
      // Disable caching to ensure we always get fresh data
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }
  );

  // User already has a game
  const hasExistingGame = userGames && userGames.length > 0;

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

    if (hasExistingGame) {
      Alert.alert(
        "Game Already Exists",
        "You can only have one active game at a time. Please delete your existing game if you want to create a new one.",
        [
          { text: "OK" },
          {
            text: "Go to My Game",
            onPress: () => router.push(`/game-lobby/${userGames[0].id}`),
          },
        ]
      );
      return;
    }

    const input: CreateGameInput = {
      title,
      description: description || null,
      creator_id: user.id,
    };

    createGameMutation.mutate(input);
  };

  const handleViewExistingGame = () => {
    if (hasExistingGame) {
      router.push(`/game-lobby/${userGames[0].id}`);
    }
  };

  // Show loading state while checking if user has games
  if (isCheckingGames) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Checking existing games...</Text>
      </SafeAreaView>
    );
  }

  // If user already has a game, show message and option to view it
  if (hasExistingGame) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.existingGameContainer}>
          <Text style={styles.warningTitle}>You Already Have a Game</Text>
          <Text style={styles.warningText}>
            You can only have one active game at a time. Please continue with
            your existing game or delete it to create a new one.
          </Text>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>{userGames[0].title}</Text>
            <Text style={styles.gameStatus}>
              Status: {userGames[0].status.toUpperCase()}
            </Text>
          </View>
          <Button onPress={handleViewExistingGame} style={styles.viewButton}>
            <Text>Continue to Your Game</Text>
          </Button>
          <Button
            onPress={() => router.push("/(tabs)/list-games")}
            style={styles.listButton}
          >
            <Text>Go to Games List</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

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
  loadingText: {
    marginTop: 10,
    textAlign: "center",
  },
  existingGameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  warningTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#d9534f",
    marginBottom: 10,
    textAlign: "center",
  },
  warningText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  gameInfo: {
    backgroundColor: "#f8f9fa",
    borderColor: "#007bff",
    borderWidth: 2,
    borderRadius: 5,
    padding: 15,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  gameStatus: {
    color: "#007bff",
    marginTop: 5,
  },
  viewButton: {
    marginBottom: 10,
    width: "100%",
  },
  listButton: {
    width: "100%",
    backgroundColor: "#6c757d",
  },
});

export default CreateGameForm;
