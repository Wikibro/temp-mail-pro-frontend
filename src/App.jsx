import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import ScrollToTop from "./components/ScrollToTop";
import Landing from "./components/Landing.jsx";

const TempMailApp = lazy(() => import("./components/TempMailApp.jsx"));
const PromoCard = lazy(() => import("./components/PromoCard.jsx"));
const BlogList = lazy(() => import("./components/BlogList"));
const BlogPost = lazy(() => import("./components/BlogPost"));
const Privacy = lazy(() => import("./components/Privacy"));
const About = lazy(() => import("./components/About.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function AppContent() {
  const location = useLocation();
  const [showPromoCard, setShowPromoCard] = useState(false);
  const [promoClosed, setPromoClosed] = useState(() => localStorage.getItem("promoClosed") === "true");
  const shouldAutoShowPromo = location.pathname !== "/app";

  useEffect(() => {
    document.body.classList.remove("dark-mode");
    localStorage.removeItem("darkMode");
  }, []);

  const promotablePage = ["/", "/blog"].includes(location.pathname) ||
    location.pathname.startsWith("/blog/") ||
    location.pathname === "/app";

  useEffect(() => {
    if (!promotablePage || promoClosed || !shouldAutoShowPromo) {
      return undefined;
    }

    const timer = setTimeout(() => setShowPromoCard(true), 7000);
    return () => clearTimeout(timer);
  }, [promotablePage, promoClosed, shouldAutoShowPromo]);

  const handlePromoClose = () => {
    setShowPromoCard(false);
    setPromoClosed(true);
    localStorage.setItem("promoClosed", "true");
  };

  const handleEmailCopied = () => {
    if (!promoClosed) {
      setShowPromoCard(true);
    }
  };

  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="container py-5">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "40vh" }}>
              <div className="spinner-border text-primary" role="status" aria-label="Loading page">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<TempMailApp onEmailCopied={handleEmailCopied} />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog" element={<BlogList showSEO={true} />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <PromoCard
          visible={showPromoCard && !promoClosed && promotablePage}
          onClose={handlePromoClose}
        />
      </Suspense>
    </>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container my-5">
          <div className="alert alert-danger">
            <h2>Something went wrong.</h2>
            <p>{this.state.error?.message || "An unexpected error occurred"}</p>
            <button
              className="btn btn-primary"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App component without useLocation
function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <AppContent />
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
