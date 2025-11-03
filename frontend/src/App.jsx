// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";

// ✅ Components
import Navbar from "./Components/Navbar";
import NavbarOption2 from "./Components/NavbarOption2";
import Footer from "./Components/Footer";

// ✅ Pages / Components
import Home from "./Pages/Home"; // ✅ handles Hero / Hero2
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import About from "./Pages/AboutUs";
import Blog from "./Pages/Blog";
import FAQ from "./Pages/FAQ";
import Terms from "./Pages/TermsandConditions";
import Help from "./Pages/HelpCenter";
import Contact from "./Pages/ContactUs";
import Privacy from "./Pages/PrivacyPolicy";
import Community from "./Pages/Community";
import PricingPage from "./Pages/PricingPage";
import StudentDashboard from "./Pages/StudentDashboard";
import ErrorDashboard from "./Pages/ErrorDashboard";
import Quizdashboard from "./Pages/Quizdashboard";
import HtmlQuiz from "./Pages/HtmlQuiz";
import CssQuiz from "./Pages/CssQuiz";
import JsQuiz from "./Pages/JsQuiz";
import ReactjsQuiz from "./Pages/ReactjsQuiz";

// ✅ Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import { useAuth } from "./AuthContext";

// -------------------- Layout Wrapper --------------------
const LayoutWrapper = ({ children, onLoginClick }) => {
  const { currentUser } = useAuth();
  return (
    <>
      {currentUser ? <NavbarOption2 /> : <Navbar onLoginClick={onLoginClick} />}
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
};

// -------------------- App Routes --------------------
function AppRoutes({ onLoginClick }) {
  return (
    <Routes>
      {/* Home Route */}
      <Route
        path="/"
        element={
          <LayoutWrapper onLoginClick={onLoginClick}>
            <Home onLoginClick={onLoginClick} />
          </LayoutWrapper>
        }
      />

      {/* Public Routes */}
      <Route path="/about" element={<LayoutWrapper onLoginClick={onLoginClick}><About /></LayoutWrapper>} />
      <Route path="/blog" element={<LayoutWrapper onLoginClick={onLoginClick}><Blog /></LayoutWrapper>} />
      <Route path="/faq" element={<LayoutWrapper onLoginClick={onLoginClick}><FAQ /></LayoutWrapper>} />
      <Route path="/terms" element={<LayoutWrapper onLoginClick={onLoginClick}><Terms /></LayoutWrapper>} />
      <Route path="/help" element={<LayoutWrapper onLoginClick={onLoginClick}><Help /></LayoutWrapper>} />
      <Route path="/contact" element={<LayoutWrapper onLoginClick={onLoginClick}><Contact /></LayoutWrapper>} />
      <Route path="/privacy" element={<LayoutWrapper onLoginClick={onLoginClick}><Privacy /></LayoutWrapper>} />
      <Route path="/community" element={<LayoutWrapper onLoginClick={onLoginClick}><Community /></LayoutWrapper>} />
      <Route path="/pricingpage" element={<LayoutWrapper onLoginClick={onLoginClick}><PricingPage /></LayoutWrapper>} />

      {/* Protected Routes */}
      <Route
        path="/studentdashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/errordashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ErrorDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/quizdashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Quizdashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/htmlquiz"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <HtmlQuiz />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cssquiz"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CssQuiz />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/jsquiz"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <JsQuiz />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reactjsquiz"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ReactjsQuiz />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// -------------------- Main App --------------------
function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const openSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const closeModal = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen scroll-smooth">
          <AppRoutes onLoginClick={openLogin} />
          {showLogin && <Login closeModal={closeModal} switchToSignup={openSignup} />}
          {showSignup && <Signup closeModal={closeModal} switchToLogin={openLogin} />}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
