





// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import { Helmet, HelmetProvider } from "react-helmet-async";

// import AccountManager from "./components/AccountManager.jsx";
// import Inbox from "./components/Inbox.jsx";
// import Privacy from "./components/Privacy";
// import BlogPost from "./components/BlogPost";
// import Landing from "./components/Landing.jsx";
// import Footer from "./components/Footer";
// import EmailCard from "./components/EmailCard";
// import Navbar from "./components/Navbar";
// import Header from "./components/Header";
// import ErrorAlert from "./components/ErrorAlert";

// const API_BASE = import.meta.env.VITE_API_BASE;

// // Duration constants for better maintainability
// const DURATIONS = {
//   "10min": 10 * 60 * 1000,
//   "1hour": 60 * 60 * 1000,
//   "24hour": 24 * 60 * 60 * 1000,
//   "max": 3650 * 24 * 60 * 60 * 1000 // Approximately 10 years
// };

// // Polling intervals
// const POLLING_INTERVALS = {
//   FAST: 5000,     // 5 seconds
//   NORMAL: 10000,  // 10 seconds
//   SLOW: 30000     // 30 seconds
// };

// function TempMailApp() {

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
//     return saved || "1hour";
//   });
//   const [pollingInterval, setPollingInterval] = useState(() => {
//     const saved = localStorage.getItem("pollingInterval");
//     return saved ? parseInt(saved) : POLLING_INTERVALS.NORMAL;
//   });
//   const [isNavExpanded, setIsNavExpanded] = useState(false);
//   const [isInboxLoading, setIsInboxLoading] = useState(false);
//   const [isBackgroundPolling, setIsBackgroundPolling] = useState(false);
//   const [tokenValid, setTokenValid] = useState(true);

//   const location = useLocation();
//   const isAppPage = location.pathname === "/app";
//   const currentUrl = `${window.location.origin}${location.pathname}${location.search}`;

//   // Use refs to access current state in intervals
//   const accountRef = useRef(account);
//   const pollingIntervalRef = useRef(pollingInterval);

//   useEffect(() => {
//     accountRef.current = account;
//   }, [account]);

//   useEffect(() => {
//     pollingIntervalRef.current = pollingInterval;
//   }, [pollingInterval]);

//   // Add token expiration handler
//   const handleTokenExpired = () => {
//     setTokenValid(false);
//     setError({ message: "Session expired. Please create a new email address." });
//   };

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("darkMode", newMode.toString());
//     document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
//   };

//   const setDuration = (duration) => {
//     setEmailDuration(duration);
//     localStorage.setItem("emailDuration", duration);
//   };

//   const setPollingSpeed = (speed) => {
//     setPollingInterval(speed);
//     localStorage.setItem("pollingInterval", speed.toString());
//   };

//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
//   }, [darkMode]);

//   useEffect(() => {
//     if (account) {
//       localStorage.setItem("tempMailAccount", JSON.stringify(account));
//       // Load messages from localStorage if available
//       const savedMessages = localStorage.getItem(`inbox-${account.token}`);
//       if (savedMessages) {
//         setMessages(JSON.parse(savedMessages));
//       }
//       fetchInbox(true); // Initial load - show loading indicator
//     }
//   }, [account]);

//   // Add to your TempMailApp component
//   useEffect(() => {
//     if (error?.message?.includes('expired')) {
//       setTokenValid(false);
//       // Clear any stored data for this token
//       localStorage.removeItem(`inbox-${account.token}`);
//     }
//   }, [error, account]);

//   useEffect(() => {
//     localStorage.setItem("generatedEmails", JSON.stringify(generatedEmails));
//   }, [generatedEmails]);

//   useEffect(() => {
//     if (account) {
//       // Store only the last 20 messages to prevent localStorage bloat
//       const limitedMessages = messages.slice(-20);
//       localStorage.setItem(`inbox-${account.token}`, JSON.stringify(limitedMessages));
//     }
//   }, [messages, account]);

//   // Auto-generate an email when on app page
//   useEffect(() => {
//     if (isAppPage && !account && generatedEmails.length === 0) {
//       createNewAccount(true);
//     }
//   }, [isAppPage]);

//   const createNewAccount = async (isAutoGenerated = false) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const res = await axios.post(`${API_BASE}/api/accounts/create`);

//       const now = new Date();
//       const expirationTime = new Date(now.getTime() + DURATIONS[isAutoGenerated ? "1hour" : emailDuration]);

//       const accountData = {
//         ...res.data,
//         expiration: expirationTime.toISOString(),
//         isAutoGenerated
//       };

//       setAccount(accountData);
//       setTokenValid(true);

