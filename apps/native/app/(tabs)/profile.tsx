import { View, Text, Button, SafeAreaView } from "react-native";
import { useAuthStore } from "@/store/authStore";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <SafeAreaView>
      <Text>Profile Screen</Text>
      {user && <Text>User ID: {user.id}</Text>}
      <Button title="Sign Out" onPress={signOut} />
    </SafeAreaView>
  );
}
