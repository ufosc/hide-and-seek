import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { api } from "@/lib/trpc";

const ListGames = () => {
  const {
    isLoading,
    isError,
    data: games,
    error,
  } = api.game.list.useQuery();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading games...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error loading games:</Text>
        <Text style={styles.errorText}>{error?.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>List of Games</Text>
      {games && games.length > 0 ? (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.gameItem}>
              <Text style={styles.gameTitle}>{item.title}</Text>
              <Text style={styles.gameDescription}>{item.description}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No games available.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingText: {
    marginTop: 10,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  gameItem: {
    padding: 15,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  gameDescription: {
    fontSize: 14,
    color: "gray",
  },
});

export default ListGames;