//       if (!generatedEmails.some(email => email.address === accountData.email)) {
//         setGeneratedEmails(prev => [...prev, {
//           address: accountData.email,
//           expiration: accountData.expiration,
//           createdAt: new Date().toISOString(),
//           token: accountData.token
//         }]);
//       }

//       setMessages([]);
//     } catch (err) {
//       setError({ message: err.response?.data?.error || "Account creation failed" });
//       console.error("Account creation failed:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const switchAccount = (emailAddress) => {
//     const emailAccount = generatedEmails.find(email => email.address === emailAddress);
//     if (emailAccount) {
//       setAccount({
//         email: emailAccount.address,
//         expiration: emailAccount.expiration,
//         token: emailAccount.token
//       });
//       setTokenValid(true);
//     }
//   };

//   const deleteEmail = (emailAddress) => {
//     setGeneratedEmails(prev => {
//       const remaining = prev.filter(email => email.address !== emailAddress);

//       // Check if we're deleting the current account
//       if (accountRef.current && accountRef.current.email === emailAddress) {
//         if (remaining.length > 0) {
//           // Switch to the first remaining email
//           switchAccount(remaining[0].address);
//         } else {
//           // No emails left, create a new one
//           setAccount(null);
//           createNewAccount(true);
//         }
//       }

//       return remaining;
//     });
//   };

//   const fetchInbox = async (showLoading = false) => {
//     if (!accountRef.current?.token) return;

//     // Check if token is still valid before making the request
//     if (accountRef.current.expiration) {
//       const now = new Date();
//       const expiration = new Date(accountRef.current.expiration);

//       if (now > expiration) {
//         // Token has expired, update state and return early
//         setTokenValid(false);
//         setError({ message: "Session expired. Please create a new email address." });
//         return;
//       }
//     }

//     if (showLoading) {
//       setIsInboxLoading(true);
//     } else {
//       setIsBackgroundPolling(true);
//     }

//     try {
//       const res = await axios.get(`${API_BASE}/api/inbox/${accountRef.current.token}`);
//       const inboxArray = Array.isArray(res.data) ? res.data : res.data?.messages || [];

//       // Store only the last 20 messages to prevent localStorage bloat
//       const limitedMessages = inboxArray.slice(-20);
//       setMessages(limitedMessages);
//       setError(null);
//       setTokenValid(true); // Token is valid if request succeeded
//     } catch (err) {
//       let errorMessage = err.response?.data?.error || "Failed to load inbox";
//       console.error("Inbox fetch failed:", err);

//       if (errorMessage.includes("expired") || err.response?.status === 401) {
//         setTokenValid(false);
//         errorMessage = "Session expired. Please create a new email address.";
//       }
//       setError({ message: errorMessage });
//     } finally {
//       if (showLoading) {
//         setIsInboxLoading(false);
//       } else {
//         // Add a small delay to make the background polling indicator visible
//         setTimeout(() => setIsBackgroundPolling(false), 300);
//       }
//     }
//   };

//   useEffect(() => {
//     let intervalId = null;

//     if (account && tokenValid) {
//       intervalId = setInterval(() => {
//         fetchInbox(false); // Background polling - no loading indicator
//       }, pollingInterval);
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [account, pollingInterval, tokenValid]);

//   return (
//     <div className={`container-fluid py-4 px-3 px-md-5 ${darkMode ? "dark-mode" : ""}`}>
//       {/* Dynamic SEO for TempMailApp */}
//       <Helmet>
//         <title>
//           {account
//             ? `TempMail Pro - ${account.email}`
//             : "TempMail Pro - Free Temporary Email Service"}
//         </title>
//         <meta
//           name="description"
//           content={
//             account
//               ? `Your temporary email address is ${account.email}. Protect your inbox with TempMail Pro.`
//               : "Get free disposable email addresses with TempMail Pro. Protect your inbox from spam and stay secure."
//           }
//         />
//         <meta property="og:title" content={account ? `TempMail Pro - ${account.email}` : "TempMail Pro - Free Temporary Email Service"} />
//         <meta property="og:description" content={account ? `Your temporary email address is ${account.email}. Protect your inbox with TempMail Pro.` : "Get free disposable email addresses with TempMail Pro. Protect your inbox from spam and stay secure."} />
//         <meta property="og:url" content={currentUrl} />
//         <link rel="canonical" href={currentUrl} />
//       </Helmet>

//       {/* Subtle background polling indicator */}
//       {isBackgroundPolling && (
//         <div className="background-polling-indicator">
//           <div className="spinner-border spinner-border-sm text-primary" role="status">
//             <span className="visually-hidden">Checking for new messages...</span>
//           </div>
//         </div>
//       )}

