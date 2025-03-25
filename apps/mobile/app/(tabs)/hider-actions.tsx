import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HiderActions: React.FC = () => {
  return (
    <SafeAreaView className="my-4 mx-4 flex flex-col">
      <Text>Hider Actions Page</Text>

      <TouchableOpacity className="bg-card px-3 py-2 items-center">
        <Text className="text-white">Hider Actions</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HiderActions;
