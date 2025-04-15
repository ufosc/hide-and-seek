import * as React from "react";
import { Dimensions, View, Text } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const window = Dimensions.get("window");

const hiderCards = [
  {
    title: "Curse of the impressionable consumer",
    content: "This is the content for card 1",
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

const renderItem =
  () =>
  ({ item, index }) => {
    return (
      <View
        key={index}
        className="flex-1 justify-center bg-white rounded-lg items-center flex-col gap-3"
      >
        <Text className="font-bold text-4xl">{item.title}</Text>
        <Text>{item.content}</Text>
        <Text>{item.price}</Text>
      </View>
    );
  };

function Index() {
  const progress = useSharedValue<number>(0);

  return (
    <View id="carousel-component">
      <Carousel
        data={hiderCards}
        height={258}
        loop={false}
        pagingEnabled={true}
        snapEnabled={true}
        width={window.width}
        style={{
          width: window.width,
        }}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        onProgressChange={progress}
        renderItem={renderItem()}
      />
    </View>
  );
}

export default Index;
