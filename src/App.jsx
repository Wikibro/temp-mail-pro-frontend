

import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

import AccountManager from "./components/AccountManager.jsx";

import Inbox from "./components/Inbox.jsx";
import MainPage from "./components/MainPage";
import FAQSection from "./components/FAQSection";
import BlogList from "./components/BlogList";
import BlogPost from "./components/BlogPost";
import Privacy from "./components/Privacy";

import "./index.css";

const API_BASE = import.meta.env.VITE_API_BASE;

// Error Boundary Component
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
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details>
            <summary>Error Details</summary>
            <p>{this.state.error?.toString()}</p>
          </details>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Inbox Component
function Inbox({ messages, markAsRead, markAllAsRead, unreadCount, token, isLoading }) {
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [messageContent, setMessageContent] = useState(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [contentError, setContentError] = useState(null);

  useEffect(() => {
    if (selectedMsg && token) {
      setIsLoadingContent(true);
      setContentError(null);
      
      axios
        .get(`${API_BASE}/inbox/content/${selectedMsg.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000
        })
        .then((res) => {
          if (res.data && (res.data.text || res.data.html)) {
            setMessageContent(res.data);
          } else {
            setContentError("No content available for this message");
            setMessageContent(null);
          }
        })
        .catch((err) => {
          console.error("Error fetching message content:", err);
          setContentError(`Failed to load content: ${err.response?.data?.error || err.message}`);
          setMessageContent(null);
        })
        .finally(() => setIsLoadingContent(false));
    }
  }, [selectedMsg, token]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return "Invalid date";
    }
  };

  const getEmailAddress = (emailObj) => {
    if (!emailObj) return 'Unknown sender';
    if (typeof emailObj === 'string') return emailObj;
    if (emailObj.address) return emailObj.address;
    if (Array.isArray(emailObj) && emailObj[0]?.address) return emailObj[0].address;
    return 'Unknown sender';
  };

  if (isLoading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading messages...</span>
          </div>
          <p className="mt-2 text-muted">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <h5 className="text-muted">Your inbox is empty</h5>
          <p className="text-muted">Emails will appear here automatically</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Inbox ({messages.length})</h5>
          {unreadCount > 0 && (
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={markAllAsRead}
            >
              Mark all as read ({unreadCount} unread)
            </button>
          )}
        </div>
        <div className="list-group list-group-flush">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`list-group-item list-group-item-action py-3 ${!msg.isRead ? 'unread-message' : ''}`}
              onClick={() => {
                setSelectedMsg(msg);
                if (!msg.isRead) {
                  markAsRead(msg.id);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="message-item d-flex align-items-center">
                <div className="message-icon me-3 d-flex justify-content-center align-items-center bg-primary text-white rounded-circle" 
                  style={{ width: 40, height: 40, fontSize: '1rem', fontWeight: 'bold' }}>
                  {getEmailAddress(msg.from)[0].toUpperCase()}
                </div>
                <div className="message-content flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="message-subject fw-bold text-truncate me-2">
                      {msg.subject || '(No Subject)'}
                      {!msg.isRead && <span className="ms-2 badge bg-primary">New</span>}
                    </div>
                    <small className="text-muted text-nowrap">{formatDate(msg.createdAt)}</small>
                  </div>
                  <div className="message-preview text-muted small text-truncate">
                    From: {getEmailAddress(msg.from)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMsg && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          onClick={() => {
            setSelectedMsg(null);
            setMessageContent(null);
            setContentError(null);
          }}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedMsg.subject || '(No Subject)'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setSelectedMsg(null);
                    setMessageContent(null);
                    setContentError(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <p>
                    <strong>From:</strong>{' '}
                    {getEmailAddress(selectedMsg.from)}
                  </p>
                  <p>
                    <strong>To:</strong>{' '}
                    {getEmailAddress(selectedMsg.to)}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(selectedMsg.createdAt)}
                  </p>
                </div>

                <div className="border-top pt-3">
                  {isLoadingContent ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p>Loading message content...</p>
                    </div>
                  ) : contentError ? (
                    <div className="alert alert-warning">
                      <p>{contentError}</p>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                          setSelectedMsg(selectedMsg);
                          setContentError(null);
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  ) : messageContent?.html ? (
                    <div
                      className="email-html-content"
                      dangerouslySetInnerHTML={{ __html: messageContent.html }}
                    />
                  ) : messageContent?.text ? (
                    <pre className="email-text-content p-3 bg-light rounded">
                      {messageContent.text}
                    </pre>
                  ) : (
                    <div className="text-center py-4 text-muted">
                      <p>No message content available</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedMsg(null);
                    setMessageContent(null);
                    setContentError(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Enhanced Email Card Component
const EmailCard = ({ email, expiration, isActive = false, onDelete, onSwitch, messageCount = 0, unreadCount = 0 }) => {
  const formatTimeRemaining = (expirationDate) => {
    const now = new Date();
    const expiry = new Date(expirationDate);
    const diffMs = expiry - now;
    
    if (diffMs <= 0) return "Expired";
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
  };

  return (
    <div className={`card h-100 email-card ${isActive ? 'border-primary shadow' : ''}`}>
      <div className="card-body d-flex flex-column">
        {/* Email address with copy button */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1 me-2">
            <h6 className="card-title text-truncate mb-1" title={email}>{email}</h6>
            <small className="text-muted">Click to copy</small>
          </div>
          {onDelete && (
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={onDelete}
              title="Delete this email"
            >
              <i className="bi bi-trash"></i>
            </button>
          )}
        </div>
        
        {/* Stats */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-muted">Expires:</small>
          <small className={expiration && new Date(expiration) < new Date() ? 'text-danger fw-bold' : 'text-success'}>
            {expiration ? formatTimeRemaining(expiration) : 'Unknown'}
          </small>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-muted">Messages:</small>
          <span className={`badge ${unreadCount > 0 ? 'bg-primary' : 'bg-secondary'}`}>
            {messageCount} {unreadCount > 0 && `(${unreadCount} unread)`}
          </span>
        </div>
        
        {/* Action buttons */}
        <div className="d-flex gap-2 mt-auto">
          <button 
            className="btn btn-sm btn-outline-primary flex-fill"
            onClick={copyToClipboard}
            title="Copy email address"
          >
            <i className="bi bi-clipboard me-1"></i> Copy
          </button>
          
          {!isActive && onSwitch && (
            <button 
              className="btn btn-sm btn-primary flex-fill"
              onClick={onSwitch}
              title="Switch to this email"
            >
              <i className="bi bi-envelope me-1"></i> Use
            </button>
          )}
          
          {isActive && (
            <span className="badge bg-success w-100 py-2 d-flex align-items-center justify-content-center">
              <i className="bi bi-check-circle me-1"></i> Active
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  const [account, setAccount] = useState(() => {
    const saved = localStorage.getItem("tempMailAccount");
    return saved ? JSON.parse(saved) : null;
  });

  const [savedAccounts, setSavedAccounts] = useState(() => {
    const saved = localStorage.getItem("tempMailSavedAccounts");
    return saved ? JSON.parse(saved) : [];
  });

  const [preGeneratedAccounts, setPreGeneratedAccounts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [activeTab, setActiveTab] = useState("inbox");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [emailDuration, setEmailDuration] = useState(() => {
    const saved = localStorage.getItem("emailDuration");
    return saved || "1hour";
  });
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [stats, setStats] = useState(() => {
    const s = localStorage.getItem("tempMailStats");
    return s ? JSON.parse(s) : { emailsCreated: 0, messagesReceived: 0 };
  });

  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const inboxRef = useRef(null);
  
  // Refs for cleanup
  const timeoutRefs = useRef(new Set());
  const intervalRefs = useRef(new Set());
  const isMounted = useRef(true);

  // Setup and cleanup
  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
      
      // Cleanup all timeouts
      timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutRefs.current.clear();
      
      // Cleanup all intervals
      intervalRefs.current.forEach(intervalId => clearInterval(intervalId));
      intervalRefs.current.clear();
    };
  }, []);

  // Helper function to set timeout with cleanup
  const setSafeTimeout = useCallback((callback, delay) => {
    const id = setTimeout(() => {
      timeoutRefs.current.delete(id);
      callback();
    }, delay);
    
    timeoutRefs.current.add(id);
    return id;
  }, []);

  // Helper function to set interval with cleanup
  const setSafeInterval = useCallback((callback, delay) => {
    const id = setInterval(callback, delay);
    intervalRefs.current.add(id);
    return id;
  }, []);

  // persist core things
  useEffect(() => {
    localStorage.setItem("tempMailStats", JSON.stringify(stats));
  }, [stats]);
  
  useEffect(() => {
    localStorage.setItem("tempMailSavedAccounts", JSON.stringify(savedAccounts));
  }, [savedAccounts]);
  
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", String(next));
  };

  const setDuration = (duration) => {
    setEmailDuration(duration);
    localStorage.setItem("emailDuration", duration);
    setShowMobileMenu(false);
  };

  const calculateExpiryTime = useCallback((expiryChoice = emailDuration) => {
    const now = Date.now();
    switch (expiryChoice) {
      case "10min": return now + 10 * 60 * 1000;
      case "1hour": return now + 60 * 60 * 1000;
      case "24hour": return now + 24 * 60 * 60 * 1000;
      case "max": return now + 3650 * 24 * 60 * 60 * 1000; // 10 years
      default: return now + 60 * 60 * 1000;
    }
  }, [emailDuration]);

  const formatExpiryType = useCallback((t) => {
    return t === "short" ? "10 minutes" : t === "medium" ? "1 hour" : "24 hours";
  }, []);

  const timeLeft = useCallback((ms) => {
    if (!ms) return "∞";
    
    const diff = ms - Date.now();
    if (diff <= 0) return "Expired";
    
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }, []);

  // Pre-generate accounts
  const preGenerateAccounts = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      const res = await axios.post(`${API_BASE}/accounts/create`);
      
      if (!isMounted.current) return;
      
      const acc = { 
        ...res.data, 
        createdAt: Date.now(), 
        expiry: calculateExpiryTime(), 
        expiryType: emailDuration 
      };
      
      setPreGeneratedAccounts(p => [...p, acc]);
    } catch (err) {
      if (isMounted.current) {
        console.error("pre-gen failed", err);
      }
    }
  }, [calculateExpiryTime, emailDuration]);

  // Auto-generate an email on first visit
  useEffect(() => {
    if (isHomePage && !account && preGeneratedAccounts.length === 0) {
      preGenerateAccounts();
    }
  }, [isHomePage, account, preGenerateAccounts, preGeneratedAccounts.length]);

  // Clean up expired emails periodically
  useEffect(() => {
    const cleanupInterval = setSafeInterval(() => {
      const now = new Date();
      setPreGeneratedAccounts(prev => 
        prev.filter(acc => !acc.expiry || new Date(acc.expiry) > now)
      );
      setSavedAccounts(prev => 
        prev.filter(acc => !acc.expiry || new Date(acc.expiry) > now)
      );
    }, 60000);

    return () => clearInterval(cleanupInterval);
  }, [setSafeInterval]);

  const createNewAccount = useCallback(async (usePreGenerated = false) => {
    if (!isMounted.current) return;
    
    setIsLoading(true); 
    setError(null);
    
    try {
      let accountData;
      
      if (usePreGenerated && preGeneratedAccounts.length > 0) {
        accountData = preGeneratedAccounts[0];
        setPreGeneratedAccounts(p => p.slice(1));
        setSafeTimeout(preGenerateAccounts, 900);
      } else {
        const res = await axios.post(`${API_BASE}/accounts/create`);
        accountData = { 
          ...res.data, 
          createdAt: Date.now(), 
          expiry: calculateExpiryTime(), 
          expiryType: emailDuration 
        };
      }

      setAccount(accountData);
      localStorage.setItem("tempMailAccount", JSON.stringify(accountData));
      setMessages([]);
      setActiveTab("inbox");

      // Save to savedAccounts
      setSavedAccounts(prev => [accountData, ...prev]);
      setStats(s => ({ ...s, emailsCreated: s.emailsCreated + 1 }));
    } catch (err) {
      if (isMounted.current) {
        setError({ message: err.response?.data?.error || "Account creation failed" });
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [preGeneratedAccounts, calculateExpiryTime, emailDuration, preGenerateAccounts, setSafeTimeout]);

  const fetchInbox = useCallback(async () => {
    if (!account?.token || !isMounted.current) return;
    
    try {
      const res = await axios.get(`${API_BASE}/inbox/${account.token}`);
      const inboxArray = Array.isArray(res.data) ? res.data : res.data?.messages || [];
      
      if (isMounted.current) {
        setMessages(inboxArray);
        setError(null);
        setStats(prev => ({ ...prev, messagesReceived: prev.messagesReceived + inboxArray.length }));
      }
    } catch (err) {
      if (!isMounted.current) return;
      
      let errorMessage = err.response?.data?.error || "Failed to load inbox";
      if (errorMessage.includes("expired") || err.response?.status === 401) {
        errorMessage = "Session expired. Please create a new email address.";
        localStorage.removeItem("tempMailAccount");
        setAccount(null);
        
        if (preGeneratedAccounts.length > 0) { 
          setAccount(preGeneratedAccounts[0]); 
          setPreGeneratedAccounts(p => p.slice(1)); 
          setSafeTimeout(preGenerateAccounts, 1000); 
        } else if (savedAccounts.length > 0) {
          setAccount(savedAccounts[0]);
        }
      }
      
      setError({ message: errorMessage });
    }
  }, [account, preGeneratedAccounts, preGenerateAccounts, savedAccounts, setSafeTimeout]);

  useEffect(() => {
    if (!account || !autoRefresh) return;
    
    const id = setSafeInterval(fetchInbox, 5000);
    return () => clearInterval(id);
  }, [account, autoRefresh, fetchInbox, setSafeInterval]);

  // expiry purge
  useEffect(() => {
    const id = setSafeInterval(() => {
      const now = Date.now();
      
      if (account?.expiry && now > account.expiry) {
        setError({ message: "Email expired. Create a new one." });
        localStorage.removeItem("tempMailAccount");
        setAccount(null); 
        setMessages([]);
      }
      
      setSavedAccounts(prev => prev.filter(acc => !acc.expiry || now < acc.expiry));
      setPreGeneratedAccounts(prev => prev.filter(acc => !acc.expiry || now < acc.expiry));
    }, 1000);
    
    return () => clearInterval(id);
  }, [account, setSafeInterval]);

  // saved account actions
  const useSavedAccount = useCallback((acc) => {
    setAccount(acc);
    localStorage.setItem("tempMailAccount", JSON.stringify(acc));
    setMessages([]);
    setActiveTab("inbox");
  }, []);

  const deleteSavedAccount = useCallback((acc) => {
    setSavedAccounts(prev => prev.filter(a => a.token !== acc.token));
    if (account?.token === acc.token) { 
      setAccount(null); 
      localStorage.removeItem("tempMailAccount"); 
      setMessages([]); 
    }
  }, [account]);

  const refreshInboxPreview = useCallback(async (acc) => {
    try {
      const res = await axios.get(`${API_BASE}/inbox/${acc.token}`);
      const inboxArray = Array.isArray(res.data) ? res.data : res.data?.messages || [];
      const preview = inboxArray.slice(0,3).map(m => ({ 
        subject: m.subject || "(no subject)", 
        from: m.from?.address || m.from || "unknown" 
      }));
      
      setSavedAccounts(prev => prev.map(a => 
        a.token === acc.token ? { ...a, preview, previewCount: inboxArray.length } : a 
      ));
    } catch (e) { 
      // ignore preview errors 
    }
  }, []);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedEmail(text);
      setSafeTimeout(() => setCopiedEmail(null), 1500);
    });
  }, [setSafeTimeout]);

  const refreshInbox = () => fetchInbox();
  const clearInbox = () => setMessages([]);
  
  const exportData = useCallback(() => {
    const data = { 
      activeAccount: account, 
      messages, 
      savedAccounts, 
      stats, 
      exportedAt: new Date().toISOString() 
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tempmail-export-${Date.now()}.json`;
    document.body.appendChild(a); 
    a.click(); 
    a.remove(); 
    URL.revokeObjectURL(url);
  }, [account, messages, savedAccounts, stats]);

  useEffect(() => {
    if (account) { 
      localStorage.setItem("tempMailAccount", JSON.stringify(account)); 
      fetchInbox(); 
    }
  }, [account, fetchInbox]);

  // Function to mark a message as read
  const markAsRead = useCallback((messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
  }, []);

  // Function to mark all messages as read
  const markAllAsRead = useCallback(() => {
    setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
  }, []);

  // Calculate unread count
  const unreadCount = messages.filter(msg => !msg.isRead).length;

  return (
    <div className={`container-fluid py-3 ${darkMode ? "dark-mode" : ""}`}>
      {/* Mobile Menu Toggle */}
      <div className="d-lg-none fixed-top bg-light p-2 shadow-sm" style={{zIndex: 1040}}>
        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <i className="bi bi-list"></i> Menu
          </button>
          <button
            onClick={toggleDarkMode}
            className="btn btn-outline-secondary"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-fill"></i>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="d-lg-none fixed-top mt-5 p-3 bg-light shadow" style={{zIndex: 1050}}>
          <div className="mb-3">
            <small className="text-muted d-block mb-2">Email Duration:</small>
            <div className="d-grid gap-2">
              <button 
                className={`btn ${emailDuration === "10min" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setDuration("10min")}
              >
                10 min
              </button>
              <button 
                className={`btn ${emailDuration === "1hour" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setDuration("1hour")}
              >
                1 hour
              </button>
              <button 
                className={`btn ${emailDuration === "24hour" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setDuration("24hour")}
              >
                24 hours
              </button>
              <button 
                className={`btn ${emailDuration === "max" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setDuration("max")}
              >
                Max Time
              </button>
            </div>
          </div>
          <button 
            className="btn btn-danger w-100"
            onClick={() => setShowMobileMenu(false)}
          >
            Close
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="container pt-5 pt-lg-4">
        {/* Stats Bar - Mobile Optimized */}
        <div className="row mb-3">
          <div className="col-4 px-1">
            <div className="card bg-primary text-white text-center p-2">
              <h6 className="card-title mb-0">{savedAccounts.length}</h6>
              <small className="card-text">Emails</small>
            </div>
          </div>
          <div className="col-4 px-1">
            <div className="card bg-success text-white text-center p-2">
              <h6 className="card-title mb-0">{savedAccounts.filter(acc => !acc.expiry || new Date(acc.expiry) > new Date()).length}</h6>
              <small className="card-text">Active</small>
            </div>
          </div>
          {/* <div className="col-4 px-1">
            <div className="card bg-info text-white text-center p-2">
              <h6 className="card-title mb-0">{stats.messagesReceived}</h6>
              <small className="card-text">Messages</small>
            </div>
          </div> */}
        </div>

        {/* Navbar with time options - Desktop only */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3 rounded d-none d-lg-block">
          <div className="container-fluid">
            <span className="navbar-brand">New Email Duration:</span>
            <div className="navbar-nav">
              <button 
                className={`nav-link btn ${emailDuration === "10min" ? "btn-primary" : "btn-outline-primary"} me-2`}
                onClick={() => setDuration("10min")}
              >
                10 min
              </button>
              <button 
                className={`nav-link btn ${emailDuration === "1hour" ? "btn-primary" : "btn-outline-primary"} me-2`}
                onClick={() => setDuration("1hour")}
              >
                1 hour
              </button>
              <button 
                className={`nav-link btn ${emailDuration === "24hour" ? "btn-primary" : "btn-outline-primary"} me-2`}
                onClick={() => setDuration("24hour")}
              >
                24 hours
              </button>
              <button 
                className={`nav-link btn ${emailDuration === "max" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setDuration("max")}
              >
                Max Time
              </button>
            </div>
          </div>
        </nav>

        {/* Header */}
        <header className="text-center mb-4 position-relative">
          <button
            onClick={toggleDarkMode}
            className={`theme-toggle-btn position-absolute top-0 end-0 mt-3 me-3 d-none d-lg-block ${darkMode ? "sun" : "moon"}`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-fill"></i>}
          </button>

          <h1 className="fw-bold h3">TempMail Pro</h1>
          <p className="text-muted small">Disposable Email Service</p>
        </header>

        {/* Error Handler - only shown on home page */}
        {isHomePage && error && (
          <div className="alert alert-danger">
            <strong>Error:</strong> {error.message}
            <button className="btn btn-sm btn-warning ms-2" onClick={fetchInbox}>
              Retry
            </button>
          </div>
        )}

        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={
            <>
              {/* Active Email Display */}
              {account && (
                <div className="row justify-content-center mb-4">
                  <div className="col-12 col-lg-10">
                    <div className="card bg-light border-0">
                      <div className="card-body text-center py-4">
                        <h4 className="mb-3">Your Active Email Address</h4>
                        <div className="d-flex justify-content-center align-items-center flex-wrap">
                          <h5 className="text-primary mb-0 me-3">{account.email}</h5>
                          <button 
                            className="btn btn-outline-primary mt-2 mt-md-0"
                            onClick={() => copyToClipboard(account.email)}
                          >
                            <i className="bi bi-clipboard me-1"></i> Copy
                          </button>
                        </div>
                        <p className="text-muted mt-2 mb-0">
                          Use this address for sign-ups and registrations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Saved Emails Section */}
              <section className="saved-emails-section mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                  <div className="mb-2 mb-md-0">
                    <h3 className="mb-1">Your Email Addresses</h3>
                    <p className="text-muted mb-0">Manage your temporary email addresses</p>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => createNewAccount(false)} 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Generate New Email
                      </>
                    )}
                  </button>
                </div>

                {savedAccounts.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No saved emails yet. Generate one to get started.</p>
                  </div>
                ) : (
                  <div className="row">
                    {savedAccounts.map(acc => (
                      <div key={acc.token} className="col-12 col-md-6 col-lg-4 mb-3">
                        <EmailCard
                          email={acc.email}
                          expiration={acc.expiry}
                          isActive={account?.token === acc.token}
                          onDelete={() => deleteSavedAccount(acc)}
                          onSwitch={() => useSavedAccount(acc)}
                          messageCount={acc.previewCount || 0}
                          unreadCount={0}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Quick Pick Section */}
              {!account && (
                <section className="email-selection-section mb-4">
                  <div className="text-center">
                    <h3>Quick Pick</h3>
                    <p className="text-muted mb-4">Select an expiry: {formatExpiryType(emailDuration)}</p>

                    {preGeneratedAccounts.length > 0 ? (
                      <div className="row justify-content-center">
                        {preGeneratedAccounts.map((p, i) => (
                          <div key={i} className="col-12 col-md-6 col-lg-4 mb-3">
                            <EmailCard
                              email={p.email}
                              expiration={p.expiry}
                              onSwitch={() => createNewAccount(true)}
                              messageCount={0}
                              unreadCount={0}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3">
                        <div className="spinner-border text-primary mb-3" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted">Preparing email addresses...</p>
                        <button 
                          className="btn btn-outline-primary"
                          onClick={preGenerateAccounts}
                        >
                          <i className="bi bi-lightning-charge me-1"></i> Generate Now
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Account Management */}
              {account && (
                <section className="email-management-section">
                  <div className="account-controls mb-4">
                    <AccountManager
                      account={account}
                      refreshInbox={refreshInbox}
                      onNewEmail={() => createNewAccount(false)}
                      copyToClipboard={copyToClipboard}
                      copiedEmail={copiedEmail}
                      expiryType={account.expiryType}
                      timeLeftLabel={account.expiry ? timeLeft(account.expiry) : "∞"}
                    />

                    <div className="inbox-controls mt-3">
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div className="tab-navigation mb-2">
                          <button 
                            className={`btn btn-outline-secondary me-2 ${activeTab === "inbox" ? "active" : ""}`}
                            onClick={() => setActiveTab("inbox")}
                          >
                            Inbox
                          </button>
                          <button 
                            className={`btn btn-outline-secondary me-2 ${activeTab === "info" ? "active" : ""}`}
                            onClick={() => setActiveTab("info")}
                          >
                            Info
                          </button>
                          <button 
                            className={`btn btn-outline-secondary ${activeTab === "stats" ? "active" : ""}`}
                            onClick={() => setActiveTab("stats")}
                          >
                            Stats
                          </button>
                        </div>

                        <div className="inbox-actions d-flex align-items-center">
                          <button className="btn btn-outline-secondary me-2" onClick={refreshInbox} title="Refresh inbox">
                            <i className="bi bi-arrow-clockwise"></i>
                          </button>
                          <button className="btn btn-outline-secondary me-2" onClick={clearInbox} title="Clear inbox">
                            <i className="bi bi-trash"></i>
                          </button>
                          <button className="btn btn-outline-secondary me-2" onClick={exportData} title="Export data">
                            <i className="bi bi-download"></i>
                          </button>
                          <div className="form-check form-switch">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              checked={autoRefresh} 
                              onChange={() => setAutoRefresh(!autoRefresh)} 
                              id="autoRefreshToggle"
                            />
                            <label className="form-check-label" htmlFor="autoRefreshToggle">
                              Auto-refresh
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {activeTab === "inbox" && 
                    <Inbox 
                      messages={messages} 
                      markAsRead={markAsRead}
                      markAllAsRead={markAllAsRead}
                      unreadCount={unreadCount}
                      token={account.token}
                      isLoading={isLoading}
                    />
                  }
                  
                  {activeTab === "info" && (
                    <div className="info-tab card">
                      <div className="card-body">
                        <h5 className="card-title">About Your Temporary Email</h5>
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            <strong>Address:</strong> {account.email}
                          </li>
                          <li className="list-group-item">
                            <strong>Created:</strong>{" "}
                            {new Date(account.createdAt || Date.now()).toLocaleString()}
                          </li>
                          <li className="list-group-item">
                            <strong>Expires:</strong>{" "}
                            {account.expiry ? new Date(account.expiry).toLocaleString() : "—"}{" "}
                            {account.expiry && <span>({timeLeft(account.expiry)})</span>}
                          </li>
                          <li className="list-group-item">
                            <strong>Type:</strong> {formatExpiryType(account.expiryType || "medium")}
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "stats" && (
                    <div className="stats-tab card">
                      <div className="card-body">
                        <h5 className="card-title">Usage Statistics</h5>
                        <div className="row">
                          <div className="col-12 col-md-4 mb-3">
                            <div className="card bg-light">
                              <div className="card-body text-center">
                                <h6>Emails Created</h6>
                                <h3>{stats.emailsCreated}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-md-4 mb-3">
                            <div className="card bg-light">
                              <div className="card-body text-center">
                                <h6>Messages Received</h6>
                                <h3>{stats.messagesReceived}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-md-4 mb-3">
                            <div className="card bg-light">
                              <div className="card-body text-center">
                                <h6>Session Messages</h6>
                                <h3>{messages.length}</h3>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button className="btn btn-primary mt-2" onClick={exportData}>
                          Export All Data
                        </button>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Other Sections */}
              <MainPage />
              <FAQSection />
              <BlogList />
            </>
          } />
          
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>

        {/* Footer */}
        <footer className="mt-5 pt-4 border-top text-center text-muted">
          <div className="container">
            <p className="mb-1">
              &copy; {new Date().getFullYear()} TempMail Pro • Powered by Mail.tm API •
              <Link to="/privacy" className="ms-1 text-decoration-none">
                Privacy Policy
              </Link>
            </p>
            <p className="mb-0">Free temporary email service • No registration required</p>
            <div className="footer-stats small mt-2">
              Emails created: {stats.emailsCreated} • Messages received: {stats.messagesReceived}
            </div>
          </div>
        </footer>
      </div>

      {copiedEmail && (
        <div className="position-fixed bottom-0 end-0 m-3 p-3 bg-success text-white rounded shadow" style={{zIndex: 1060}}>
          <i className="bi bi-check-circle me-2"></i>
          Email copied to clipboard!
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Helmet>
        <title>TempMail Pro - Free Temporary Email Service</title>
        <meta 
          name="description" 
          content="Get a free disposable email address instantly. Protect your inbox from spam & hackers." 
        />
        <meta 
          name="keywords" 
          content="temporary email, temp mail, disposable email, burner email" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </Router>
  );
}
















// // good one above one
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
// import { Helmet } from "react-helmet";

// import AccountManager from "./components/AccountManager.jsx";
// import Inbox from "./components/Inbox.jsx";
// import MainPage from "./components/MainPage";
// import FAQSection from "./components/FAQSection";
// import BlogList from "./components/BlogList";
// import BlogPost from "./components/BlogPost";
// import Privacy from "./components/Privacy";

// const API_BASE = import.meta.env.VITE_API_BASE;

// // Email Card Component - Only one declaration
// const EmailCard = ({ email, expiration, isActive = false, onDelete }) => {
//   const formatTimeRemaining = (expirationDate) => {
//     const now = new Date();
//     const expiry = new Date(expirationDate);
//     const diffMs = expiry - now;
    
//     if (diffMs <= 0) return "Expired";
    
//     const hours = Math.floor(diffMs / (1000 * 60 * 60));
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
//     if (hours > 0) {
//       return `${hours}h ${minutes}m remaining`;
//     }
//     return `${minutes}m remaining`;
//   };

//   return (
//     <div className={`card h-100 ${isActive ? 'border-primary' : ''}`}>
//       <div className="card-body">
//         <div className="d-flex justify-content-between align-items-start mb-2">
//           <h6 className="card-title text-truncate flex-grow-1 me-2">{email}</h6>
//           {onDelete && (
//             <button 
//               className="btn btn-sm btn-outline-danger"
//               onClick={onDelete}
//               title="Delete this email"
//             >
//               <i className="bi bi-x-lg"></i>
//             </button>
//           )}
//         </div>
//         <div className="d-flex justify-content-between align-items-center mb-2">
//           <small className="text-muted">Expires:</small>
//           <small className={expiration && new Date(expiration) < new Date() ? 'text-danger' : 'text-success'}>
//             {expiration ? formatTimeRemaining(expiration) : 'Unknown'}
//           </small>
//         </div>
//         {isActive && (
//           <div className="badge bg-success w-100">Active Email</div>
//         )}
//       </div>
//     </div>
//   );
// };

// function AppContent() {
//   const [account, setAccount] = useState(() => {
//     const saved = localStorage.getItem("tempMailAccount");
//     return saved ? JSON.parse(saved) : null;
//   });
//   const [generatedEmails, setGeneratedEmails] = useState(() => {
//     const saved = localStorage.getItem("generatedEmails");
//     return saved ? JSON.parse(saved) : [];
//   });
//   const [messages, setMessages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [darkMode, setDarkMode] = useState(() => {
//     const saved = localStorage.getItem("darkMode");
//     return saved === "true";
//   });
//   const [emailDuration, setEmailDuration] = useState(() => {
//     const saved = localStorage.getItem("emailDuration");
//     return saved || "1hour"; // Default to 1 hour
//   });

//   const location = useLocation();
//   const isHomePage = location.pathname === "/";

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("darkMode", newMode.toString());
//   };

//   const setDuration = (duration) => {
//     setEmailDuration(duration);
//     localStorage.setItem("emailDuration", duration);
//   };

//   useEffect(() => {
//     document.body.classList.toggle("dark-mode", darkMode);
//   }, [darkMode]);

//   useEffect(() => {
//     if (account) {
//       localStorage.setItem("tempMailAccount", JSON.stringify(account));
//       fetchInbox();
//     }
//   }, [account]);

//   useEffect(() => {
//     localStorage.setItem("generatedEmails", JSON.stringify(generatedEmails));
//   }, [generatedEmails]);

//   // Auto-generate an email on first visit
//   useEffect(() => {
//     if (isHomePage && !account && generatedEmails.length === 0) {
//       createNewAccount(true); // true indicates it's an auto-generated email
//     }
//   }, [isHomePage]);

//   const createNewAccount = async (isAutoGenerated = false) => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const res = await axios.post(`${API_BASE}/accounts/create`);
      
//       // Add expiration time based on selected duration
//       const now = new Date();
//       let expirationTime;
      
//       // For auto-generated emails, use 1 hour regardless of navbar setting
//       const durationToUse = isAutoGenerated ? "1hour" : emailDuration;
      
//       switch(durationToUse) {
//         case "10min":
//           expirationTime = new Date(now.getTime() + 10 * 60000);
//           break;
//         case "1hour":
//           expirationTime = new Date(now.getTime() + 60 * 60000);
//           break;
//         case "24hour":
//           expirationTime = new Date(now.getTime() + 24 * 60 * 60000);
//           break;
//         case "max":
//           // Set to a far future date (10 years)
//           expirationTime = new Date(now.getTime() + 3650 * 24 * 60 * 60000);
//           break;
//         default:
//           expirationTime = new Date(now.getTime() + 60 * 60000); // Default to 1 hour
//       }
      
//       const accountData = {
//         ...res.data,
//         expiration: expirationTime.toISOString(),
//         isAutoGenerated
//       };
      
//       setAccount(accountData);
      
//       // Add to generated emails list if not already there
//       if (!generatedEmails.some(email => email.address === accountData.email)) {
//         setGeneratedEmails(prev => [...prev, {
//           address: accountData.email,
//           expiration: accountData.expiration,
//           createdAt: new Date().toISOString()
//         }]);
//       }
      
//       setMessages([]);
//     } catch (err) {
//       setError({ message: err.response?.data?.error || "Account creation failed" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const switchAccount = (emailAddress) => {
//     // Find the email in generatedEmails
//     const emailAccount = generatedEmails.find(email => email.address === emailAddress);
//     if (emailAccount) {
//       setAccount({
//         email: emailAccount.address,
//         expiration: emailAccount.expiration,
//         // We need to handle token differently - this is a limitation
//         // For a real implementation, you'd need to store tokens for all generated emails
//         token: account?.token || "" // This is a placeholder
//       });
//     }
//   };

//   const deleteEmail = (emailAddress) => {
//     setGeneratedEmails(prev => prev.filter(email => email.address !== emailAddress));
    
//     // If the deleted email is the active account, switch to the first available email
//     if (account && account.email === emailAddress) {
//       const remainingEmails = generatedEmails.filter(email => email.address !== emailAddress);
//       if (remainingEmails.length > 0) {
//         switchAccount(remainingEmails[0].address);
//       } else {
//         setAccount(null);
//         createNewAccount(true); // Create a new auto-generated email
//       }
//     }
//   };

//   const fetchInbox = async () => {
//     if (!account?.token) return;
    
//     // Check if account has expired
//     if (account.expiration) {
//       const now = new Date();
//       const expiration = new Date(account.expiration);
      
//       if (now > expiration) {
//         setError({ message: "Email address has expired. Please create a new one." });
//         localStorage.removeItem("tempMailAccount");
//         setAccount(null);
//         return;
//       }
//     }
    
//     try {
//       const res = await axios.get(`${API_BASE}/inbox/${account.token}`);
//       const inboxArray = Array.isArray(res.data) ? res.data : res.data?.messages || [];
//       setMessages(inboxArray);
//       setError(null);
//     } catch (err) {
//       let errorMessage = err.response?.data?.error || "Failed to load inbox";
//       if (errorMessage.includes("expired") || err.response?.status === 401) {
//         errorMessage = "Session expired. Please create a new email address.";
//         localStorage.removeItem("tempMailAccount");
//         setAccount(null);
//       }
//       setError({ message: errorMessage });
//     }
//   };

//   useEffect(() => {
//     if (account) {
//       const interval = setInterval(fetchInbox, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [account]);

//   return (
//     <div className={`container py-4 ${darkMode ? "dark-mode" : ""}`}>
//       {/* Navbar with time options */}
//       <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 rounded">
//         <div className="container-fluid">
//           <span className="navbar-brand">New Email Duration:</span>
//           <div className="navbar-nav">
//             <button 
//               className={`nav-link btn ${emailDuration === "10min" ? "btn-primary" : "btn-outline-primary"} me-2`}
//               onClick={() => setDuration("10min")}
//             >
//               10 min
//             </button>
//             <button 
//               className={`nav-link btn ${emailDuration === "1hour" ? "btn-primary" : "btn-outline-primary"} me-2`}
//               onClick={() => setDuration("1hour")}
//             >
//               1 hour
//             </button>
//             <button 
//               className={`nav-link btn ${emailDuration === "24hour" ? "btn-primary" : "btn-outline-primary"} me-2`}
//               onClick={() => setDuration("24hour")}
//             >
//               24 hours
//             </button>
//             <button 
//               className={`nav-link btn ${emailDuration === "max" ? "btn-primary" : "btn-outline-primary"}`}
//               onClick={() => setDuration("max")}
//             >
//               Max Time
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Header */}
//       <header className="text-center mb-5 position-relative">
//         <button
//           onClick={toggleDarkMode}
//           className={`theme-toggle-btn position-absolute top-0 end-0 mt-3 me-3 ${darkMode ? "sun" : "moon"}`}
//           aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
//         >
//           {darkMode ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-fill"></i>}
//         </button>

//         <h1 className="fw-bold">TempMail Pro</h1>
//         <p className="text-muted">Disposable Email Service</p>
//       </header>

//       {/* Error Handler - only shown on home page */}
//       {isHomePage && error && (
//         <div className="alert alert-danger">
//           <strong>Error:</strong> {error.message}
//           <button className="btn btn-sm btn-warning ms-2" onClick={fetchInbox}>
//             Retry
//           </button>
//         </div>
//       )}

//       <Routes>
//         {/* Home Page Route */}
//         <Route path="/" element={
//           <>
//             {/* Active Email Card */}
//             {account && (
//               <div className="row justify-content-center mb-4">
//                 <div className="col-md-6">
//                   <EmailCard
//                     email={account.email}
//                     expiration={account.expiration}
//                     isActive={true}
//                   />
//                 </div>
//               </div>
//             )}
            
//             {/* TempMail Section - only shown on home page */}
//             {!account ? (
//               <div className="d-flex justify-content-center my-5 py-5">
//                 <button
//                   className="btn btn-primary btn-lg px-5 py-3 fw-bold"
//                   onClick={() => createNewAccount(false)}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Creating..." : "Create Temporary Email"}
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <AccountManager 
//                   account={account} 
//                   refreshInbox={fetchInbox} 
//                   onNewEmail={() => createNewAccount(false)}
//                 />
                
//                 {/* Generated Emails List */}
//                 {generatedEmails.length > 1 && (
//                   <div className="mt-4">
//                     <h4 className="mb-3">Your Generated Emails</h4>
//                     <div className="row">
//                       {generatedEmails
//                         .filter(email => email.address !== account.email)
//                         .map((email, index) => (
//                           <div key={index} className="col-md-4 mb-3">
//                             <EmailCard
//                               email={email.address}
//                               expiration={email.expiration}
//                               onDelete={() => deleteEmail(email.address)}
//                             />
//                           </div>
//                         ))
//                       }
//                     </div>
//                   </div>
//                 )}
                
//                 <Inbox
//                   messages={messages.map((msg) => ({
//                     ...msg,
//                     token: account.token,
//                   }))}
//                 />
                
//                 {/* Generate New Email Button */}
//                 <div className="text-center mt-4">
//                   <button
//                     className="btn btn-outline-primary"
//                     onClick={() => createNewAccount(false)}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? "Creating..." : "Generate Another Email"}
//                   </button>
//                 </div>
//               </>
//             )}

//             {/* Other Sections */}
//             <MainPage />
//             <FAQSection />
//             <BlogList />
//           </>
//         } />

//         {/* Blog Post Route */}
//         <Route path="/blog/:slug" element={<BlogPost />} />

//         <Route path="/privacy" element={<Privacy />} />
//       </Routes>

//       {/* Footer */}
//       <footer className="mt-5 pt-4 border-top text-center text-muted">
//         <div className="container">
//           <p className="mb-1">
//             &copy; {new Date().getFullYear()} TempMail Pro • Powered by Mail.tm API •
//             <Link to="/privacy" className="ms-2 text-decoration-none">
//               Privacy Policy
//             </Link>
//           </p>
//           <p className="mb-0">Free temporary email service • No registration required</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <Helmet>
//         <title>TempMail Pro - Free Temporary Email Service</title>
//         <meta
//           name="description"
//           content="Get a free disposable email address instantly. Protect your inbox from spam & hackers."
//         />
//         <meta
//           name="keywords"
//           content="temporary email, temp mail, disposable email, burner email"
//         />
//       </Helmet>
//       <AppContent />
//     </Router>
//   );
// }
