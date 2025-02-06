import { router } from "expo-router";
import { View, Text, Button, SafeAreaView, StyleSheet } from "react-native";

export default function Login() {
  return (
    <SafeAreaView>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Login Screen</Text>
      </View>
      <Button
        title="Go to Main App"
        onPress={() => {
          router.replace("/(tabs)");
        }}
      />
      <Button
        title="Go to Sign up"
        onPress={() => {
          router.replace("/signup");
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
