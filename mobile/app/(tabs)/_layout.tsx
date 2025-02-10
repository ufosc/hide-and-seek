import { Tabs } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";

export default function TabLayout() {
  const session = useAuthStore((state) => state.session);

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
