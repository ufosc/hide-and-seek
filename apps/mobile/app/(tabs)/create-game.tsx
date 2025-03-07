import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { api } from "@/lib/trpc";
import { CreateGameInput } from "@repo/shared-types/games.api";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import MapComponent from "@/components/MapComponent";
import useMapStore from "@/store/mapStore";
import { LatLng } from "react-native-maps";

// Steps in the game creation process
enum CreateGameStep {
  SETUP_BOUNDARY,
  GAME_DETAILS,
}

const CreateGameForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentStep, setCurrentStep] = useState<CreateGameStep>(
    CreateGameStep.SETUP_BOUNDARY
  );
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // Map state
  const isDrawingPolygon = useMapStore((state) => state.isDrawingPolygon);
  const polygonDraftCoordinates = useMapStore(
    (state) => state.polygonDraftCoordinates
  );
  const startDrawingPolygon = useMapStore((state) => state.startDrawingPolygon);
  const stopDrawingPolygon = useMapStore((state) => state.stopDrawingPolygon);
  const clearPolygonDraft = useMapStore((state) => state.clearPolygonDraft);
  const addCoordinateToPolygonDraft = useMapStore(
    (state) => state.addCoordinateToPolygonDraft
  );
  const removeLastCoordinateFromPolygonDraft = useMapStore(
    (state) => state.removeLastCoordinateFromPolygonDraft
  );

  // Automatically start drawing mode when opening the boundary setup screen
  useEffect(() => {
    if (currentStep === CreateGameStep.SETUP_BOUNDARY && !isDrawingPolygon) {
      startDrawingPolygon();
    }
  }, [currentStep, isDrawingPolygon, startDrawingPolygon]);

  // Check if user already has a game
  const {
    data: userGames,
    isLoading: isCheckingGames,
    error: userGamesError,
  } = api.game.getByCreator.useQuery(
    { creator_id: user?.id || "" },
    {
      enabled: !!user?.id,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }
  );

  const hasExistingGame = userGames && userGames.length > 0;

  const createGameMutation = api.game.create.useMutation({
    onSuccess: (data) => {
      Alert.alert("Game Created", `Successfully created game: ${data.title}`);
      setTitle("");
      setDescription("");
      clearPolygonDraft();
      setCurrentStep(CreateGameStep.SETUP_BOUNDARY);

      // Navigate to the game lobby
      router.push(`/game-lobby/${data.id}`);
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
      console.error(error);
    },
  });

  const handleMapPress = (event: any) => {
    if (isDrawingPolygon && currentStep === CreateGameStep.SETUP_BOUNDARY) {
      const coordinate = event.nativeEvent.coordinate;
      addCoordinateToPolygonDraft(coordinate);
    }
  };

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

    // Check if we have a valid boundary (at least 3 points)
    if (polygonDraftCoordinates.length < 3) {
      Alert.alert(
        "Invalid Boundary",
        "Please create a boundary with at least 3 points"
      );
      return;
    }

    const input: CreateGameInput = {
      title,
      description: description || null,
      creator_id: user.id,
      boundary: polygonDraftCoordinates,
    };

    createGameMutation.mutate(input);
  };

  const handleViewExistingGame = () => {
    if (hasExistingGame) {
      router.push(`/game-lobby/${userGames[0].id}`);
    }
  };

  const nextStep = () => {
    // Validate current step
    if (currentStep === CreateGameStep.SETUP_BOUNDARY) {
      if (polygonDraftCoordinates.length < 3) {
        Alert.alert(
          "Invalid Boundary",
          "Please create a boundary with at least 3 points"
        );
        return;
      }
      stopDrawingPolygon();
      setCurrentStep(CreateGameStep.GAME_DETAILS);
    }
  };

  const prevStep = () => {
    if (currentStep === CreateGameStep.GAME_DETAILS) {
      startDrawingPolygon();
      setCurrentStep(CreateGameStep.SETUP_BOUNDARY);
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

  // STEP 1: Boundary Setup Screen
  if (currentStep === CreateGameStep.SETUP_BOUNDARY) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Step 1: Set Game Boundary</Text>
        <Text style={styles.instructions}>
          Tap on the map to create boundary points. You need at least 3 points
          to form a valid boundary.
        </Text>

        <View style={styles.mapContainer}>
          <MapComponent onPress={handleMapPress} />
        </View>

        <View style={styles.pointsInfo}>
          <Text style={styles.pointsCount}>
            Points: {polygonDraftCoordinates.length}/3 minimum
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <Button
            onPress={() => clearPolygonDraft()}
            style={styles.clearButton}
          >
            <Text>Clear All Points</Text>
          </Button>
          <Button
            onPress={() => removeLastCoordinateFromPolygonDraft()}
            style={styles.undoButton}
          >
            <Text>Remove Last Point</Text>
          </Button>
        </View>

        <Button
          disabled={polygonDraftCoordinates.length < 3}
          onPress={nextStep}
          style={[
            styles.nextButton,
            polygonDraftCoordinates.length < 3 ? styles.disabledButton : null,
          ]}
        >
          <Text>Next: Add Game Details</Text>
        </Button>
      </SafeAreaView>
    );
  }

  // STEP 2: Game Details Screen
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Step 2: Game Details</Text>

      <View style={styles.boundaryInfo}>
        <Text style={styles.boundaryTitle}>
          ✓ Boundary set: {polygonDraftCoordinates.length} points
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Game Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Game Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
      />

      <View style={styles.buttonRow}>
        <Button onPress={prevStep} style={styles.backButton}>
          <Text>Back to Boundary</Text>
        </Button>

        <Button
          disabled={createGameMutation.isPending || !title || title.length < 3}
          onPress={handleSubmit}
          style={styles.createButton}
        >
          <Text>
            {createGameMutation.isPending ? "Creating..." : "Create Game"}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  instructions: {
    textAlign: "center",
    marginBottom: 15,
    color: "#555",
  },
  mapContainer: {
    height: Dimensions.get("window").height * 0.5,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  pointsInfo: {
    alignItems: "center",
    marginBottom: 15,
  },
  pointsCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  clearButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: "#dc3545",
  },
  undoButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: "#6c757d",
  },
  nextButton: {
    backgroundColor: "#28a745",
  },
  disabledButton: {
    opacity: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  boundaryInfo: {
    backgroundColor: "#e8f4f8",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  boundaryTitle: {
    color: "#0066cc",
    fontWeight: "500",
  },
  backButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: "#6c757d",
  },
  createButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: "#28a745",
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
