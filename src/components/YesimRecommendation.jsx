import React from 'react';
import AppIcon from './AppIcon';
import { AFFILIATE_REL, getAffiliateLink, PARTNER_DESTINATIONS } from '../utils/affiliateLinks';
import { trackAffiliateClick } from '../utils/affiliateTracking';

const YesimRecommendation = ({ context = 'landing' }) => {
  const placementPrefix = context === 'app' ? 'app' : 'landing';
  const source = context === 'app' ? 'app-privacy-stack' : 'landing-privacy-stack';
  const yesimHref = getAffiliateLink('yesim', `${placementPrefix}_privacy_stack_yesim`);

  const handleAffiliateClick = (partner, placement, href) => {
    trackAffiliateClick({
      partner,
      placement,
      href,
      source,
    });
  };

  return (
    <section className="privacy-stack-recommendation mb-4" aria-labelledby="privacy-stack-recommendation-title">
      <div className="privacy-stack-recommendation__header">
        <div className="privacy-stack-recommendation__icon" aria-hidden="true">
          <AppIcon iconClass="bi bi-shield-check" />
        </div>
        <div>
          <span className="privacy-stack-recommendation__eyebrow">🔒 Complete Your Privacy Stack</span>
          <h4 id="privacy-stack-recommendation-title">More privacy layers for signups, travel, and online payments</h4>
          <p>
            {context === 'app'
              ? 'Your new inbox can help with signup messages, while an optional payment tool may help keep an everyday card separate for eligible trials, subscriptions, or ad billing. Review each provider and platform\'s current terms before signing up.'
              : 'Pair your temporary email with optional connectivity and payment tools. Availability, fees, verification, and platform acceptance vary, so review each provider\'s current terms before signing up.'}
          </p>
        </div>
      </div>

      <div className="privacy-stack-recommendation__actions">
        <a
          href={yesimHref}
          target="_blank"
          rel={AFFILIATE_REL}
          className="privacy-stack-recommendation__action privacy-stack-recommendation__action--connectivity"
          onClick={() => handleAffiliateClick('yesim', `${placementPrefix}_privacy_stack_yesim`, yesimHref)}
        >
          <span className="privacy-stack-recommendation__action-icon" aria-hidden="true">📱</span>
          <span className="privacy-stack-recommendation__action-copy">
            <strong>Get Virtual Numbers &amp; Travel eSIM (via Yesim)</strong>
            <small>Separate connectivity for travel and selected signups.</small>
          </span>
          <AppIcon iconClass="bi bi-arrow-up-right" aria-hidden="true" />
        </a>
        <a
          href={PARTNER_DESTINATIONS.pst}
          target="_blank"
          rel={AFFILIATE_REL}
          className="privacy-stack-recommendation__action privacy-stack-recommendation__action--premium"
          onClick={() => handleAffiliateClick('pst', `${placementPrefix}_privacy_stack_pst`, PARTNER_DESTINATIONS.pst)}
        >
          <span className="privacy-stack-recommendation__action-icon" aria-hidden="true">💳</span>
          <span className="privacy-stack-recommendation__action-copy">
            <strong>PST.NET Premium VCC</strong>
            <small>May suit selected trials, ads, and online payment workflows.</small>
            <span className="privacy-stack-recommendation__benefits">Check current fees · 3D-Secure availability · Regional support</span>
          </span>
          <AppIcon iconClass="bi bi-arrow-up-right" aria-hidden="true" />
        </a>
        <a
          href={PARTNER_DESTINATIONS.cashmaal}
          target="_blank"
          rel={AFFILIATE_REL}
          className="privacy-stack-recommendation__action privacy-stack-recommendation__action--local"
          onClick={() => handleAffiliateClick('cashmaal', `${placementPrefix}_privacy_stack_cashmaal`, PARTNER_DESTINATIONS.cashmaal)}
        >
          <span className="privacy-stack-recommendation__action-icon" aria-hidden="true">🌐</span>
          <span className="privacy-stack-recommendation__action-copy">
            <strong>CashMaal Visa Card</strong>
            <small>Explore flexible prepaid payment options and billing support.</small>
            <span className="privacy-stack-recommendation__benefits">Check activation steps · Verification policy · Regional availability</span>
          </span>
          <AppIcon iconClass="bi bi-arrow-up-right" aria-hidden="true" />
        </a>
      </div>
      <small className="privacy-stack-recommendation__notice">Partner links are optional external services. TempMail Pro does not control their pricing, approval, verification, or availability.</small>
    </section>
  );
};

export default YesimRecommendation;