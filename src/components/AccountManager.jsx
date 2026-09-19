import React, { useState, useEffect } from 'react';
import AppIcon from './AppIcon';

const AccountManager = ({
  account,
  refreshInbox,
  onEmailCopied,
  isLoading = false,
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copyResetTimer, setCopyResetTimer] = useState(null);

  const [showQr, setShowQr] = useState(false);

  const email = account?.address || account?.email || '';

  const copyToClipboard = () => {
    if (!email) return;
    navigator.clipboard.writeText(email).then(() => {
      setCopiedEmail(true);
      if (onEmailCopied) onEmailCopied();
      if (copyResetTimer) {
        clearTimeout(copyResetTimer);
      }
      const timerId = setTimeout(() => setCopiedEmail(false), 2500);
      setCopyResetTimer(timerId);
    }).catch(() => {});
  };

  useEffect(() => {
    return () => {
      if (copyResetTimer) {
        clearTimeout(copyResetTimer);
      }
    };
  }, [copyResetTimer]);

  useEffect(() => {
    if (!account?.expiration) return;
    const calc = () => {
      const diff = new Date(account.expiration) - new Date();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };
    setTimeLeft(calc());
    const t = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(t);
  }, [account]);

  const formatTime = () => {
    if (!account?.expiration) return '—';
    const diff = new Date(account.expiration) - new Date();
    if (diff <= 0) return 'Expired';
    const { days, hours, minutes, seconds } = timeLeft;
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getProgress = () => {
    if (!account?.expiration) return 0;
    const now = Date.now();
    const exp = new Date(account.expiration).getTime();
    const created = account.createdAt ? new Date(account.createdAt).getTime() : exp - 3600000;
    const total = exp - created;
    const elapsed = now - created;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const progress = getProgress();
  const timeStr = formatTime();
  const isCritical = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 5;
  const barColor = progress > 90 ? 'bg-danger' : progress > 70 ? 'bg-warning' : 'bg-info';

  return (
    <div className={`am-card${isCritical ? ' critical' : ''}`}>
      <div className="am-email-row">
        <div className="am-email-icon">
          <AppIcon iconClass="bi bi-envelope-fill" />
        </div>
        <div className="am-email-body">
          <div className="am-email-label d-flex align-items-center gap-2">
            <span>Active Email</span>
            {email.includes('@') && (
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                <AppIcon iconClass="bi bi-globe2 me-1" />{email.split('@')[1]}
              </span>
            )}
          </div>
          <div className="am-email-address" title={email}>
            {email || <span className="am-generating">Generating…</span>}
          </div>
        </div>
        <button
          className={`am-copy-btn${copiedEmail ? ' copied' : ''}`}
          onClick={copyToClipboard}
          disabled={!email || isLoading}
          title="Copy to clipboard"
        >
          {copiedEmail
            ? <><AppIcon iconClass="bi bi-check2 me-1" />Copied</>
            : <><AppIcon iconClass="bi bi-clipboard me-1" />Copy</>}
        </button>
      </div>

      {account?.expiration && (
        <div className="am-expiry-row">
          <div className="am-expiry-info">
            <span className="am-expiry-label">
              <AppIcon iconClass="bi bi-clock me-1" />Expires in
            </span>
            <span className={`am-expiry-time${isCritical ? ' text-danger' : ''}`}>
              {timeStr}
            </span>
          </div>
          <div className="am-progress">
            <div
              className={`am-progress-fill ${barColor}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="am-actions">
        <button
          className="am-action-btn"
          onClick={refreshInbox}
          disabled={isLoading || !account}
          title="Refresh inbox"
        >
          <AppIcon iconClass={`bi bi-arrow-clockwise${isLoading ? ' spin' : ''} me-1`} />
          {isLoading ? 'Refreshing…' : 'Refresh Inbox'}
        </button>
        {email && (
          <button
            className="am-action-btn"
            onClick={() => setShowQr(v => !v)}
            title="Scan QR Code on mobile"
          >
            <AppIcon iconClass="bi bi-qr-code-scan me-1" />
            {showQr ? 'Hide QR' : 'Mobile QR'}
          </button>
        )}
      </div>

      {showQr && email && (
        <div className="text-center p-3 mt-2 bg-light rounded-3 border">
          <div className="fw-bold small text-muted mb-2">Scan with your phone camera:</div>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(email)}`}
            alt={`QR Code for ${email}`}
            width="150"
            height="150"
            className="img-fluid rounded border bg-white p-1"
          />
          <div className="font-monospace small text-primary mt-2">{email}</div>
        </div>
      )}
    </div>
  );
};

export default AccountManager;
