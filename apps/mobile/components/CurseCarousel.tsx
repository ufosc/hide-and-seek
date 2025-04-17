import * as React from "react";
import { Dimensions, View, Text } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const window = Dimensions.get("window");

export interface CurseCardProps {
  cards: {
    title?: string;
    content?: string;
    price?: string;
  }[];
}

const renderItem =
  () =>
  ({ item, index }) => {
    return (
      <View
        key={index}
        className="justify-start bg-white rounded-xl items-start flex-col gap-9 h-full px-10 py-20"
      >
        <Text className="font-bold text-3xl">{item.title}</Text>
        <Text className="text-xl">{item.content}</Text>
        <Text className="text-xl font-bold">Casting Cost: {item.price}</Text>
      </View>
    );
  };

function CurseCarousel({ cards }: CurseCardProps) {
  const progress = useSharedValue<number>(0);

  return (
    <View id="carousel-component" className="h-4/5">
      <Carousel
        data={cards}
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

export default CurseCarousel;