//       <Navbar
//         emailDuration={emailDuration}
//         setDuration={setDuration}
//         pollingInterval={pollingInterval}
//         setPollingSpeed={setPollingSpeed}
//         pollingIntervals={POLLING_INTERVALS}
//         isNavExpanded={isNavExpanded}
//         setIsNavExpanded={setIsNavExpanded}
//       />

//       <Header
//         darkMode={darkMode}
//         toggleDarkMode={toggleDarkMode}
//       />

//       {/* Error Handler */}
//       {error && (
//         <ErrorAlert
//           error={error}
//           setError={setError}
//           onRetry={fetchInbox}
//         />
//       )}

//       {/* Active Email Card */}
//       {account && (
//         <div className="row justify-content-center mb-4">
//           <div className="col-12 col-md-8 col-lg-6">
//             <EmailCard
//               email={account.email}
//               expiration={account.expiration}
//               isActive={true}
//               isValid={tokenValid}
//               onRenew={() => {
//                 // Create a new email with the same settings
//                 createNewAccount(false);
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {/* TempMail Section */}
//       {!account ? (
//         <div className="d-flex flex-column align-items-center my-5 py-5">
//           <button
//             className="btn btn-primary btn-lg px-5 py-3 fw-bold mb-3"
//             onClick={() => createNewAccount(false)}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                 Creating...
//               </>
//             ) : "Create Temporary Email"}
//           </button>

//           {/* Retry button for account creation errors */}
//           {error && !account && (
//             <div className="text-center">
//               <p className="text-muted mb-2">Having trouble creating an email?</p>
//               <button
//                 className="btn btn-outline-danger"
//                 onClick={() => createNewAccount(false)}
//               >
//                 <i className="fas fa-redo me-2"></i>Retry
//               </button>
//             </div>
//           )}
//         </div>
//       ) : (
//         <>
//           <AccountManager
//             account={account}
//             refreshInbox={() => fetchInbox(true)}
//             onNewEmail={() => createNewAccount(false)}
//           />

//           {/* Generated Emails List */}
//           {generatedEmails.length > 1 && (
//             <div className="mt-4">
//               <h4 className="mb-3">Your Generated Emails</h4>
//               <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
//                 {generatedEmails
//                   .filter(email => email.address !== account.email)
//                   .map((email, index) => (
//                     <div key={index} className="col">
//                       <EmailCard
//                         email={email.address}
//                         expiration={email.expiration}
//                         onDelete={() => deleteEmail(email.address)}
//                         onSwitch={() => switchAccount(email.address)}
//                       />
//                     </div>
//                   ))
//                 }
//               </div>
//             </div>
//           )}

//           <Inbox
//             messages={messages.map((msg) => ({
//               ...msg,
//               token: account.token,
//             }))}
//             isLoading={isInboxLoading}
//             onRetry={() => fetchInbox(true)}
//             onTokenExpired={handleTokenExpired}
//           />

//           {/* Generate New Email Button */}
//           <div className="text-center mt-4">
//             <button
//               className="btn btn-outline-primary"
//               onClick={() => createNewAccount(false)}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                   Creating...
//                 </>
//               ) : "Generate Another Email"}
//             </button>
//           </div>
//         </>
//       )}

//       {/* Footer */}
//       <Footer isDarkMode={darkMode} />
//     </div>
//   );
// }

// // Error Boundary Component to catch errors
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Error caught by boundary:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="container my-5">
//           <div className="alert alert-danger">
//             <h2>Something went wrong.</h2>
//             <p>{this.state.error?.message || "An unexpected error occurred"}</p>
//             <button
//               className="btn btn-primary"
//               onClick={() => this.setState({ hasError: false, error: null })}
//             >
//               Try again
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// // Main App component without useLocation
// function App() {
//   return (
//     <HelmetProvider>
//       <ErrorBoundary>
//         <Router>
//           <Routes>
//             <Route path="/" element={<Landing />} />
//             <Route path="/app" element={<TempMailApp />} />
//             <Route path="/blog/:slug" element={<BlogPost />} />
//             <Route path="/privacy" element={<Privacy />} />
//           </Routes>
//         </Router>
//       </ErrorBoundary>
//     </HelmetProvider>
//   );
// }

// export default App;






// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import { Helmet, HelmetProvider } from "react-helmet-async";

