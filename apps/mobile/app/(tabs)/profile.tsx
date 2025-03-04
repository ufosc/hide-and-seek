import { View, Text, SafeAreaView } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { Button } from "tamagui";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <SafeAreaView>
      <Text>Profile Screen</Text>
      {user && <Text>User ID: {user.id}</Text>}
      <Button size={"$5"} backgroundColor={"%primary"} onPress={signOut}>
        Sign Out
      </Button>
    </SafeAreaView>
  );
}
