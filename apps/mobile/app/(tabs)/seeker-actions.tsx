import React from "react";
import { Text, SafeAreaView } from "react-native";
import Button from "@/components/ui/button";
import CurseCarousel from "@/components/CurseCarousel";

const HiderActions: React.FC = () => {
  return (
    <SafeAreaView className="my-4 mx-4 flex flex-col gap-8 h-full items-center ">
      <Text className="text-white text-center text-3xl">Curse Cards</Text>
      <CurseCarousel cards={hiderCards} />
      <Button className="bg-primary">Cast Curse</Button>
    </SafeAreaView>
  );
};

export default HiderActions;
