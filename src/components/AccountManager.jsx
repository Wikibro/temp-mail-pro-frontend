// working good
// import React, { useState } from 'react';

// export default function AccountManager({ account, refreshInbox }) {
//   const [copied, setCopied] = useState(false);
  
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="card mb-4 border-primary">
//       <div className="card-body">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="card-title mb-0">Your Temporary Email</h5>
//           <span className="badge bg-success">Active</span>
//         </div>
        
//         <div className="mb-3">
//           <label className="form-label text-muted">Email Address</label>
//           <div className="input-group">
//             <input 
//               type="text" 
//               className="form-control" 
//               value={account.address} 
//               readOnly 
//             />
//             <button 
//               className="btn btn-outline-primary" 
//               type="button"
//               onClick={() => copyToClipboard(account.address)}
//             >
//               {copied ? '✓ Copied' : 'Copy'}
//             </button>
//           </div>
//         </div>
        
//         <div className="d-flex gap-2">
//           <button 
//             className="btn btn-primary"
//             onClick={refreshInbox}
//           >
//             Refresh Inbox
//           </button>
//           <button 
//             className="btn btn-outline-danger"
//             onClick={() => {
//               localStorage.removeItem('tempMailAccount');
//               window.location.reload();
//             }}
//           >
//             Reset Account
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// final
// import React, { useState } from 'react';

// const AccountManager = ({ account, refreshInbox }) => {
//   const [copied, setCopied] = useState(false);
  
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="card mb-4 border-primary">
//       <div className="card-body">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="card-title mb-0">Your Temporary Email</h5>
//           <span className="badge bg-success">Active</span>
//         </div>
        
//         <div className="mb-3">
//           <label className="form-label text-muted">Email Address</label>
//           <div className="input-group">
//             <input 
//               type="text" 
//               className="form-control" 
//               value={account.address} 
//               readOnly 
//             />
//             <button 
//               className="btn btn-outline-primary" 
//               type="button"
//               onClick={() => copyToClipboard(account.address)}
//             >
//               {copied ? '✓ Copied' : 'Copy'}
//             </button>
//           </div>
//         </div>
        
//         <div className="d-flex gap-2">
//           <button 
//             className="btn btn-primary"
//             onClick={refreshInbox}
//           >
//             Refresh Inbox
//           </button>
//           <button 
//             className="btn btn-outline-danger"
//             onClick={() => {
//               localStorage.removeItem('tempMailAccount');
//               window.location.reload();
//             }}
//           >
//             Reset Account
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountManager;

// import React from "react";

// export default function AccountManager({ account, refreshInbox }) {
//   return (
//     <div className="mb-3">
//       <p>
//         <strong>Email:</strong> {account.address}
//       </p>
//       <button className="btn btn-secondary btn-sm" onClick={refreshInbox}>
//         Refresh Inbox
//       </button>
//     </div>
//   );
// }

























// import React, { useState } from 'react';

// const AccountManager = ({ account, refreshInbox }) => {
//   const [copied, setCopied] = useState(false);
  
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="card mb-4 border-primary">
//       <div className="card-body">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="card-title mb-0">Your Temporary Email</h5>
//           <span className="badge bg-success">Active</span>
//         </div>
        
//         <div className="mb-3">
//           <label className="form-label text-muted">Email Address</label>
//           <div className="input-group">
//             <input 
//               type="text" 
//               className="form-control" 
//               value={account.address} 
//               readOnly 
//             />
//             <button 
//               className="btn btn-outline-primary" 
//               type="button"
//               onClick={() => copyToClipboard(account.address)}
//             >
//               {copied ? '✓ Copied' : 'Copy'}
//             </button>
//           </div>
//         </div>
        
//         <div className="d-flex gap-2">
//           <button 
//             className="btn btn-primary"
//             onClick={refreshInbox}
//           >
//             Refresh Inbox
//           </button>
//           <button 
//             className="btn btn-outline-danger"
//             onClick={() => {
//               localStorage.removeItem('tempMailAccount');
//               window.location.reload();
//             }}
//           >
//             Reset Account
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountManager;




















// import React, { useState, useEffect } from 'react';

// const AccountManager = ({ 
//   account, 
//   refreshInbox, 
//   onNewEmail,
//   isLoading = false
// }) => {
//   const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//   const [localLoading, setLocalLoading] = useState(false);
//   const [copiedEmail, setCopiedEmail] = useState(false);
  
//   // Copy email to clipboard
//   const copyToClipboard = (email) => {
//     navigator.clipboard.writeText(email).then(() => {
//       setCopiedEmail(true);
//       setTimeout(() => setCopiedEmail(false), 2000);
//     }).catch(err => {
//       console.error('Failed to copy: ', err);
//     });
//   };

//   // Countdown timer for email expiry
//   useEffect(() => {
//     if (!account?.expiration) return;
    
//     const calculateTimeLeft = () => {
//       const expiration = new Date(account.expiration);
//       const now = new Date();
//       const difference = expiration - now;
      
//       if (difference <= 0) {
//         return { days: 0, hours: 0, minutes: 0, seconds: 0 };
//       }
      
