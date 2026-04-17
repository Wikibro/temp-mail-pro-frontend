

import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import AccountManager from "./components/AccountManager.jsx";
import Inbox from "./components/Inbox.jsx";
import EmailSidebar from "./components/EmailSidebar.jsx";
import EmailGenerator from "./components/EmailGenerator.jsx";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ErrorAlert from "./components/ErrorAlert";
import PromoCard from "./components/PromoCard.jsx";
import YesimRecommendation from "./components/YesimRecommendation.jsx";
import Landing from "./components/Landing.jsx";
import BlogList from "./components/BlogList";
import ScrollToTop from "./components/ScrollToTop";

const BlogPost = lazy(() => import("./components/BlogPost"));
const Privacy = lazy(() => import("./components/Privacy"));
const About = lazy(() => import("./components/About.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const RAW_API_BASE = import.meta.env.VITE_API_BASE || '';
const API_BASE = RAW_API_BASE.replace(/\/+$/, '');
const API_ROOT = API_BASE ? `${API_BASE}/api` : '/api';

// Duration constants for better maintainability
const DURATIONS = {
  "10min": 10 * 60 * 1000,
  "1hour": 60 * 60 * 1000,
  "24hour": 24 * 60 * 60 * 1000,
  "max": 3650 * 24 * 60 * 60 * 1000 // Approximately 10 years
};

// Polling intervals
const POLLING_INTERVALS = {
  FAST: 5000,     // 5 seconds
  NORMAL: 10000,  // 10 seconds
  SLOW: 30000     // 30 seconds
};

function TempMailApp({ onEmailCopied }) {
  const [account, setAccount] = useState(() => {
    const saved = localStorage.getItem("tempMailAccount");
    return saved ? JSON.parse(saved) : null;
  });
  const [generatedEmails, setGeneratedEmails] = useState(() => {
    const saved = localStorage.getItem("generatedEmails");
    return saved ? JSON.parse(saved) : [];
  });
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });
  const [emailDuration, setEmailDuration] = useState(() => {
    const saved = localStorage.getItem("emailDuration");
    return saved || "1hour";
  });
  const [pollingInterval, setPollingInterval] = useState(() => {
    const saved = localStorage.getItem("pollingInterval");
    return saved ? parseInt(saved) : POLLING_INTERVALS.NORMAL;
  });
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isInboxLoading, setIsInboxLoading] = useState(false);
  const [isBackgroundPolling, setIsBackgroundPolling] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [showExpiredCard, setShowExpiredCard] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [inboxCounts, setInboxCounts] = useState(() => {
    // Seed counts from localStorage cached messages
    const saved = localStorage.getItem('generatedEmails');
    if (!saved) return {};
    const emails = JSON.parse(saved);
    const counts = {};
    emails.forEach((e) => {
      const cached = localStorage.getItem(`inbox-${e.token}`);
      if (cached) counts[e.token] = JSON.parse(cached).length;
    });
    return counts;
  });

  const location = useLocation();
  const isAppPage = location.pathname === "/app";
  const currentUrl = `${window.location.origin}${location.pathname}`;

  // Use refs to access current state in intervals
  const accountRef = useRef(account);
  const pollingIntervalRef = useRef(pollingInterval);

  useEffect(() => {
    accountRef.current = account;
  }, [account]);

  useEffect(() => {
    pollingIntervalRef.current = pollingInterval;
  }, [pollingInterval]);

  // Add token expiration handler
  const handleTokenExpired = () => {
    setTokenValid(false);
    setError({ message: "Session expired. Please create a new email address." });
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.body.classList.toggle("dark-mode", newMode);
  };

  const setDuration = (duration) => {
    setEmailDuration(duration);
    localStorage.setItem("emailDuration", duration);
  };

  const setPollingSpeed = (speed) => {
    setPollingInterval(speed);
    localStorage.setItem("pollingInterval", speed.toString());
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (account) {
      localStorage.setItem("tempMailAccount", JSON.stringify(account));
      // Load messages from localStorage if available
      const savedMessages = localStorage.getItem(`inbox-${account.token}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      fetchInbox(true); // Initial load - show loading indicator
    }
  }, [account]);

  useEffect(() => {
    if (error?.message?.includes('expired')) {
      setTokenValid(false);
      // Clear any stored data for this token
      if (account) {
        localStorage.removeItem(`inbox-${account.token}`);
      }
    }
  }, [error, account]);

  useEffect(() => {
    localStorage.setItem("generatedEmails", JSON.stringify(generatedEmails));
  }, [generatedEmails]);

  useEffect(() => {
    if (account) {
      // Store only the last 20 messages to prevent localStorage bloat
      const limitedMessages = messages.slice(-20);
      localStorage.setItem(`inbox-${account.token}`, JSON.stringify(limitedMessages));
    }
  }, [messages, account]);

  // Auto-generate an email when on app page
  useEffect(() => {
    if (isAppPage && !account && generatedEmails.length === 0) {
      createNewAccount({ durationMs: 3600000 });
    }
  }, [isAppPage]);

  // Effect to check if email has expired and show the card
  useEffect(() => {
    if (!account?.expiration) return;

    const checkExpiration = () => {
      const now = new Date();
      const expiration = new Date(account.expiration);
      const isExpired = now > expiration;
      
      setTokenValid(!isExpired);
      setShowExpiredCard(isExpired);
      
      if (isExpired) {
        setError({ message: "Session expired. Please create a new email address." });
      }
    };

    // Check immediately
    checkExpiration();

    // Then check every minute
    const intervalId = setInterval(checkExpiration, 60000);
    
    return () => clearInterval(intervalId);
  }, [account]);
  const createNewAccount = async (options = {}) => {
    const isAuto = options === true;
    const customName = typeof options === 'object' ? options.customName : null;
    const durationMs = typeof options === 'object' && options.durationMs
      ? options.durationMs
      : DURATIONS['1hour'];

    setIsLoading(true);
    setError(null);
    setShowExpiredCard(false);
    setShowAddPanel(false);

    try {
      const body = customName ? { username: customName } : {};
      let res;
      if (customName) {
        try {
          res = await axios.post(`${API_ROOT}/accounts/create`, body);
        } catch (err) {
          // Backward compatibility: older backends may reject unknown payload fields.
          if (err.response?.status === 400 || err.response?.status === 422) {
            res = await axios.post(`${API_ROOT}/accounts/create`);
          } else {
            throw err;
          }
        }
      } else {
        res = await axios.post(`${API_ROOT}/accounts/create`);
      }
      const now = new Date();
      const expirationTime = new Date(now.getTime() + (isAuto ? DURATIONS['1hour'] : durationMs));
      const accountData = {
        ...res.data,
        expiration: expirationTime.toISOString(),
        createdAt: new Date().toISOString(),
      };
      setAccount(accountData);
      setTokenValid(true);
      const addr = accountData.address || accountData.email;
      if (addr && !generatedEmails.some(e => e.address === addr)) {
        setGeneratedEmails(prev => [...prev, {
          address: addr,
          expiration: accountData.expiration,
          createdAt: accountData.createdAt,
          token: accountData.token
        }]);
      }
      setMessages([]);
    } catch (err) {
      setError({ message: err.response?.data?.error || 'Account creation failed' });
      console.error('Account creation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchAccount = (emailAddress) => {
    const emailAccount = generatedEmails.find(e => e.address === emailAddress);
    if (emailAccount) {
      setAccount({
        address: emailAccount.address,
        email: emailAccount.address,
        expiration: emailAccount.expiration,
        token: emailAccount.token,
        createdAt: emailAccount.createdAt,
      });
      const cached = localStorage.getItem(`inbox-${emailAccount.token}`);
      setMessages(cached ? JSON.parse(cached) : []);
      setTokenValid(true);
      setShowExpiredCard(false);
    }
  };

  const deleteEmail = (emailAddress) => {
    setGeneratedEmails(prev => {
      const remaining = prev.filter(e => e.address !== emailAddress);
      const cur = accountRef.current;
      const curAddr = cur?.address || cur?.email;
      if (curAddr === emailAddress) {
        if (remaining.length > 0) {
          switchAccount(remaining[0].address);
        } else {
          setAccount(null);
          createNewAccount({ durationMs: 3600000 });
        }
      }
      return remaining;
    });
  };

  const fetchInbox = async (showLoading = false) => {
    if (!accountRef.current?.token) return;
    if (accountRef.current.expiration) {
      const now = new Date();
      const expiration = new Date(accountRef.current.expiration);
      if (now > expiration) {
        setTokenValid(false);
        setShowExpiredCard(true);
        setError({ message: 'Session expired. Please create a new email address.' });
        return;
      }
    }
    if (showLoading) setIsInboxLoading(true);
    else setIsBackgroundPolling(true);

    try {
      const res = await axios.get(`${API_ROOT}/inbox/${accountRef.current.token}`, {
        timeout: 10000
      });
      const inboxArray = Array.isArray(res.data) ? res.data : res.data?.messages || [];
      const limitedMessages = inboxArray.slice(-20);
      setMessages(limitedMessages);
      setInboxCounts(prev => ({ ...prev, [accountRef.current.token]: limitedMessages.length }));
      setError(null);
      setTokenValid(true);
    } catch (err) {
      let errorMessage = 'Failed to load inbox';
      if (err.code === 'ECONNABORTED') errorMessage = 'Request timeout. Please check your connection.';
      else if (err.response?.status === 401) { setTokenValid(false); setShowExpiredCard(true); errorMessage = 'Session expired. Please create a new email address.'; }
      else if (err.response?.data?.error) errorMessage = err.response.data.error;
      else if (err.message) errorMessage = err.message;
      console.error('Inbox fetch failed:', err);
      setError({ message: errorMessage });
    } finally {
      if (showLoading) setIsInboxLoading(false);
      else setTimeout(() => setIsBackgroundPolling(false), 300);
    }
  };

  useEffect(() => {
    let intervalId = null;
    if (account && tokenValid) {
      intervalId = setInterval(() => fetchInbox(false), pollingInterval);
    }
    return () => { if (intervalId) clearInterval(intervalId); };
  }, [account, pollingInterval, tokenValid]);

  return (
    <div className="container-fluid py-3 px-3 px-md-4">
      <Helmet>
        <title>{account ? `TempMail Pro - ${account.address || account.email}` : 'TempMail Pro - Free Temporary Email Service'}</title>
        <meta name="description" content={account ? `Your temporary email address is ${account.address || account.email}. Protect your inbox with TempMail Pro.` : 'Get free disposable email addresses with TempMail Pro. Protect your inbox from spam and stay secure.'} />
        <meta property="og:title" content={account ? `TempMail Pro - ${account.address || account.email}` : 'TempMail Pro - Free Temporary Email Service'} />
        <meta property="og:description" content={account ? `Your temporary email address is ${account.address || account.email}.` : 'Get free disposable email addresses with TempMail Pro.'} />
        <link rel="canonical" href={`https://tempmailpk.com${location.pathname}`} />
        <meta property="og:url" content={`https://tempmailpk.com${location.pathname}`} />
      </Helmet>

      {isBackgroundPolling && (
        <div className="background-polling-indicator">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Checking for new messages...</span>
          </div>
        </div>
      )}

      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {error && (
        <ErrorAlert error={error} setError={setError} onRetry={fetchInbox} />
      )}

      {/* Two-column layout — sidebar + main */}
      <div className="multi-inbox-layout">

        {/* ── Left Sidebar ── */}
        <EmailSidebar
          generatedEmails={generatedEmails}
          activeToken={account?.token}
          inboxCounts={inboxCounts}
          isCreating={isLoading}
          onSwitch={switchAccount}
          onDelete={deleteEmail}
          onCreateNew={() => setShowAddPanel(v => !v)}
        />

        {/* ── Main Content ── */}
        <div className="multi-inbox-main">

          {/* Generator: full-hero when no account, compact panel when adding */}
          {(!account || showAddPanel) && (
            <EmailGenerator
              onGenerate={(opts) => createNewAccount(opts)}
              isLoading={isLoading}
              compact={!!account}
            />
          )}

          {/* Active inbox view */}
          {account && !showAddPanel && (
            <>
              {showExpiredCard && (
                <div className="alert alert-warning d-flex align-items-center gap-2 mb-3">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>This email has expired. Use <strong>+ Add Inbox</strong> in the sidebar to create a new one.</span>
                </div>
              )}

              <AccountManager
                account={account}
                refreshInbox={() => fetchInbox(true)}
                onEmailCopied={onEmailCopied}
                isLoading={isLoading || isInboxLoading}
              />

              {!showExpiredCard && tokenValid && (
                <div className="mt-3">
                  <YesimRecommendation />
                </div>
              )}

              <Inbox
                messages={messages.map(msg => ({ ...msg, token: account.token }))}
                isLoading={isInboxLoading}
                onRetry={() => fetchInbox(true)}
                onTokenExpired={handleTokenExpired}
              />
            </>
          )}

          <Footer isDarkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const [showPromoCard, setShowPromoCard] = useState(false);
  const [promoClosed, setPromoClosed] = useState(() => localStorage.getItem("promoClosed") === "true");
  const shouldAutoShowPromo = location.pathname !== "/app";

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark-mode", savedDarkMode);
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

      <PromoCard
        visible={showPromoCard && !promoClosed && promotablePage}
        onClose={handlePromoClose}
      />
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
