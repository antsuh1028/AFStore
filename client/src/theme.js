import { extendTheme } from "@chakra-ui/react";


const theme = extendTheme({
  fonts: {
    heading: "'Suit', sans-serif",
    body: "'Suit', sans-serif",
    button: "'Suit', sans-serif",
    mono: "'Suit', monospace", 
  },
  styles: {
    global: {
      body: {
        fontFamily: "'Suit', sans-serif",
      },
      "h1, h2, h3, h4, h5, h6": {
        fontFamily: "'Suit', sans-serif",
      },
    },
  },
});

export default theme;
