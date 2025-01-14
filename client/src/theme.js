import { theme } from "@chakra-ui/react";
//import fonts
import "@fontsource/inter";
export default {
  ...theme,
  colors: {
    ...theme.colors,
    main: {
      50: "#ebf8ff",
      100: "#bee3f8",
      200: "#90cdf4",
      300: "#63b3ed",
      400: "#4299e1",
      500: "#3182ce",
      600: "#2b6cb0",
      700: "#2c5282",
      800: "#2a4365",
      900: "#1A365D",
    },

    secondary: {
      background: "#E0F2FE",
      link: "#4A5568",
      card: "#C5E1F0",
      inputHelper: "#90CAF9",
    },
    navItem: {
      50: "#0077cc", // Sea Blue
      100: "#EDF2F7",
      400: "#A0AEC0",
      500: "#000000", // Black
      600: "#000000", // Black
    },
  },
  fonts: {
    heading: "Georgia, serif",
    body: "Georgia, serif",
  },
  styles: {
    global: {
      'html, body': {
        width: '100%',
        height: '100%',
      //  overflow: 'hidden', // Prevent scrolling
        margin: 0, // Remove default margin
        padding: 0, // Remove default padding
      },
      '#root': {
        height: '100%', // Ensure the root element also takes full height
      },
    },
  },
};