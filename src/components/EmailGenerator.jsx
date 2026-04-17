import React, { useState } from 'react';

const PRESETS = [
  { label: '10 min', ms: 10 * 60 * 1000 },
  { label: '1 hour', ms: 60 * 60 * 1000 },
  { label: '24 hours', ms: 24 * 60 * 60 * 1000 },
  { label: '7 days', ms: 7 * 24 * 60 * 60 * 1000 },
];

const UNITS = [
  { label: 'Minutes', value: 'min', ms: 60 * 1000, min: 1, max: 59 },
  { label: 'Hours', value: 'hr', ms: 3600 * 1000, min: 1, max: 720 },
  { label: 'Days', value: 'day', ms: 86400 * 1000, min: 1, max: 365 },
];

const DOMAIN_HINT = 'mail.tm';

const EmailGenerator = ({ onGenerate, isLoading, compact = false }) => {
  const [customName, setCustomName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(1); // 1 hour default
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(30);
  const [customUnit, setCustomUnit] = useState('min');

  const getDurationMs = () => {
    if (isCustom) {
      const unit = UNITS.find((u) => u.value === customUnit);
      return (customValue || 1) * unit.ms;
    }
    return PRESETS[selectedPreset].ms;
  };

  const getLabel = () => {
    if (isCustom) {
      const unit = UNITS.find((u) => u.value === customUnit);
      const val = customValue || 1;
      return `${val} ${unit.label}`;
    }
    return PRESETS[selectedPreset].label;
  };

  const sanitizeName = (v) =>
    v.toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 30);

  const handleGenerate = () => {
    onGenerate({
      customName: customName.trim() || null,
      durationMs: getDurationMs(),
    });
  };

  const unitConfig = UNITS.find((u) => u.value === customUnit);

  if (compact) {
    return (
      <div className="eg-compact">
        {/* Name input */}
        <div className="eg-name-row mb-2">
          <div className="eg-name-input-wrap">
            <input
              type="text"
              className="eg-name-input"
              placeholder="username (optional)"
              value={customName}
              onChange={(e) => setCustomName(sanitizeName(e.target.value))}
              maxLength={30}
            />
            <span className="eg-domain-hint">@{DOMAIN_HINT}</span>
          </div>
        </div>

        {/* Duration chips */}
        <div className="eg-chips mb-2">
          {PRESETS.map((p, i) => (
            <button
              key={i}
              type="button"
              className={`eg-chip${!isCustom && selectedPreset === i ? ' active' : ''}`}
              onClick={() => { setSelectedPreset(i); setIsCustom(false); }}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            className={`eg-chip${isCustom ? ' active' : ''}`}
            onClick={() => setIsCustom(true)}
          >
            Custom
          </button>
        </div>

        {/* Custom duration row */}
        {isCustom && (
          <div className="eg-custom-row mb-2">
            <input
              type="number"
              className="eg-custom-num"
              value={customValue}
              min={unitConfig.min}
              max={unitConfig.max}
              onChange={(e) => setCustomValue(Math.max(unitConfig.min, Math.min(unitConfig.max, parseInt(e.target.value) || unitConfig.min)))}
            />
            <select
              className="eg-custom-unit"
              value={customUnit}
              onChange={(e) => setCustomUnit(e.target.value)}
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        )}

        <button
          className="btn btn-primary w-100 eg-generate-btn"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? (
            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generating…</>
          ) : (
            <><i className="bi bi-lightning-charge-fill me-1"></i>Generate Email</>
          )}
        </button>
      </div>
    );
  }

  // Full hero layout
  return (
    <div className="eg-hero">
      <div className="eg-hero-card">
        <div className="eg-hero-icon">
          <i className="bi bi-envelope-plus-fill"></i>
        </div>
        <h2 className="eg-hero-title">Create Your Temp Email</h2>
        <p className="eg-hero-sub">
          Protect your inbox. No registration, instant setup.
        </p>

        {/* Custom username field */}
        <div className="eg-field-group">
          <label className="eg-label">
            <i className="bi bi-person me-1"></i>Username <span className="eg-optional">(optional)</span>
          </label>
          <div className="eg-name-input-wrap">
            <input
              type="text"
              className="eg-name-input"
              placeholder="e.g. john, shop2026…"
              value={customName}
              onChange={(e) => setCustomName(sanitizeName(e.target.value))}
              maxLength={30}
            />
            <span className="eg-domain-hint">@{DOMAIN_HINT}</span>
          </div>
          {customName && (
            <div className="eg-preview">
              Preview: <strong>{customName}@{DOMAIN_HINT}</strong>
            </div>
          )}
        </div>

        {/* Duration selector */}
        <div className="eg-field-group">
          <label className="eg-label">
            <i className="bi bi-clock me-1"></i>Email Duration
          </label>
          <div className="eg-chips">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                className={`eg-chip${!isCustom && selectedPreset === i ? ' active' : ''}`}
                onClick={() => { setSelectedPreset(i); setIsCustom(false); }}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              className={`eg-chip eg-chip-custom${isCustom ? ' active' : ''}`}
              onClick={() => setIsCustom(true)}
            >
              <i className="bi bi-sliders me-1"></i>Custom
            </button>
          </div>

          {isCustom && (
            <div className="eg-custom-row mt-2">
              <input
                type="number"
                className="eg-custom-num"
                value={customValue}
                min={unitConfig.min}
                max={unitConfig.max}
                onChange={(e) =>
                  setCustomValue(
                    Math.max(unitConfig.min, Math.min(unitConfig.max, parseInt(e.target.value) || unitConfig.min))
                  )
                }
              />
              <select
                className="eg-custom-unit"
                value={customUnit}
                onChange={(e) => { setCustomUnit(e.target.value); setCustomValue(1); }}
              >
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              <span className="eg-custom-summary">= {getLabel()}</span>
            </div>
          )}
        </div>

        {/* Generate button */}
        <button
          className="eg-generate-btn-hero btn btn-primary"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? (
            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generating your email…</>
          ) : (
            <><i className="bi bi-lightning-charge-fill me-2"></i>Generate Email</>
          )}
        </button>

        <p className="eg-note">
          <i className="bi bi-shield-check me-1 text-success"></i>
          Free &amp; anonymous — no sign-up required
        </p>
      </div>
    </div>
  );
};

export default EmailGenerator;
