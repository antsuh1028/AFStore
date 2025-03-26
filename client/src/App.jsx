import { Box } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import { ContactPage } from "./pages/Contact";
import PackingPage from "./pages/wholesale/Packing";

function App() {
  return (
    <BrowserRouter>
      <Box minH="100vh">
        <Navbar />
        <Box as="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/wholesale/packing" element={<PackingPage />} />
            <Route path="/wholesale/faq" element={<ContactPage />} />
            {/* <Route path="/contact" element={<ContactPage />} /> */}
            {/* Add more routes as needed */}
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