//       return {
//         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//         minutes: Math.floor((difference / 1000 / 60) % 60),
//         seconds: Math.floor((difference / 1000) % 60)
//       };
//     };
    
//     const updateTimer = () => {
//       const timeLeft = calculateTimeLeft();
//       setTimeLeft(timeLeft);
//     };
    
//     // Update immediately
//     updateTimer();
    
//     // Then update every second
//     const timer = setInterval(updateTimer, 1000);
    
//     return () => clearInterval(timer);
//   }, [account]);
  
//   const formatTime = () => {
//     if (!account?.expiration) return "Loading...";
    
//     const expiration = new Date(account.expiration);
//     const now = new Date();
//     if (expiration <= now) return "Expired";
    
//     if (timeLeft.days > 0) {
//       return `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`;
//     } else if (timeLeft.hours > 0) {
//       return `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
//     } else if (timeLeft.minutes > 0) {
//       return `${timeLeft.minutes}m ${timeLeft.seconds}s`;
//     } else {
//       return `${timeLeft.seconds}s`;
//     }
//   };

//   const getProgressPercentage = () => {
//     if (!account?.expiration) return 0;
    
//     const expiration = new Date(account.expiration);
//     const now = new Date();
//     const createdAt = account.createdAt ? new Date(account.createdAt) : new Date(now.getTime() - 3600000); // Default to 1 hour ago if not set
//     const totalDuration = expiration - createdAt;
//     const elapsed = now - createdAt;
    
//     if (elapsed >= totalDuration) return 100;
//     return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
//   };

//   const getExpiryType = () => {
//     if (!account?.expiration) return "unknown";
    
//     const expiration = new Date(account.expiration);
//     const now = new Date();
//     const hoursLeft = (expiration - now) / (1000 * 60 * 60);
    
//     if (hoursLeft <= 0.17) return "10 minutes"; // Less than 10 minutes
//     if (hoursLeft <= 1) return "1 hour";
//     if (hoursLeft <= 24) return "24 hours";
//     return "Permanent";
//   };

//   const handleRefresh = async () => {
//     setLocalLoading(true);
//     try {
//       await refreshInbox();
//     } catch (error) {
//       console.error("Error refreshing inbox:", error);
//     } finally {
//       setLocalLoading(false);
//     }
//   };

//   const handleNewEmail = async () => {
//     setLocalLoading(true);
//     try {
//       await onNewEmail();
//     } catch (error) {
//       console.error("Error creating new email:", error);
//     } finally {
//       setLocalLoading(false);
//     }
//   };

//   const handleReset = () => {
//     localStorage.removeItem('tempMailAccount');
//     localStorage.removeItem('generatedEmails');
//     window.location.reload();
//   };

//   return (
//     <div className="card mb-4 border-primary">
//       <div className="card-body">
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h5 className="card-title mb-0">Your Temporary Email</h5>
//           <span className="badge bg-success">Active</span>
//         </div>
        
//         <div className="mb-3">
//           <label className="form-label text-muted">Email Address</label>
//           <div className="input-group">
//             <input 
//               type="text" 
//               className="form-control fw-bold fs-5" 
//               value={account?.email || "Generating email..."} 
//               readOnly 
//               placeholder="Generating email..."
//             />
//             <button 
//               className={`btn ${copiedEmail ? 'btn-success' : 'btn-outline-primary'}`}
//               type="button"
//               onClick={() => account?.email && copyToClipboard(account.email)}
//               disabled={isLoading || localLoading || !account?.email}
//             >
//               {copiedEmail ? '✓ Copied' : 'Copy'}
//             </button>
//           </div>
//         </div>
        
//         {account?.expiration && (
//           <div className="mb-3">
//             <div className="d-flex justify-content-between align-items-center">
//               <span className="text-muted">Expires in:</span>
//               <span className={`fw-bold ${timeLeft.minutes < 5 && timeLeft.hours === 0 && timeLeft.days === 0 ? 'text-danger' : ''}`}>
//                 {formatTime()}
//               </span>
//             </div>
//             <div className="progress" style={{ height: '5px' }}>
//               <div 
//                 className={`progress-bar ${getProgressPercentage() > 90 ? 'bg-danger' : getProgressPercentage() > 70 ? 'bg-warning' : 'bg-info'}`}
//                 role="progressbar" 
//                 style={{ width: `${getProgressPercentage()}%` }}
//               ></div>
//             </div>
//             <small className="text-muted">
//               Type: {getExpiryType()}
//             </small>
//           </div>
//         )}
        
//         <div className="d-flex gap-2 flex-wrap">
//           <button 
//             className="btn btn-primary"
//             onClick={handleRefresh}
//             disabled={isLoading || localLoading || !account}
//           >
//             <i className="bi bi-arrow-clockwise me-1"></i> 
//             {localLoading ? "Refreshing..." : "Refresh Inbox"}
//           </button>
//           <button 
//             className="btn btn-outline-secondary"
//             onClick={handleNewEmail}
//             disabled={isLoading || localLoading}
//           >
//             <i className="bi bi-plus-circle me-1"></i> New Email
//           </button>
//           <button 
//             className="btn btn-outline-danger"
//             onClick={handleReset}
//             disabled={isLoading || localLoading}
//           >
//             <i className="bi bi-trash me-1"></i> Reset
//           </button>
//         </div>
        
