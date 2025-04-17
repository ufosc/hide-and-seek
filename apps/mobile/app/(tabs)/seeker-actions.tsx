import React from "react";
import { Text, SafeAreaView, View } from "react-native";
import Button from "@/components/ui/button";
import CurseCarousel from "@/components/CurseCarousel";
import SeekerCategoryButton from "@/components/SeekerCategoryButton";

const SeekerActions: React.FC = () => {
  return (
    <SafeAreaView className="my-4 mx-4 flex flex-col gap-8 h-full items-center ">
      <Text className="text-white text-center text-3xl">Seeker Actions</Text>
      <Button className="bg-primary">Cast Curse</Button>
      <View className="flex flex-row justify-around w-full">
        <SeekerCategoryButton
          icon={<Text className="text-white text-2xl">🔍</Text>}
          onPress={() => console.log("press")}
          size={80}
          className="mb-4"
          text="Matching"
        />
        <SeekerCategoryButton
          icon={<Text className="text-white text-2xl">🔍</Text>}
          onPress={() => console.log("press")}
          size={80}
          className="mb-4"
          text="Measuring"
        />
        <SeekerCategoryButton
          icon={<Text className="text-white text-2xl">🔍</Text>}
          onPress={() => console.log("press")}
          size={80}
          className="mb-4"
          text="Thermometer"
        />
      </View>
    </SafeAreaView>
  );
};

export default SeekerActions;
