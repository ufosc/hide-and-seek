import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { api } from "@/lib/trpc";
import { CreateGameInput } from "@repo/shared-types/games.api";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/ui/button";
import { useRouter } from "expo-router";
import MapComponent from "@/components/MapComponent";
import useMapStore from "@/store/mapStore";

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
      <SafeAreaView className="flex-1 p-5">
        <ActivityIndicator size="large" color="#0f6ef7" />
        <Text className="mt-2.5 text-center">Checking existing games...</Text>
      </SafeAreaView>
    );
  }

  // If user already has a game, show message and option to view it
  if (hasExistingGame) {
    return (
      <SafeAreaView className="flex-1 p-5">
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-2xl font-bold text-danger mb-2.5 text-center">
            You Already Have a Game
          </Text>
          <Text className="text-base text-center mb-5 text-gray-800">
            You can only have one active game at a time. Please continue with
            your existing game or delete it to create a new one.
          </Text>
          <View className="bg-gray-100 border-2 border-primary rounded p-4 w-full items-center mb-5">
            <Text className="text-lg font-bold">{userGames[0].title}</Text>
            <Text className="text-primary mt-1">
              Status: {userGames[0].status.toUpperCase()}
            </Text>
          </View>
          <Button
            onPress={handleViewExistingGame}
            className="w-full mb-2.5 bg-primary"
          >
            Continue to Your Game
          </Button>
          <Button
            onPress={() => router.push("/(tabs)/list-games")}
            className="w-full bg-secondary"
          >
            Go to Games List
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // STEP 1: Boundary Setup Screen
  if (currentStep === CreateGameStep.SETUP_BOUNDARY) {
    const textColor = polygonDraftCoordinates.length < 3 ? "red" : "blue";

    return (
      <SafeAreaView className="flex-1 p-5">
        <Text className="text-2xl font-bold mb-2.5 text-center">
          Step 1: Set Game Boundary
        </Text>
        <Text className="text-center mb-4 text-gray-600">
          Tap on the map to create boundary points. You need at least 3 points
          to form a valid boundary.
        </Text>

        <View
          className="h-[50vh] rounded-lg overflow-hidden border border-gray-300 mb-4"
          style={{ height: Dimensions.get("window").height * 0.5 }}
        >
          <MapComponent onPress={handleMapPress} />
        </View>

        <View className="items-center mb-4">
          <Text style={{ color: textColor }} className={`text-base font-bold`}>
            Points: {polygonDraftCoordinates.length}/3 minimum
          </Text>
        </View>

        <View className="flex-row justify-between mb-4">
          <Button onPress={() => clearPolygonDraft()} className="flex-1 mr-1">
            Clear All Points
          </Button>
          <Button
            onPress={() => removeLastCoordinateFromPolygonDraft()}
            className="flex-1 ml-1"
          >
            Remove Last Point
          </Button>
        </View>

        <Button
          disabled={polygonDraftCoordinates.length < 3}
          onPress={nextStep}
          className={`bg-success ${
            polygonDraftCoordinates.length < 3 ? "opacity-50" : ""
          }`}
        >
          Next: Add Game Details
        </Button>
      </SafeAreaView>
    );
  }

  // STEP 2: Game Details Screen
  return (
    <SafeAreaView className="flex-1 p-5">
      <Text className="text-2xl font-bold mb-2.5 text-center">
        Step 2: Game Details
      </Text>

      <View className="bg-blue-100 p-2.5 rounded mb-4">
        <Text className="text-primary font-medium">
          ✓ Boundary set: {polygonDraftCoordinates.length} points
        </Text>
      </View>

      <TextInput
        className="border border-gray-300 p-3 mb-4 rounded text-base"
        placeholder="Game Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        className="border border-gray-300 p-3 mb-4 rounded text-base h-[100px]"
        placeholder="Game Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />

      <View className="flex-row justify-between mb-4">
        <Button onPress={prevStep} className="flex-1 mr-1 bg-secondary">
          Back to Boundary
        </Button>

        <Button
          disabled={createGameMutation.isPending || !title || title.length < 3}
          onPress={handleSubmit}
          className={`flex-1 ml-1 bg-success ${
            createGameMutation.isPending || !title || title.length < 3
              ? "opacity-50"
              : ""
          }`}
        >
          {createGameMutation.isPending ? "Creating..." : "Create Game"}
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default CreateGameForm;