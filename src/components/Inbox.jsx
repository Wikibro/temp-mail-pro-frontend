import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AppIcon from './AppIcon';

// Helper to extract 4-8 digit verification code or OTP from text or subject
function extractVerificationCode(text = '', subject = '') {
  const combined = `${subject} ${text}`;
  const keywordMatch = combined.match(/(?:code|verification|passcode|otp|pin|token|confirm)\s*(?:is|:|=|-)?\s*([0-9]{4,8}|[0-9]{3}-[0-9]{3})/i);
  if (keywordMatch && keywordMatch[1]) {
    return keywordMatch[1].replace('-', '');
  }
  const subjectDigits = subject.match(/\b([0-9]{4,8})\b/);
  if (subjectDigits && subjectDigits[1]) {
    return subjectDigits[1];
  }
  return null;
}

// Format file sizes into human readable strings (e.g. 1.2 MB)
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Gentle audio notification chime
function playInboxChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (_) {}
}

const Inbox = ({ messages = [], isLoading, onRetry, onTokenExpired }) => {
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [messageContent, setMessageContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [contentError, setContentError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [downloadingAttId, setDownloadingAttId] = useState(null);
  const [notifPermission, setNotifPermission] = useState(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied';
  });
  const prevMsgCountRef = useRef(messages?.length || 0);

  const RAW_API_BASE = import.meta.env.VITE_API_BASE || '';
  const API_BASE = RAW_API_BASE.replace(/\/+$/, '');
  const API_ROOT = API_BASE ? `${API_BASE}/api` : '/api';

  // Request browser desktop notification permission
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotifPermission(perm);
      } catch (err) {
        console.warn('Could not request notification permission:', err);
      }
    }
  };

  // Play chime and trigger desktop push notification when new incoming email arrives
  useEffect(() => {
    if (messages && messages.length > prevMsgCountRef.current && prevMsgCountRef.current > 0) {
      playInboxChime();

      // Trigger system desktop push notification if enabled
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        const newest = messages[0];
        const fromName = newest?.from?.name || newest?.from?.address || newest?.from || 'New Sender';
        const sub = newest?.subject || 'New Message Received';
        try {
          const n = new Notification(`New Email: ${fromName}`, {
            body: sub,
            icon: '/icon-192.png',
            tag: newest?.id || 'temp-mail-notif'
          });
          n.onclick = () => {
            window.focus();
            if (newest) setSelectedMsg(newest);
          };
        } catch (_) {}
      }
    }
    prevMsgCountRef.current = messages?.length || 0;
  }, [messages]);

  useEffect(() => {
    if (selectedMsg) {
      fetchMessageContent(selectedMsg);
    }
  }, [selectedMsg]);

  const copyCodeToClipboard = (code, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }).catch(() => {});
  };

  // Download whole email as text/.eml for user's offline backup
  const handleDownloadEmail = () => {
    if (!selectedMsg) return;
    const fromAddr = selectedMsg.from?.address || selectedMsg.from || 'unknown';
    const toAddr = selectedMsg.to?.[0]?.address || selectedMsg.to || 'unknown';
    const dateStr = formatDate(selectedMsg.createdAt);
    const subject = selectedMsg.subject || 'No Subject';
    const body = messageContent?.text || messageContent?.html || selectedMsg.intro || '';

    const fileContent = `From: ${fromAddr}\nTo: ${toAddr}\nDate: ${dateStr}\nSubject: ${subject}\n\n${body}`;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(selectedMsg.subject || 'email').replace(/[^a-z0-9_-]/gi, '_').slice(0, 30)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download individual attachment
  const handleDownloadAttachment = async (attachment) => {
    if (!attachment) return;
    setDownloadingAttId(attachment.id);
    try {
      const token = selectedMsg?.token;
      const messageId = selectedMsg?.id;
      const attachmentId = attachment.id;

      let blobData = null;
      let fileType = attachment.contentType || 'application/octet-stream';

      // 1. Try backend proxy download route first (avoids browser CORS)
      if (token && messageId && attachmentId) {
        try {
          const proxyUrl = `${API_ROOT}/inbox/attachment/${token}/${messageId}/${attachmentId}`;
          const res = await axios.get(proxyUrl, {
            responseType: 'blob',
            timeout: 15000
          });
          if (res.data) {
            blobData = res.data;
            if (res.headers['content-type']) {
              fileType = res.headers['content-type'];
            }
          }
        } catch (proxyErr) {
          console.warn('Proxy download failed, trying direct stream:', proxyErr.message);
        }
      }

      // 2. If proxy didn't return data and direct downloadUrl exists, try direct stream
      if (!blobData && attachment.downloadUrl) {
        let directUrl = attachment.downloadUrl;
        if (!directUrl.startsWith('http')) {
          directUrl = `https://api.mail.tm${directUrl}`;
        }
        try {
          const res = await axios.get(directUrl, {
            responseType: 'blob',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            timeout: 15000
          });
          if (res.data) {
            blobData = res.data;
          }
        } catch (directErr) {
          console.warn('Direct stream download error:', directErr.message);
        }
      }

      // 3. If attachment has content / sample fallback
      if (!blobData) {
        const textFallback = `Attachment: ${attachment.filename || 'file'}\nSize: ${formatFileSize(attachment.size)}\nType: ${attachment.contentType || 'unknown'}`;
        blobData = new Blob([textFallback], { type: 'text/plain;charset=utf-8' });
      }

      // Trigger browser download via Blob URL
      const finalBlob = blobData instanceof Blob ? blobData : new Blob([blobData], { type: fileType });
      const blobUrl = URL.createObjectURL(finalBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = attachment.filename || 'attachment';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.error('Attachment download failed:', err);
      alert('Could not download attachment: ' + (err.message || 'Network error'));
    } finally {
      setDownloadingAttId(null);
    }
  };

  const fetchMessageContent = async (msg) => {
    setLoadingContent(true);
    setContentError(null);
    
    try {
      const res = await axios.get(`${API_ROOT}/inbox/content/${msg.token}/${msg.id}`, {
        validateStatus: (status) => status < 500 // Don't reject on 401/403
      });

      // Check for token expiration
      if (res.status === 401 || res.status === 403) {
        const errorMsg = res.data?.error || 'Token expired. Please create a new email address.';
        setContentError(errorMsg);
        if (onTokenExpired) onTokenExpired();
        return;
      }

      setMessageContent(res.data);
    } catch (err) {
      console.error('Message content error:', err);
      
      // Handle token expiration
      if (err.response?.status === 401 || err.response?.status === 403) {
        const errorMsg = err.response?.data?.error || 'Token expired. Please create a new email address.';
        setContentError(errorMsg);
        if (onTokenExpired) onTokenExpired();
      } else {
        setContentError(err.message);
        setMessageContent({
          text: 'Failed to load content: ' + err.message,
          html: '<p>Failed to load content. Please try again.</p>',
        });
      }
    } finally {
      setLoadingContent(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Unknown date';
    }
  };

  // If there's an error in the parent component, show error state
  if (messages === null) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="text-danger mb-3">
            <AppIcon iconClass="bi bi-exclamation-triangle-fill fs-1" />
          </div>
          <h5 className="text-danger">Failed to load inbox</h5>
          <p className="text-muted">Could not retrieve your messages</p>
          {onRetry && (
            <button 
              className="btn btn-primary mt-3"
              onClick={onRetry}
            >
              <AppIcon iconClass="bi bi-arrow-clockwise me-2" />Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your messages...</p>
        </div>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="text-muted mb-3">
            <AppIcon iconClass="bi bi-inbox fs-1" />
          </div>
          <h5 className="text-muted">Your inbox is empty</h5>
          <p className="text-muted">Incoming messages &amp; verification codes will appear here automatically</p>
        </div>
      </div>
    );
  }

  const activeMsgCode = selectedMsg ? extractVerificationCode(messageContent?.text || selectedMsg?.intro || '', selectedMsg?.subject || '') : null;

  return (
    <>
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0">Inbox ({messages.length})</h5>
            {typeof window !== 'undefined' && 'Notification' in window && notifPermission !== 'granted' && (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary py-0 px-2 d-none d-sm-inline-flex align-items-center"
                onClick={requestNotificationPermission}
                title="Enable desktop notifications for new emails"
                style={{ fontSize: '0.75rem', height: '26px' }}
              >
                <AppIcon iconClass="bi bi-bell-fill me-1" />
                Notify Me
              </button>
            )}
            {notifPermission === 'granted' && (
              <span className="badge bg-success-subtle text-success border border-success-subtle d-none d-sm-inline-flex align-items-center" style={{ fontSize: '0.72rem' }}>
                <AppIcon iconClass="bi bi-bell-fill me-1" />
                Alerts On
              </span>
            )}
          </div>
          {onRetry && (
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={onRetry}
              title="Refresh inbox"
            >
              <AppIcon iconClass="bi bi-arrow-clockwise" />
            </button>
          )}
        </div>
        <div className="list-group list-group-flush">
          {messages.map((msg) => {
            const detectedCode = extractVerificationCode(msg.intro || msg.text || '', msg.subject || '');
            return (
              <div
                key={msg.id}
                className="list-group-item list-group-item-action py-3 message-list-item"
                onClick={() => setSelectedMsg(msg)}
                style={{ cursor: 'pointer' }}
              >
                {/* Custom message-item layout */}
                <div className="message-item d-flex align-items-center">
                  <div className="message-icon me-3 d-flex justify-content-center align-items-center bg-primary text-white rounded-circle flex-shrink-0" style={{ width: 40, height: 40 }}>
                    {msg.from?.address ? msg.from.address[0].toUpperCase() : '?'}
                  </div>
                  <div className="message-content flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <div className="message-subject fw-bold text-truncate">
                        {msg.subject || '(No Subject)'}
                      </div>
                      {detectedCode && (
                        <button
                          type="button"
                          className={`btn btn-sm px-2 py-0 fw-bold flex-shrink-0 ${copiedCode === detectedCode ? 'btn-success' : 'btn-outline-primary'}`}
                          onClick={(e) => copyCodeToClipboard(detectedCode, e)}
                          title="Copy verification code"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <AppIcon iconClass={copiedCode === detectedCode ? "bi bi-check2 me-1" : "bi bi-key-fill me-1"} />
                          {copiedCode === detectedCode ? 'Copied' : `OTP: ${detectedCode}`}
                        </button>
                      )}
                    </div>
                    <div className="message-preview text-muted small text-truncate">
                      From: {msg.from?.address || msg.from || 'Unknown sender'}
                    </div>
                    <div className="d-flex align-items-center justify-content-between message-meta text-muted small">
                      <span>{formatDate(msg.createdAt)}</span>
                      {((msg.hasAttachments || (msg.attachments && msg.attachments.length > 0))) && (
                        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle d-inline-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                          <AppIcon iconClass="bi bi-paperclip" />
                          <span>Attachment</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <section className="monetag-inbox-ad-section" aria-label="Sponsored content">
        <div className="monetag-app-ad-slot monetag-app-ad-slot--compact">
          <div className="monetag-ad-slot__label">Sponsored</div>
          <div className="monetag-ads monetag-ads--compact" data-zone="11505330" data-ad-format="auto" aria-live="polite"></div>
        </div>
      </section>

      {selectedMsg && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          onClick={() => setSelectedMsg(null)}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-dialog-scrollable inbox-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content inbox-modal-content">
              <div className="modal-header inbox-modal-header">
                <h5 className="modal-title">
                  {selectedMsg.subject || '(No Subject)'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedMsg(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body inbox-modal-body">
                {/* Instant OTP Bar in message modal */}
                {activeMsgCode && (
                  <div className="alert alert-primary d-flex align-items-center justify-content-between py-2 px-3 mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <AppIcon iconClass="bi bi-shield-check text-primary fs-5" />
                      <div>
                        <div className="fw-bold" style={{ fontSize: '0.85rem' }}>Verification Code Detected</div>
                        <div className="font-monospace fs-5 fw-bold text-dark">{activeMsgCode}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`btn btn-sm ${copiedCode === activeMsgCode ? 'btn-success' : 'btn-primary'}`}
                      onClick={(e) => copyCodeToClipboard(activeMsgCode, e)}
                    >
                      <AppIcon iconClass={copiedCode === activeMsgCode ? "bi bi-check2 me-1" : "bi bi-clipboard me-1"} />
                      {copiedCode === activeMsgCode ? 'Copied' : 'Copy Code'}
                    </button>
                  </div>
                )}

                <div className="inbox-meta-block">
                  <div className="inbox-meta-row">
                    <span className="inbox-meta-label">From</span>
                    <span className="inbox-meta-value">{selectedMsg.from?.address || selectedMsg.from || 'Unknown'}</span>
                  </div>
                  <div className="inbox-meta-row">
                    <span className="inbox-meta-label">To</span>
                    <span className="inbox-meta-value">{selectedMsg.to?.[0]?.address || selectedMsg.to || 'Unknown'}</span>
                  </div>
                  <div className="inbox-meta-row">
                    <span className="inbox-meta-label">Date</span>
                    <span className="inbox-meta-value">{formatDate(selectedMsg.createdAt)}</span>
                  </div>
                </div>

                {/* Attachments Section (if present) */}
                {((messageContent?.attachments && messageContent.attachments.length > 0) || (selectedMsg.attachments && selectedMsg.attachments.length > 0)) && (
                  <div className="card bg-light border-0 mb-3 p-2">
                    <div className="d-flex align-items-center gap-2 mb-2 px-1 text-secondary fw-semibold" style={{ fontSize: '0.82rem' }}>
                      <AppIcon iconClass="bi bi-paperclip fs-6" />
                      <span>Attachments ({((messageContent?.attachments || selectedMsg.attachments) || []).length})</span>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {((messageContent?.attachments || selectedMsg.attachments) || []).map((att, idx) => (
                        <div
                          key={att.id || idx}
                          className="d-flex align-items-center justify-content-between bg-white p-2 rounded border"
                          style={{ fontSize: '0.85rem' }}
                        >
                          <div className="d-flex align-items-center gap-2 text-truncate me-2">
                            <AppIcon iconClass="bi bi-file-earmark-arrow-down text-primary fs-5 flex-shrink-0" />
                            <div className="text-truncate">
                              <div className="fw-medium text-truncate">{att.filename || 'attachment'}</div>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>{formatFileSize(att.size)}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary flex-shrink-0 d-flex align-items-center gap-1"
                            disabled={downloadingAttId === att.id}
                            onClick={() => handleDownloadAttachment(att)}
                          >
                            {downloadingAttId === att.id ? (
                              <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span>Downloading...</span>
                              </>
                            ) : (
                              <>
                                <AppIcon iconClass="bi bi-download" />
                                <span>Download</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-top pt-3">
                  {loadingContent ? (
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
                    <div className="alert alert-danger">
                      <div className="d-flex justify-content-between align-items-center inbox-content-error-row">
                        <span>Error loading content: {contentError}</span>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => fetchMessageContent(selectedMsg)}
                        >
                          <AppIcon iconClass="bi bi-arrow-clockwise me-1" />Retry
                        </button>
                      </div>
                    </div>
                  ) : messageContent?.html ? (
                    <div
                      className="email-html-content"
                      dangerouslySetInnerHTML={{ __html: messageContent.html }}
                    />
                  ) : (
                    <pre className="email-content bg-light p-3 rounded">
                      {messageContent?.text || 'No message content'}
                    </pre>
                  )}
                </div>
              </div>
              <div className="modal-footer inbox-modal-footer d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  onClick={handleDownloadEmail}
                  title="Export and save email as text file"
                >
                  <AppIcon iconClass="bi bi-file-earmark-arrow-down" />
                  <span>Save Email (.txt)</span>
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedMsg(null)}
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
};

export default Inbox;