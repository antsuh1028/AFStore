import { Box, ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ContactPage from "./pages/Contact";
import TermsAndPolicies from "./pages/Terms";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AgreementGate from "./pages/AgreementGate";
import UserProfile from "./pages/users/Profile";
import {
  PackingPage,
  FAQPage,
  B2BPage,
  DealPage,
  HowToOrderPage,
  MarinatedPage,
  ProcessedPage,
  UnprocessedPage,
  AdamsGourmetPage,
  AllProductsPage,
} from "./pages/wholesale";
import ProductDetailPage from "./components/shop/ProductDetails";
import OrderSummaryPage from "./pages/OrderSummary";
import AdminDashboard from "./pages/AdminDashboard";
import theme from "./theme";
import "./fonts.css";
import { AuthProvider } from "./hooks/useAuth";
import CookieConsentBanner from "./components/CookieConsentBanner";

function App() {
  const [showCookieConsent, setShowCookieConsent] = useState(() => {
    return localStorage.getItem("cookieAgreement") !== "accepted";
  });
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Box minH="100vh" display="flex" flexDirection="column" bg="#f9f9f9">
            <Box as="main" flex="1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/wholesale/packing" element={<PackingPage />} />
                <Route path="/wholesale/faq" element={<FAQPage />} />
                <Route path="/wholesale/b2b" element={<B2BPage />} />
                <Route
                  path="/wholesale/how-to-order"
                  element={<HowToOrderPage />}
                />
                <Route path="/wholesale/deal" element={<DealPage />} />
                <Route
                  path="/wholesale/marinated"
                  element={<MarinatedPage />}
                />
                <Route
                  path="/terms-and-policies"
                  element={<TermsAndPolicies />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signup/agreements" element={<AgreementGate />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/wholesale/product/:productId"
                  element={<ProductDetailPage />}
                />
                <Route
                  path="/wholesale/processed"
                  element={<ProcessedPage />}
                />
                <Route
                  path="/wholesale/unprocessed"
                  element={<UnprocessedPage />}
                />
                <Route
                  path="/wholesale/adams-gourmet"
                  element={<AdamsGourmetPage />}
                />
                <Route
                  path="/wholesale/shop-all"
                  element={<AllProductsPage />}
                />
                {/* <Route path="/cart" element={<CartPage />} /> */}
                <Route path="/order-summary" element={<OrderSummaryPage />} />
                <Route path="/profile/user/:userId" element={<UserProfile />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Routes>
              {showCookieConsent && (
                <CookieConsentBanner
                  onAccept={() => setShowCookieConsent(false)}
                />
              )}
            </Box>
          </Box>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
