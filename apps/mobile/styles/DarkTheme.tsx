import type { Theme } from "@react-navigation/native";
import { fonts } from "@react-navigation/native/src/theming/fonts";

// these values are only included for the react navigation components that require a separate theme file
// For styling your components, use the tailwind.config.js file and edit the colors there
export const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: "rgb(10, 132, 255)",
    background: "#1E252F",
    card: "#1D162E",
    text: "rgb(229, 229, 231)",
    border: "#616161",
    notification: "rgb(255, 69, 58)",
  },
  fonts,
};