//         {(isLoading || localLoading) && (
//           <div className="mt-3 text-center">
//             <div className="spinner-border spinner-border-sm text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//             <small className="text-muted ms-2">Processing...</small>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AccountManager;







import React, { useState, useEffect } from 'react';

const AccountManager = ({ 
  account, 
  refreshInbox, 
  onNewEmail,
  isLoading = false
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [localLoading, setLocalLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  
  // Use the correct property name (address instead of email)
  const email = account?.address || account?.email || "";
  
  // Copy email to clipboard
  const copyToClipboard = (email) => {
    navigator.clipboard.writeText(email).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // Countdown timer for email expiry
  useEffect(() => {
    if (!account?.expiration) return;
    
    const calculateTimeLeft = () => {
      const expiration = new Date(account.expiration);
      const now = new Date();
      const difference = expiration - now;
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };
    
    const updateTimer = () => {
      const timeLeft = calculateTimeLeft();
      setTimeLeft(timeLeft);
    };
    
    // Update immediately
    updateTimer();
    
    // Then update every second
    const timer = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timer);
  }, [account]);
  
  const formatTime = () => {
    if (!account?.expiration) return "Loading...";
    
    const expiration = new Date(account.expiration);
    const now = new Date();
    if (expiration <= now) return "Expired";
    
    // Fix the undefined issue by ensuring all values are numbers
    const days = timeLeft.days || 0;
    const hours = timeLeft.hours || 0;
    const minutes = timeLeft.minutes || 0;
    const seconds = timeLeft.seconds || 0;
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getProgressPercentage = () => {
    if (!account?.expiration) return 0;
    
    const expiration = new Date(account.expiration);
    const now = new Date();
    const createdAt = account.createdAt ? new Date(account.createdAt) : new Date(now.getTime() - 3600000);
    const totalDuration = expiration - createdAt;
    const elapsed = now - createdAt;
    
    if (elapsed >= totalDuration) return 100;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const getExpiryType = () => {
    if (!account?.expiration) return "unknown";
    
    const expiration = new Date(account.expiration);
    const now = new Date();
    const hoursLeft = (expiration - now) / (1000 * 60 * 60);
    
    if (hoursLeft <= 0.17) return "10 minutes";
    if (hoursLeft <= 1) return "1 hour";
    if (hoursLeft <= 24) return "24 hours";
    return "Permanent";
  };

  const handleRefresh = async () => {
    setLocalLoading(true);
    try {
      await refreshInbox();
    } catch (error) {
      console.error("Error refreshing inbox:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleNewEmail = async () => {
    setLocalLoading(true);
    try {
      await onNewEmail();
    } catch (error) {
      console.error("Error creating new email:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('tempMailAccount');
    localStorage.removeItem('generatedEmails');
    window.location.reload();
  };

  return (
    <div className="card mb-4 border-primary">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">Your Temporary Email</h5>
          {/* <span className="badge bg-success">Active</span> */}
        </div>
        
        <div className="mb-3">
          <label className="form-label text-muted">Email Address</label>
          <div className="input-group">
            <input 
              type="text" 
              className="form-control fw-bold fs-5" 
              value={email || "Generating email..."} 
              readOnly 
              placeholder="Generating email..."
            />
            <button 
              className={`btn ${copiedEmail ? 'btn-success' : 'btn-outline-primary'}`}
              type="button"
              onClick={() => email && copyToClipboard(email)}
              disabled={isLoading || localLoading || !email}
            >
              {copiedEmail ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
        
        {account?.expiration && (
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">Expires in:</span>
              <span className={`fw-bold ${timeLeft.minutes < 5 && timeLeft.hours === 0 && timeLeft.days === 0 ? 'text-danger' : ''}`}>
                {formatTime()}
              </span>
            </div>
            <div className="progress" style={{ height: '5px' }}>
              <div 
                className={`progress-bar ${getProgressPercentage() > 90 ? 'bg-danger' : getProgressPercentage() > 70 ? 'bg-warning' : 'bg-info'}`}
                role="progressbar" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <small className="text-muted">
              Type: {getExpiryType()}
            </small>
          </div>
        )}
        
        <div className="d-flex gap-2 flex-wrap">
          {/* <button 
            className="btn btn-primary"
            onClick={handleRefresh}
            disabled={isLoading || localLoading || !account}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> 
            {localLoading ? "Refreshing..." : "Refresh Inbox"}
          </button> */}
          <button 
            className="btn btn-outline-secondary"
            onClick={handleNewEmail}
            disabled={isLoading || localLoading}
          >
            <i className="bi bi-plus-circle me-1"></i> New Email
          </button>
          <button 
            className="btn btn-outline-danger"
            onClick={handleReset}
            disabled={isLoading || localLoading}
          >
            <i className="bi bi-trash me-1"></i> Reset
          </button>
        </div>
        
        {(isLoading || localLoading) && (
          <div className="mt-3 text-center">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <small className="text-muted ms-2">Processing...</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManager;