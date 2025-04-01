import CurseCard from "@/components/CurseCard";
import Button from "@/components/ui/button";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HiderActions: React.FC = () => {
  return (
    <SafeAreaView className="my-4 mx-4 flex flex-col gap-8 h-full items-center ">
      <Text className="text-white text-center text-3xl">Curse Cards</Text>
      <CurseCard
        title="Curse of the impressionable consumer"
        description="Seekers must enter and gain admission (if applicable) to a location or buy a product that they saw an advertisement for before asking another question.

This advertisement must be found out in the world, not on a seker’s device, and must be at least 100 feet from the product or location itself."
        castingCost="The seekers' next question is free"
      />
      <Button className="bg-primary">Cast Curse</Button>
    </SafeAreaView>
  );
};

export default HiderActions;
