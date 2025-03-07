import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/lib/trpc";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import MapComponent from "@/components/MapComponent";
import useMapStore from "@/store/mapStore";

export default function GameLobbyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gameId = parseInt(id || "0");
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const setPolygons = useMapStore((state) => state.setPolygons);

  // Get game details
  const {
    data: game,
    isLoading: isLoadingGame,
    error: gameError,
  } = api.game.getById.useQuery({ id: gameId });

  // Get game participants
  const {
    data: participants,
    isLoading: isLoadingParticipants,
    refetch: refetchParticipants,
    error: participantsError,
  } = api.game.getParticipants.useQuery({ game_id: gameId });

  // When game data loads, set the boundary on the map
  useEffect(() => {
    if (game && game.boundary) {
      setPolygons([
        {
          coordinates: game.boundary,
          fillColor: "rgba(0, 150, 255, 0.2)",
          strokeColor: "#0096ff",
          strokeWidth: 2,
        },
      ]);
    }
  }, [game, setPolygons]);

  // Start game mutation
  const startGameMutation = api.game.updateStatus.useMutation({
    onSuccess: () => {
      Alert.alert("Game Started", "The game has begun!");
      // Here you would navigate to the actual game screen
      // For now we'll just go back to the home screen
      router.replace("/(tabs)");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  // Delete game mutation
  const deleteGameMutation = api.game.delete.useMutation({
    onSuccess: () => {
      Alert.alert("Game Deleted", "The game has been deleted successfully.");
      setPolygons([]); // reset boundary;
      // Navigate back to games list
      router.replace("/(tabs)/list-games");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  // Check if current user is the creator
  const isCreator = user && game?.creator_id === user.id;

  if (isLoadingGame || isLoadingParticipants) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading game lobby...</Text>
      </SafeAreaView>
    );
  }

  if (gameError || participantsError) {
    const error = gameError || participantsError;
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error?.message}</Text>
        <Button onPress={() => router.back()}>
          <Text>Go Back</Text>
        </Button>
      </SafeAreaView>
    );
  }

  const handleStartGame = () => {
    if (!isCreator) {
      Alert.alert("Error", "Only the game creator can start the game");
      return;
    }

    if (participants && participants.length < 2) {
      Alert.alert(
        "Not Enough Players",
        "At least 2 players are required to start a game"
      );
      return;
    }

    startGameMutation.mutate({ game_id: gameId, status: "started" });
  };

  const handleDeleteGame = () => {
    if (!isCreator || !user) {
      Alert.alert("Error", "Only the game creator can delete the game");
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      "Delete Game",
      "Are you sure you want to delete this game? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteGameMutation.mutate({
              game_id: gameId,
              creator_id: user.id,
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{game?.title} - Waiting Room</Text>
        <Text style={styles.description}>
          {game?.description || "No description provided"}
        </Text>
        <Text style={styles.statusText}>
          Status: {game?.status.toUpperCase()}
        </Text>
      </View>

      {/* Game boundary map */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapTitle}>Game Boundary</Text>
        <MapComponent />
      </View>

      <View style={styles.participantsContainer}>
        <Text style={styles.sectionTitle}>Participants</Text>
        <Button onPress={() => refetchParticipants()}>
          <Text>Refresh Participants</Text>
        </Button>

        {participants && participants.length > 0 ? (
          <FlatList
            data={participants}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.participantItem}>
                <Text style={styles.participantName}>{item.user?.name}</Text>
                <Text style={styles.participantRole}>Role: {item.role}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noParticipantsText}>No participants yet</Text>
        )}
      </View>

      {isCreator && game?.status === "waiting" && (
        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <Button
              disabled={startGameMutation.isPending}
              onPress={handleStartGame}
              style={styles.actionButton}
            >
              <Text>
                {startGameMutation.isPending ? "Starting..." : "Start Game"}
              </Text>
            </Button>

            <Button
              disabled={deleteGameMutation.isPending}
              onPress={handleDeleteGame}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>
                {deleteGameMutation.isPending ? "Deleting..." : "Delete Game"}
              </Text>
            </Button>
          </View>
        </View>
      )}

      {!isCreator && game?.status === "waiting" && (
        <View style={styles.footer}>
          <Text style={styles.waitingText}>
            Waiting for the game creator to start...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#0066cc",
  },
  mapContainer: {
    height: Dimensions.get("window").height * 0.25,
    marginBottom: 15,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  mapTitle: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 5,
    borderRadius: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  participantsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  participantItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  participantRole: {
    fontSize: 14,
    color: "gray",
  },
  noParticipantsText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  footer: {
    marginTop: 30,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#dc3545", // Red color for delete button
  },
  deleteButtonText: {
    color: "white",
  },
  waitingText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    fontStyle: "italic",
  },
});
