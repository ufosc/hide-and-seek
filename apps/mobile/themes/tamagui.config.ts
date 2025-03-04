import { createTamagui } from "tamagui";
import { tokens } from "@tamagui/themes";

const config = createTamagui({
  tokens: {
    ...tokens,
    color: {
      ...tokens.color,
      lightBlue: "#5982FF",
      secondary: "#EF4444",
      background: "#101318",
      lightGray: "#C7C7C7",
    },
  },
  themes: {
    dark: {
      background: "$background",
      color: "$lightGray", // text color
      primary: "$lightBlue",
    },
  },
});

export default config;
