import { View, SafeAreaView } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <SafeAreaView>
      <Text>Profile Screen</Text>
      {user && <Text>User ID: {user.id}</Text>}
      <View>
        <Button onPress={signOut}>
          <Text>Sign Out</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
