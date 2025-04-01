import * as React from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const window = Dimensions.get("window");

const defaultDataWith6Colors = [
  "#B0604D",
  "#899F9C",
  "#B3C680",
  "#5C6265",
  "#F5D399",
  "#F1F1F1",
];

const renderItem =
  ({ rounded }) =>
  ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: item,
          borderRadius: rounded ? 10 : 0,
        }}
      />
    );
  };

function Index() {
  const progress = useSharedValue<number>(0);

  return (
    <View
      id="carousel-component"
      dataSet={{ kind: "basic-layouts", name: "parallax" }}
    >
      <Carousel
        autoPlayInterval={2000}
        data={defaultDataWith6Colors}
        height={258}
        loop={true}
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
        renderItem={renderItem({ rounded: true })}
      />
    </View>
  );
}

export default Index;