// import AccountManager from "./components/AccountManager.jsx";
// import Inbox from "./components/Inbox.jsx";
// import Privacy from "./components/Privacy";
// import BlogPost from "./components/BlogPost";
// import Landing from "./components/Landing.jsx";
// import Footer from "./components/Footer";
// import EmailCard from "./components/EmailCard";
// import Navbar from "./components/Navbar";
// import Header from "./components/Header";
// import ErrorAlert from "./components/ErrorAlert";

// const API_BASE = import.meta.env.VITE_API_BASE;

// // Duration constants for better maintainability
// const DURATIONS = {
//   "10min": 10 * 60 * 1000,
//   "1hour": 60 * 60 * 1000,
//   "24hour": 24 * 60 * 60 * 1000,
//   "max": 3650 * 24 * 60 * 60 * 1000 // Approximately 10 years
// };

// // Polling intervals
// const POLLING_INTERVALS = {
//   FAST: 5000,     // 5 seconds
//   NORMAL: 10000,  // 10 seconds
//   SLOW: 30000     // 30 seconds
// };

// function TempMailApp() {
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
//     return saved || "1hour";
//   });
//   const [pollingInterval, setPollingInterval] = useState(() => {
//     const saved = localStorage.getItem("pollingInterval");
//     return saved ? parseInt(saved) : POLLING_INTERVALS.NORMAL;
//   });
//   const [isNavExpanded, setIsNavExpanded] = useState(false);
//   const [isInboxLoading, setIsInboxLoading] = useState(false);
//   const [isBackgroundPolling, setIsBackgroundPolling] = useState(false);
//   const [tokenValid, setTokenValid] = useState(true);

//   const location = useLocation();
//   const isAppPage = location.pathname === "/app";
//   const currentUrl = `${window.location.origin}${location.pathname}${location.search}`;

//   // Use refs to access current state in intervals
//   const accountRef = useRef(account);
//   const pollingIntervalRef = useRef(pollingInterval);

//   useEffect(() => {
//     accountRef.current = account;
//   }, [account]);

//   useEffect(() => {
//     pollingIntervalRef.current = pollingInterval;
//   }, [pollingInterval]);

//   // Add token expiration handler
//   const handleTokenExpired = () => {
//     setTokenValid(false);
//     setError({ message: "Session expired. Please create a new email address." });
//   };

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("darkMode", newMode.toString());
//     document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
//   };

//   const setDuration = (duration) => {
//     setEmailDuration(duration);
//     localStorage.setItem("emailDuration", duration);
//   };

//   const setPollingSpeed = (speed) => {
//     setPollingInterval(speed);
//     localStorage.setItem("pollingInterval", speed.toString());
//   };

//   useEffect(() => {
//     document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
//   }, [darkMode]);

//   useEffect(() => {
//     if (account) {
//       localStorage.setItem("tempMailAccount", JSON.stringify(account));
//       // Load messages from localStorage if available
//       const savedMessages = localStorage.getItem(`inbox-${account.token}`);
//       if (savedMessages) {
//         setMessages(JSON.parse(savedMessages));
//       }
//       fetchInbox(true); // Initial load - show loading indicator
//     }
//   }, [account]);

//   useEffect(() => {
//     if (error?.message?.includes('expired')) {
//       setTokenValid(false);
//       // Clear any stored data for this token
//       if (account) {
//         localStorage.removeItem(`inbox-${account.token}`);
//       }
//     }
//   }, [error, account]);

//   useEffect(() => {
//     localStorage.setItem("generatedEmails", JSON.stringify(generatedEmails));
//   }, [generatedEmails]);

//   useEffect(() => {
//     if (account) {
//       // Store only the last 20 messages to prevent localStorage bloat
//       const limitedMessages = messages.slice(-20);
//       localStorage.setItem(`inbox-${account.token}`, JSON.stringify(limitedMessages));
//     }
//   }, [messages, account]);

//   // Auto-generate an email when on app page
//   useEffect(() => {
//     if (isAppPage && !account && generatedEmails.length === 0) {
//       createNewAccount(true);
//     }
//   }, [isAppPage]);

//   const createNewAccount = async (isAutoGenerated = false) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const res = await axios.post(`${API_BASE}/api/accounts/create`);

//       const now = new Date();
//       const expirationTime = new Date(now.getTime() + DURATIONS[isAutoGenerated ? "1hour" : emailDuration]);

//       const accountData = {
//         ...res.data,
//         expiration: expirationTime.toISOString(),
//         isAutoGenerated
//       };

//       setAccount(accountData);
//       setTokenValid(true);

//       if (!generatedEmails.some(email => email.address === accountData.email)) {
//         setGeneratedEmails(prev => [...prev, {
//           address: accountData.email,
//           expiration: accountData.expiration,
//           createdAt: new Date().toISOString(),
//           token: accountData.token
//         }]);
//       }

