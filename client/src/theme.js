import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "'Suit', sans-serif",
    body: "'Suit', sans-serif",
  },
  styles: {
    global: {
      "*": {
        fontFamily: "'Suit', sans-serif !important",
      },
    },
  },
});

export default theme;