import { View, SafeAreaView, Text } from "react-native";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/ui/button";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <SafeAreaView>
      <Text>Profile Screen</Text>
      {user && <Text>User ID: {user.id}</Text>}
      <View>
        <Button onPress={signOut}>Sign Out</Button>
      </View>
    </SafeAreaView>
  );
}
