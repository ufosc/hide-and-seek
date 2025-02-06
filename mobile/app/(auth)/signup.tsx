import { router } from "expo-router";
import { View, Text, Button, SafeAreaView, StyleSheet } from "react-native";

export default function Signup() {
  return (
    <SafeAreaView>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Signup Screen</Text>
      </View>
      <Button
        title="Go to Main App"
        onPress={() => {
          router.replace("/(tabs)");
        }}
      />
      <Button
        title="Go to Login"
        onPress={() => {
          router.replace("/login");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
