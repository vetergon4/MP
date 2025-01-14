// Sidebar.styled.js
import { mode } from "@chakra-ui/theme-tools";

const styles = {
  baseStyle: (minimized) => ({
    bg: mode("#004080", "#f7fafc")({}), // Pass an empty object as props
    color: "white",
    transition: "width 0.3s",
    width: minimized ? "5%" : "16%", // Adjust the width based on the minimized state
  }),
  minimizedStyle: {
    width: "2%",
  },
  buttonStyle: {
    bg: "transparent",
    color: "white",
    _hover: {
      bg: mode("gray.500", "gray.200")({}), // Pass an empty object as props
    },
    padding: "0.5rem", // Adjust the padding to make buttons smaller
    fontSize: "sm", // Adjust the font size to make text smaller
  },
};

export default styles;
