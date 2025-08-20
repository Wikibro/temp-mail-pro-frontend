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

import React, { useState } from 'react';

const AccountManager = ({ account, refreshInbox }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card mb-4 border-primary">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">Your Temporary Email</h5>
          <span className="badge bg-success">Active</span>
        </div>
        
        <div className="mb-3">
          <label className="form-label text-muted">Email Address</label>
          <div className="input-group">
            <input 
              type="text" 
              className="form-control" 
              value={account.address} 
              readOnly 
            />
            <button 
              className="btn btn-outline-primary" 
              type="button"
              onClick={() => copyToClipboard(account.address)}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            className="btn btn-primary"
            onClick={refreshInbox}
          >
            Refresh Inbox
          </button>
          <button 
            className="btn btn-outline-danger"
            onClick={() => {
              localStorage.removeItem('tempMailAccount');
              window.location.reload();
            }}
          >
            Reset Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountManager;