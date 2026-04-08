import React from 'react';

const PROMO_REFERRAL_URL = 'https://www.hostinger.com/pk?REFERRALCODE=ZKDWAQASAVSO';

const PromoCard = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="promo-card-container" role="complementary" aria-label="Suggestion to upgrade from temporary email">
      <div className="promo-card">
        <button
          className="promo-card-close"
          onClick={onClose}
          aria-label="Close promotion"
          type="button"
        >
          ×
        </button>

        <div className="promo-card-badge">⭐ Hostinger recommendation</div>
        <h4 className="promo-card-title">Secure a real inbox with Hostinger</h4>
        <p className="promo-card-description">
          Temp mail is temporary. For important accounts, choose Hostinger's email hosting and custom domain tools for long-term security.
        </p>

        <a
          className="promo-card-button"
          href={PROMO_REFERRAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
        >
          Explore Hostinger →
        </a>

        <p className="promo-card-note">
          Recommended for accounts you want to keep safe and available.
        </p>
      </div>
    </div>
  );
};

export default PromoCard;
