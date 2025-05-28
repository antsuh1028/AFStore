import { Box, ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import ContactPage from "./pages/Contact";
import TermsAndPolicies from "./pages/Terms";
import {PackingPage, FAQPage, B2BPage, DealPage, HowToOrderPage, MarinatedPage} from "./pages/wholesale"
import theme from "./theme";
import "./fonts.css"; 

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Box minH="100vh" bg="#f9f9f9">
          {/* <Navbar /> */}
          <Box as="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/wholesale/packing" element={<PackingPage />} />
              <Route path="/wholesale/faq" element={<FAQPage />} />
              <Route path="/wholesale/b2b" element={<B2BPage />} />
              <Route path="/wholesale/how-to-order" element={<HowToOrderPage />} />
              <Route path="/wholesale/deal" element={<DealPage />} />
              <Route path="/wholesale/marinated" element={<MarinatedPage />} />
              <Route path="/terms-and-policies" element={<TermsAndPolicies />} />

              {/* <Route path="/contact" element={<ContactPage />} /> */}
              {/* Add more routes as needed */}
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;