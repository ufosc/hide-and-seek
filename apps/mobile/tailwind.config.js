const { hairlineWidth } = require("nativewind/theme");

// Define base colors first
export const grayColors = {
  100: "#f7f7f8",
  200: "#e4e5e7",
  300: "#d2d3d5",
  400: "#a7a9ac",
  500: "#616161",
  600: "#525558",
  700: "#3b3e40",
  800: "#252729",
  900: "#101214",
};

export const blueColors = {
  100: "#e6f1fe",
  200: "#c0dcfd",
  300: "#9ac7fc",
  400: "#549bf9",
  500: "#0f6ef7",
  600: "#0d5bc7",
  700: "#0a4797",
  800: "#083467",
  900: "#052037",
};

export const greenColors = {
  100: "#e6f9e6",
  500: "#32cd32",
  600: "#28a745",
  700: "#218838",
};

export const redColors = {
  100: "#ffece6",
  500: "#ff4500",
  600: "#dc3545",
  700: "#c82333",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Base color palette
        gray: grayColors,
        blue: blueColors,
        green: greenColors,
        red: redColors,

        // Semantic colors - reference the base colors
        primary: blueColors[500],
        secondary: grayColors[500],

        accent: greenColors[500],
        success: greenColors[600],
        error: redColors[500],
        danger: redColors[600],
        warning: redColors[500],
        info: blueColors[400],

        // Text and background
        textPrimary: grayColors[100],
        textSecondary: grayColors[300],
        background: grayColors[100],

        // Other UI elements
        border: grayColors[500],
        card: grayColors[600],
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  plugins: [],
};
