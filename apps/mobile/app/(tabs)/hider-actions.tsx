import CurseCarousel from "@/components/CurseCarousel";
import Button from "@/components/ui/button";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const hiderCards = [
  {
    title: "Curse of the impressionable consumer",
    content:
      "Seekers must enter and gain admission (if applicable) to a location or buy a product that they saw an advertisement for before asking another question.\n\nThis advertisement must be found out in the world, not on a seker’s device, and must be at least 100 feet from the product or location itself.",
    price: "You must wait before using your next curse",
  },
  {
    title: "Curse of DnD",
    content: "This is the content for card 2",
    price: "",
  },
  { title: "Card 3", content: "This is the content for card 3", price: "" },
  {
    title: "Card 4",
    content: "This is the content for card 4",
    price: "Next question is free",
  },
  {
    title: "Card 5",
    content: "This is the content for card 5",
    price: "Next question is free",
  },
];

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
