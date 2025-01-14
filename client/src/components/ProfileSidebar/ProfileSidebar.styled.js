import { mode } from "@chakra-ui/theme-tools";

const styles = {
  baseStyle: {
    bg: mode("#004080", "#f7fafc")({}),
    color: "white",
    width: "100%",
    height: "60px", // Fixed height for the navbar
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyle: {
    bg: "transparent",
    color: "white",
    _hover: {
      bg: mode("gray.500", "gray.200")({}),
    },
    padding: "0.5rem", // Adjust the padding to make buttons smaller
    fontSize: "sm", // Adjust the font size to make text smaller
  },
};

export default styles;