//       setMessages([]);
//     } catch (err) {
//       setError({ message: err.response?.data?.error || "Account creation failed" });
//       console.error("Account creation failed:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const switchAccount = (emailAddress) => {
//     const emailAccount = generatedEmails.find(email => email.address === emailAddress);
//     if (emailAccount) {
//       setAccount({
//         email: emailAccount.address,
//         expiration: emailAccount.expiration,
//         token: emailAccount.token
//       });
//       setTokenValid(true);
//     }
//   };

//   const deleteEmail = (emailAddress) => {
//     setGeneratedEmails(prev => {
//       const remaining = prev.filter(email => email.address !== emailAddress);

//       // Check if we're deleting the current account
//       if (accountRef.current && accountRef.current.email === emailAddress) {
//         if (remaining.length > 0) {
//           // Switch to the first remaining email
//           switchAccount(remaining[0].address);
//         } else {
//           // No emails left, create a new one
//           setAccount(null);
//           createNewAccount(true);
//         }
//       }

//       return remaining;
//     });
//   };

//   const fetchInbox = async (showLoading = false) => {
//     if (!accountRef.current?.token) return;

//     // Check if token is still valid before making the request
//     if (accountRef.current.expiration) {
//       const now = new Date();
//       const expiration = new Date(accountRef.current.expiration);

//       if (now > expiration) {
//         // Token has expired, update state and return early
//         setTokenValid(false);
//         setError({ message: "Session expired. Please create a new email address." });
//         return;
//       }
//     }

//     if (showLoading) {
//       setIsInboxLoading(true);
//     } else {
//       setIsBackgroundPolling(true);
//     }

//     try {
//       const res = await axios.get(`${API_BASE}/api/inbox/${accountRef.current.token}`, {
//         timeout: 10000 // 10 second timeout
//       });
      
//       const inboxArray = Array.isArray(res.data) ? res.data : res.data?.messages || [];

//       // Store only the last 20 messages to prevent localStorage bloat
//       const limitedMessages = inboxArray.slice(-20);
//       setMessages(limitedMessages);
//       setError(null);
//       setTokenValid(true); // Token is valid if request succeeded
//     } catch (err) {
//       let errorMessage = "Failed to load inbox";
      
//       if (err.code === 'ECONNABORTED') {
//         errorMessage = "Request timeout. Please check your connection.";
//       } else if (err.response?.status === 401) {
//         setTokenValid(false);
//         errorMessage = "Session expired. Please create a new email address.";
//       } else if (err.response?.data?.error) {
//         errorMessage = err.response.data.error;
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
      
//       console.error("Inbox fetch failed:", err);
//       setError({ message: errorMessage });
//     } finally {
//       if (showLoading) {
//         setIsInboxLoading(false);
//       } else {
//         // Add a small delay to make the background polling indicator visible
//         setTimeout(() => setIsBackgroundPolling(false), 300);
//       }
//     }
//   };

//   // Effect to set a timer for exact expiration time
// useEffect(() => {
//   if (!account?.expiration) return;

//   const expirationTime = new Date(account.expiration).getTime();
//   const now = Date.now();
//   const timeUntilExpiration = expirationTime - now;

//   if (timeUntilExpiration <= 0) {
//     setTokenValid(false);
//     return;
//   }

//   const timer = setTimeout(() => {
//     setTokenValid(false);
//     setError({ message: "Session expired. Please create a new email address." });
//   }, timeUntilExpiration);

//   return () => clearTimeout(timer);
// }, [account]);

//   useEffect(() => {
//     let intervalId = null;

//     if (account && tokenValid) {
//       intervalId = setInterval(() => {
//         fetchInbox(false); // Background polling - no loading indicator
//       }, pollingInterval);
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [account, pollingInterval, tokenValid]);

//   return (
//     <div className={`container-fluid py-4 px-3 px-md-5 ${darkMode ? "dark-mode" : ""}`}>
//       {/* Dynamic SEO for TempMailApp */}
//       <Helmet>
//         <title>
//           {account
//             ? `TempMail Pro - ${account.email}`
//             : "TempMail Pro - Free Temporary Email Service"}
//         </title>
//         <meta
//           name="description"
//           content={
//             account
//               ? `Your temporary email address is ${account.email}. Protect your inbox with TempMail Pro.`
//               : "Get free disposable email addresses with TempMail Pro. Protect your inbox from spam and stay secure."
//           }
//         />
//         <meta property="og:title" content={account ? `TempMail Pro - ${account.email}` : "TempMail Pro - Free Temporary Email Service"} />
//         <meta property="og:description" content={account ? `Your temporary email address is ${account.email}. Protect your inbox with TempMail Pro.` : "Get free disposable email addresses with TempMail Pro. Protect your inbox from spam and stay secure."} />
//         <meta property="og:url" content={currentUrl} />
//         <link rel="canonical" href={currentUrl} />
//       </Helmet>

