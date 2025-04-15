import { Tabs, Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { Image } from "react-native";

export default function TabLayout() {
  const session = useAuthStore((state) => state.session);

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === "index") {
            iconSource = require("@/assets/images/homeIcon.png");
            } else if (route.name === "create-game") {
            iconSource = require("@/assets/images/createIcon.png");
            } else if (route.name === "list-games") {
            iconSource = require("@/assets/images/listIcon.png");
            } else if (route.name === "profile") {
            iconSource = require("@/assets/images/profileIcon.png");
            }

          return (
            <Image
              source={iconSource}
              style={{ width: size, height: size, tintColor: color }}
            />
          );
        },
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="create-game"
        options={{
          title: "Create",
        }}
      />
      <Tabs.Screen
        name="list-games"
        options={{
          title: "List",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="hider-actions"
        options={{
          title: "Actions",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}