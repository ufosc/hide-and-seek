import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { api } from "@/lib/trpc";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import Button from "@/components/ui/button";
import { GameStatus, Game } from "@repo/shared-types/games.api";

const ListGames = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Get all games
  const {
    isLoading: isLoadingAllGames,
    isError,
    data: allGames,
    error,
    refetch: refetchAllGames,
    isRefetching: isRefetchingAllGames,
  } = api.game.list.useQuery();

  // Get games created by the current user
  const {
    isLoading: isLoadingUserGames,
    data: userGames,
    refetch: refetchUserGames,
    isRefetching: isRefetchingUserGames,
  } = api.game.getByCreator.useQuery(
    { creator_id: user?.id || "" },
    { enabled: !!user?.id }
  );

  // Join game mutation
  const joinGameMutation = api.game.join.useMutation({
    onSuccess: (data) => {
      // Navigate to game lobby on successful join
      router.push(`/game-lobby/${data.game_id}`);
    },
    onError: (err) => {
      Alert.alert("Error Joining Game", err.message);
    },
  });

  // Delete game mutation
  const deleteGameMutation = api.game.delete.useMutation({
    onSuccess: () => {
      Alert.alert("Game Deleted", "The game has been deleted successfully.");
      refetchAllGames();
      refetchUserGames();
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  // First get the user's database ID using their auth ID
  const { data: userInfo } = api.user.getByAuthId.useQuery(
    { authId: user?.id },
    { enabled: !!user?.id }
  );

  // Prepare the games data: user's game at the top, then all other games
  const games = useMemo(() => {
    if (!allGames) return [];

    // Filter out the user's own game from allGames to avoid duplication
    const otherGames = user?.id
      ? allGames.filter((game) => game.creator_id !== user.id)
      : allGames;

    return otherGames;
  }, [allGames, user]);

  const hasUserGame = userGames && userGames.length > 0;

  const handleJoinGame = (gameId: number) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to join a game");
      return;
    }

    if (!userInfo) {
      Alert.alert("Error", "User information not available");
      return;
    }

    joinGameMutation.mutate({
      game_id: gameId,
      user_id: userInfo.id,
      role: "seeker", // Default role
    });
  };

  const handleContinueGame = (gameId: number) => {
    router.push(`/game-lobby/${gameId}`);
  };

  const handleDeleteGame = (gameId: number) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to delete a game");
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

  // Get the status text with appropriate color
  const getStatusDisplay = (status: GameStatus) => {
    let color;
    switch (status) {
      case "waiting":
        color = "#007bff"; // Blue
        break;
      case "started":
        color = "#28a745"; // Green
        break;
      case "completed":
        color = "#6c757d"; // Gray
        break;
      default:
        color = "#000000";
    }

    return (
      <Text style={[styles.gameStatus, { color }]}>{status.toUpperCase()}</Text>
    );
  };

  const renderGameItem = ({
    item,
    isUserGame = false,
  }: {
    item: Game;
    isUserGame?: boolean;
  }) => (
    <View style={[styles.gameItem, isUserGame && styles.userGameItem]}>
      {isUserGame && <Text style={styles.yourGameBadge}>YOUR GAME</Text>}
      <View style={styles.gameHeader}>
        <Text style={styles.gameTitle}>{item.title}</Text>
        {getStatusDisplay(item.status)}
      </View>
      <Text style={styles.gameDescription}>
        {item.description || "No description provided"}
      </Text>
      <View style={styles.gameFooter}>
        {isUserGame ? (
          // User's own game: show Continue and Delete buttons
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => handleContinueGame(item.id)}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteGame(item.id)}
              disabled={deleteGameMutation.isPending}
            >
              <Text style={styles.deleteButtonText}>
                {deleteGameMutation.isPending &&
                deleteGameMutation.variables?.game_id === item.id
                  ? "Deleting..."
                  : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Other games: show join button based on status
          <>
            {item.status === "waiting" && (
              <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinGame(item.id)}
                disabled={joinGameMutation.isPending}
              >
                <Text style={styles.joinButtonText}>
                  {joinGameMutation.isPending &&
                  joinGameMutation.variables?.game_id === item.id
                    ? "Joining..."
                    : "Join Game"}
                </Text>
              </TouchableOpacity>
            )}
            {item.status === "started" && (
              <Text style={styles.gameInProgressText}>Game in progress</Text>
            )}
            {item.status === "completed" && (
              <Text style={styles.gameCompletedText}>Game completed</Text>
            )}
          </>
        )}
      </View>
    </View>
  );

  const isLoading = isLoadingAllGames || isLoadingUserGames;
  const isRefetching = isRefetchingAllGames || isRefetchingUserGames;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading games...</Text>
      </SafeAreaView>
    );
  }

  const handleRefresh = () => {
    refetchAllGames();
    if (user?.id) {
      refetchUserGames();
    }
  };

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error loading games:</Text>
        <Text style={styles.errorText}>{error?.message}</Text>
        <Button onPress={handleRefresh}>Try Again</Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Games</Text>
        <Button onPress={handleRefresh} disabled={isRefetching}>
          <Text className="text-white">
            {isRefetching ? "Refreshing..." : "Refresh"}
          </Text>
        </Button>
      </View>

      {/* User's current game section */}
      {hasUserGame && (
        <View style={styles.userGameSection}>
          <Text style={styles.sectionTitle}>Your Game</Text>
          {renderGameItem({ item: userGames[0], isUserGame: true })}
        </View>
      )}

      {/* All other games */}
      <View style={styles.allGamesSection}>
        <Text style={styles.sectionTitle}>Available Games</Text>
        {games && games.length > 0 ? (
          <FlatList
            data={games}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => renderGameItem({ item })}
          />
        ) : (
          <Text style={styles.noGamesText}>No other games available.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  loadingText: {
    marginTop: 10,
    textAlign: "center",
    color: "#fff",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  userGameSection: {
    marginBottom: 20,
  },
  allGamesSection: {
    flex: 1,
  },
  noGamesText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    fontStyle: "italic",
    color: "#666",
  },
  gameItem: {
    padding: 15,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  userGameItem: {
    borderColor: "#007bff",
    borderWidth: 2,
    backgroundColor: "#f8f9fa",
  },
  yourGameBadge: {
    backgroundColor: "#007bff",
    color: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  gameStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  gameDescription: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  gameFooter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  continueButton: {
    backgroundColor: "#28a745",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  joinButton: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  gameInProgressText: {
    color: "#28a745",
    fontStyle: "italic",
  },
  gameCompletedText: {
    color: "#6c757d",
    fontStyle: "italic",
  },
});

export default ListGames;