//       {/* Subtle background polling indicator */}
//       {isBackgroundPolling && (
//         <div className="background-polling-indicator">
//           <div className="spinner-border spinner-border-sm text-primary" role="status">
//             <span className="visually-hidden">Checking for new messages...</span>
//           </div>
//         </div>
//       )}

//       <Navbar
//         emailDuration={emailDuration}
//         setDuration={setDuration}
//         pollingInterval={pollingInterval}
//         setPollingSpeed={setPollingSpeed}
//         pollingIntervals={POLLING_INTERVALS}
//         isNavExpanded={isNavExpanded}
//         setIsNavExpanded={setIsNavExpanded}
//       />

//       <Header
//         darkMode={darkMode}
//         toggleDarkMode={toggleDarkMode}
//       />

//       {/* Error Handler */}
//       {error && (
//         <ErrorAlert
//           error={error}
//           setError={setError}
//           onRetry={fetchInbox}
//         />
//       )}

//       {/* Active Email Card */}
//       {account && (
//         <div className="row justify-content-center mb-4">
//           <div className="col-12 col-md-8 col-lg-6">
//             <EmailCard
//               email={account.email}
//               expiration={account.expiration}
//               isActive={true}
//               isValid={tokenValid}
//               onRenew={() => {
//                 // Create a new email with the same settings
//                 createNewAccount(false);
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {/* TempMail Section */}
//       {!account ? (
//         <div className="d-flex flex-column align-items-center my-5 py-5">
//           <button
//             className="btn btn-primary btn-lg px-5 py-3 fw-bold mb-3"
//             onClick={() => createNewAccount(false)}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                 Creating...
//               </>
//             ) : "Create Temporary Email"}
//           </button>

//           {/* Retry button for account creation errors */}
//           {error && !account && (
//             <div className="text-center">
//               <p className="text-muted mb-2">Having trouble creating an email?</p>
//               <button
//                 className="btn btn-outline-danger"
//                 onClick={() => createNewAccount(false)}
//               >
//                 <i className="fas fa-redo me-2"></i>Retry
//               </button>
//             </div>
//           )}
//         </div>
//       ) : (
//         <>
//           <AccountManager
//             account={account}
//             refreshInbox={() => fetchInbox(true)}
//             onNewEmail={() => createNewAccount(false)}
//           />

//           {/* Generated Emails List */}
//           {generatedEmails.length > 1 && (
//             <div className="mt-4">
//               <h4 className="mb-3">Your Generated Emails</h4>
//               <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
//                 {generatedEmails
//                   .filter(email => email.address !== account.email)
//                   .map((email, index) => (
//                     <div key={index} className="col">
//                       <EmailCard
//                         email={email.address}
//                         expiration={email.expiration}
//                         onDelete={() => deleteEmail(email.address)}
//                         onSwitch={() => switchAccount(email.address)}
//                       />
//                     </div>
//                   ))
//                 }
//               </div>
//             </div>
//           )}

//           <Inbox
//             messages={messages.map((msg) => ({
//               ...msg,
//               token: account.token,
//             }))}
//             isLoading={isInboxLoading}
//             onRetry={() => fetchInbox(true)}
//             onTokenExpired={handleTokenExpired}
//           />

//           {/* Generate New Email Button */}
//           <div className="text-center mt-4">
//             <button
//               className="btn btn-outline-primary"
//               onClick={() => createNewAccount(false)}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                   Creating...
//                 </>
//               ) : "Generate Another Email"}
//             </button>
//           </div>
//         </>
//       )}

//       {/* Footer */}
//       <Footer isDarkMode={darkMode} />
//     </div>
//   );
// }

// // Error Boundary Component to catch errors
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Error caught by boundary:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="container my-5">
//           <div className="alert alert-danger">
//             <h2>Something went wrong.</h2>
//             <p>{this.state.error?.message || "An unexpected error occurred"}</p>
//             <button
//               className="btn btn-primary"
//               onClick={() => this.setState({ hasError: false, error: null })}
//             >
//               Try again
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// // Main App component without useLocation
// function App() {
//   return (
//     <HelmetProvider>
//       <ErrorBoundary>
//         <Router>
//           <Routes>
//             <Route path="/" element={<Landing />} />
//             <Route path="/app" element={<TempMailApp />} />
//             <Route path="/blog/:slug" element={<BlogPost />} />
//             <Route path="/privacy" element={<Privacy />} />
//           </Routes>
//         </Router>
//       </ErrorBoundary>
//     </HelmetProvider>
//   );
// }

