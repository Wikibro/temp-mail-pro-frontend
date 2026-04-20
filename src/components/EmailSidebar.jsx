import React from 'react';
import AppIcon from './AppIcon';

const EmailSidebar = ({
  generatedEmails = [],
  activeToken,
  inboxCounts = {},
  isCreating = false,
  onSwitch,
  onDelete,
  onCreateNew,
}) => {
  const now = new Date();

  const activeEmails = generatedEmails.filter(
    (e) => new Date(e.expiration) > now
  );
  const expiredEmails = generatedEmails.filter(
    (e) => new Date(e.expiration) <= now
  );

  const formatExpiry = (expiration) => {
    const diff = new Date(expiration) - now;
    if (diff <= 0) return 'Expired';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const EmailRow = ({ email, isExpired = false }) => {
    const isSelected = email.token === activeToken;
    const count = inboxCounts[email.token] || 0;
    const addr = email.address || email.email || '';

    return (
      <div
        className={`email-sidebar-row${isSelected ? ' selected' : ''}${isExpired ? ' expired' : ''}`}
        onClick={() => !isExpired && onSwitch && onSwitch(email.address)}
        title={addr}
      >
        <div className="email-sidebar-avatar">
          {addr[0]?.toUpperCase() || '?'}
        </div>
        <div className="email-sidebar-info">
          <div className="email-sidebar-addr">{addr}</div>
          <div className="email-sidebar-meta">
            {isExpired ? (
              <span className="badge bg-secondary">Expired</span>
            ) : (
              <span className="email-sidebar-expiry">⏱ {formatExpiry(email.expiration)}</span>
            )}
          </div>
        </div>
        <div className="email-sidebar-actions">
          {count > 0 && !isExpired && (
            <span className="badge bg-primary rounded-pill email-sidebar-badge">{count}</span>
          )}
          {onDelete && (
            <button
              className="email-sidebar-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(email.address);
              }}
              title="Remove"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="email-sidebar">
      <div className="email-sidebar-header">
        <span className="email-sidebar-title">
          <AppIcon iconClass="bi bi-inbox-fill me-2" />Inboxes
        </span>
        <span className="badge bg-primary rounded-pill">{activeEmails.length}</span>
      </div>

      <div className="email-sidebar-list">
        {activeEmails.length === 0 && (
          <div className="email-sidebar-empty">No active emails</div>
        )}
        {activeEmails.map((email) => (
          <EmailRow key={email.token || email.address} email={email} />
        ))}

        {expiredEmails.length > 0 && (
          <>
            <div className="email-sidebar-section-label">Expired</div>
            {expiredEmails.map((email) => (
              <EmailRow key={email.token || email.address} email={email} isExpired />
            ))}
          </>
        )}
      </div>

      <div className="email-sidebar-footer">
        <button
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={onCreateNew}
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Creating…
            </>
          ) : (
            <>
              <AppIcon iconClass="bi bi-plus-lg" /> New Email
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EmailSidebar;
