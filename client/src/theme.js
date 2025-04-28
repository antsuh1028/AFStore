import { extendTheme } from "@chakra-ui/react";

// Consolidated theme with SUIT-Regular font for all components
const theme = extendTheme({
  fonts: {
    heading: "'SUIT-Regular', sans-serif",
    body: "'SUIT-Regular', sans-serif",
    button: "'SUIT-Regular', sans-serif",
    mono: "'SUIT-Regular', sans-serif",
  },
  styles: {
    global: {
      body: {
        fontFamily: "'SUIT-Regular', sans-serif",
      },
      "h1, h2, h3, h4, h5, h6": {
        fontFamily: "'SUIT-Regular', sans-serif",
      },
    },
  },
});

export default theme;