// export default App;


// good one above


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import AccountManager from "./components/AccountManager.jsx";
import Inbox from "./components/Inbox.jsx";
import Privacy from "./components/Privacy";
import BlogPost from "./components/BlogPost";
import Landing from "./components/Landing.jsx";
import Footer from "./components/Footer";
import EmailCard from "./components/EmailCard";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import ErrorAlert from "./components/ErrorAlert";

const API_BASE = import.meta.env.VITE_API_BASE;

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

function TempMailApp() {
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

  const location = useLocation();
  const isAppPage = location.pathname === "/app";
// In your TempMailApp component, update the currentUrl logic:
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
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
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
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
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
      createNewAccount(true);
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

  const createNewAccount = async (isAutoGenerated = false) => {
    setIsLoading(true);
    setError(null);
    setShowExpiredCard(false);

    try {
      const res = await axios.post(`${API_BASE}/api/accounts/create`);

      const now = new Date();
      const expirationTime = new Date(now.getTime() + DURATIONS[isAutoGenerated ? "1hour" : emailDuration]);

      const accountData = {
        ...res.data,
        expiration: expirationTime.toISOString(),
        isAutoGenerated
      };

      setAccount(accountData);
      setTokenValid(true);

      if (!generatedEmails.some(email => email.address === accountData.email)) {
        setGeneratedEmails(prev => [...prev, {
          address: accountData.email,
          expiration: accountData.expiration,
          createdAt: new Date().toISOString(),
          token: accountData.token
        }]);
      }

      setMessages([]);
    } catch (err) {
      setError({ message: err.response?.data?.error || "Account creation failed" });
      console.error("Account creation failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchAccount = (emailAddress) => {
    const emailAccount = generatedEmails.find(email => email.address === emailAddress);
    if (emailAccount) {
      setAccount({
        email: emailAccount.address,
        expiration: emailAccount.expiration,
        token: emailAccount.token
      });
      setTokenValid(true);
      setShowExpiredCard(false);
    }
  };

  const deleteEmail = (emailAddress) => {
    setGeneratedEmails(prev => {
      const remaining = prev.filter(email => email.address !== emailAddress);

      // Check if we're deleting the current account
      if (accountRef.current && accountRef.current.email === emailAddress) {
        if (remaining.length > 0) {
          // Switch to the first remaining email
          switchAccount(remaining[0].address);
        } else {
          // No emails left, create a new one
          setAccount(null);
          createNewAccount(true);
        }
      }

      return remaining;
    });
  };

  const fetchInbox = async (showLoading = false) => {
    if (!accountRef.current?.token) return;

    // Check if token is still valid before making the request
    if (accountRef.current.expiration) {
      const now = new Date();
      const expiration = new Date(accountRef.current.expiration);

      if (now > expiration) {
        // Token has expired, update state and return early
        setTokenValid(false);
        setShowExpiredCard(true);
        setError({ message: "Session expired. Please create a new email address." });
        return;
      }
    }

    if (showLoading) {
      setIsInboxLoading(true);
    } else {
      setIsBackgroundPolling(true);
    }

    try {
      const res = await axios.get(`${API_BASE}/api/inbox/${accountRef.current.token}`, {
        timeout: 10000 // 10 second timeout
      });
      
      const inboxArray = Array.isArray(res.data) ? res.data : res.data?.messages || [];

      // Store only the last 20 messages to prevent localStorage bloat
      const limitedMessages = inboxArray.slice(-20);
      setMessages(limitedMessages);
      setError(null);
      setTokenValid(true); // Token is valid if request succeeded
    } catch (err) {
      let errorMessage = "Failed to load inbox";
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please check your connection.";
      } else if (err.response?.status === 401) {
        setTokenValid(false);
        setShowExpiredCard(true);
        errorMessage = "Session expired. Please create a new email address.";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.error("Inbox fetch failed:", err);
      setError({ message: errorMessage });
    } finally {
      if (showLoading) {
        setIsInboxLoading(false);
      } else {
        // Add a small delay to make the background polling indicator visible
        setTimeout(() => setIsBackgroundPolling(false), 300);
      }
    }
  };

  useEffect(() => {
    let intervalId = null;

    if (account && tokenValid) {
      intervalId = setInterval(() => {
        fetchInbox(false); // Background polling - no loading indicator
      }, pollingInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [account, pollingInterval, tokenValid]);

  return (
    <div className={`container-fluid py-4 px-3 px-md-5 ${darkMode ? "dark-mode" : ""}`}>
      {/* Dynamic SEO for TempMailApp */}
      <Helmet>
        <title>
          {account
            ? `TempMail Pro - ${account.email}`
            : "TempMail Pro - Free Temporary Email Service"}
        </title>
        <meta
          name="description"
          content={
            account
              ? `Your temporary email address is ${account.email}. Protect your inbox with TempMail Pro.`
              : "Get free disposable email addresses with TempMail Pro. Protect your inbox from spam and stay secure."
          }
        />
        <meta property="og:title" content={account ? `TempMail Pro - ${account.email}` : "TempMail Pro - Free Temporary Email Service"} />
        <meta property="og:description" content={account ? `Your temporary email address is ${account.email}. Protect your inbox with TempMail Pro.` : "Get free disposable email addresses with TempMail Pro. Protect your inbox from spam and stay secure."} />
       {/* FIXED CANONICAL - Always use clean URL without search params */}
  <link rel="canonical" href={`https://tempmailpk.com${location.pathname}`} />
  
  <meta property="og:url" content={`https://tempmailpk.com${location.pathname}`} />
      </Helmet>

      {/* Subtle background polling indicator */}
      {isBackgroundPolling && (
        <div className="background-polling-indicator">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Checking for new messages...</span>
          </div>
        </div>
      )}

      <Navbar
        emailDuration={emailDuration}
        setDuration={setDuration}
        pollingInterval={pollingInterval}
        setPollingSpeed={setPollingSpeed}
        pollingIntervals={POLLING_INTERVALS}
        isNavExpanded={isNavExpanded}
        setIsNavExpanded={setIsNavExpanded}
      />

      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Error Handler */}
      {error && (
        <ErrorAlert
          error={error}
          setError={setError}
          onRetry={fetchInbox}
        />
      )}

      {/* Active Email Card - Only show when expired */}
      {showExpiredCard && account && (
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8 col-lg-6">
            <EmailCard
              email={account.email}
              expiration={account.expiration}
              isActive={true}
              isValid={false}
              onRenew={() => {
                // Create a new email with the same settings
                createNewAccount(false);
              }}
            />
          </div>
        </div>
      )}

      {/* TempMail Section */}
      {!account ? (
        <div className="d-flex flex-column align-items-center my-5 py-5">
          <button
            className="btn btn-primary btn-lg px-5 py-3 fw-bold mb-3"
            onClick={() => createNewAccount(false)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : "Create Temporary Email"}
          </button>

          {/* Retry button for account creation errors */}
          {error && !account && (
            <div className="text-center">
              <p className="text-muted mb-2">Having trouble creating an email?</p>
              <button
                className="btn btn-outline-danger"
                onClick={() => createNewAccount(false)}
              >
                <i className="fas fa-redo me-2"></i>Retry
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <AccountManager
            account={account}
            refreshInbox={() => fetchInbox(true)}
            onNewEmail={() => createNewAccount(false)}
            isLoading={isLoading || isInboxLoading}
          />

          {/* Generated Emails List - Only show expired emails */}
          {generatedEmails.filter(email => {
            const now = new Date();
            const expiration = new Date(email.expiration);
            return now > expiration && email.address !== account.email;
          }).length > 0 && (
            <div className="mt-4">
              <h4 className="mb-3">Your Expired Emails</h4>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                {generatedEmails
                  .filter(email => {
                    const now = new Date();
                    const expiration = new Date(email.expiration);
                    return now > expiration && email.address !== account.email;
                  })
                  .map((email, index) => (
                    <div key={index} className="col">
                      <EmailCard
                        email={email.address}
                        expiration={email.expiration}
                        onDelete={() => deleteEmail(email.address)}
                        onSwitch={() => switchAccount(email.address)}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          <Inbox
            messages={messages.map((msg) => ({
              ...msg,
              token: account.token,
            }))}
            isLoading={isInboxLoading}
            onRetry={() => fetchInbox(true)}
            onTokenExpired={handleTokenExpired}
          />

          {/* Generate New Email Button */}
          <div className="text-center mt-4">
            <button
              className="btn btn-outline-primary"
              onClick={() => createNewAccount(false)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating...
                </>
              ) : "Generate Another Email"}
            </button>
          </div>
        </>
      )}

      {/* Footer */}
      <Footer isDarkMode={darkMode} />
    </div>
  );
}

// Error Boundary Component to catch errors
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
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<TempMailApp />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
