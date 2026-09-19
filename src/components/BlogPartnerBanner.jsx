import React from 'react';
import AppIcon from './AppIcon';
import { AFFILIATE_REL, getAffiliateLink, PARTNER_DESTINATIONS } from '../utils/affiliateLinks';
import { trackAffiliateClick } from '../utils/affiliateTracking';

const PARTNERS = [
  {
    key: 'yesim',
    icon: '📱',
    title: 'Virtual Numbers & Travel eSIM',
    label: 'via Yesim',
    description: 'Add a separate number or travel data line.',
  },
  {
    key: 'pst',
    icon: '💳',
    title: 'Premium VCC for Ads & Trials',
    label: 'via PST.NET',
    description: 'Review current fees and platform compatibility.',
    href: PARTNER_DESTINATIONS.pst,
  },
  {
    key: 'cashmaal',
    icon: '🌐',
    title: 'Visa Card with Easy Setup',
    label: 'via CashMaal',
    description: 'Check verification and regional availability.',
    href: PARTNER_DESTINATIONS.cashmaal,
  },
];

export default function BlogPartnerBanner({ articleSlug }) {
  const getHref = (partner) => partner.href || getAffiliateLink('yesim', `blog_${articleSlug}_yesim_stack`);

  const handleClick = (partner, href) => {
    trackAffiliateClick({
      partner: partner.key,
      placement: `blog_${articleSlug}_${partner.key}_stack`,
      href,
      articleSlug,
      source: 'blog-partner-banner',
    });
  };

  return (
    <aside className="blog-partner-banner" aria-labelledby={`blog-partner-banner-title-${articleSlug}`}>
      <div className="blog-partner-banner__intro">
        <span className="blog-partner-banner__eyebrow">Verified privacy tool notice</span>
        <h2 id={`blog-partner-banner-title-${articleSlug}`}>Need an additional verification layer?</h2>
        <p>Websites may check both your email domain and card details when reviewing signups. To keep payment information separate, explore these optional tools:</p>
      </div>
      <div className="blog-partner-banner__grid">
        {PARTNERS.map((partner) => {
          const href = getHref(partner);
          return (
            <a
              key={partner.key}
              href={href}
              target="_blank"
              rel={AFFILIATE_REL}
              className="blog-partner-banner__item"
              onClick={() => handleClick(partner, href)}
            >
              <span className="blog-partner-banner__icon" aria-hidden="true">{partner.icon}</span>
              <span className="blog-partner-banner__copy">
                <strong>{partner.title}</strong>
                <small>{partner.label} · {partner.description}</small>
              </span>
              <AppIcon iconClass="bi bi-arrow-up-right" aria-hidden="true" />
            </a>
          );
        })}
      </div>
      <small className="blog-partner-banner__notice">Optional external services. Review current fees, verification requirements, regional availability, and each platform's terms before use.</small>
    </aside>
  );
}