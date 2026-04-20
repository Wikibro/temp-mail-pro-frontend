import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const { pathname } = useLocation();
  const yesimUrl = 'https://yesim.app/?partner_id=3317';
  const year = new Date().getFullYear();

  const handleAppCtaClick = (e) => {
    if (pathname === '/app') {
      e.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">

          {/* Brand column */}
          <div className="site-footer__brand-col">
            <Link to="/" className="site-footer__brand">
              <span className="site-footer__brand-icon">
                <i className="fas fa-shield-alt"></i>
              </span>
              <span className="site-footer__brand-name">
                TempMail<span>Pro</span>
              </span>
            </Link>
            <p className="site-footer__tagline">
              Free disposable email service — protect your real inbox from spam, tracking, and data leaks.
              No registration. No storage. No nonsense.
            </p>
            <Link to="/app" className="site-footer__cta" onClick={handleAppCtaClick}>
              <i className="fas fa-bolt me-2"></i>Get Free Temp Email
            </Link>
            <p className="site-footer__disclaimer">
              <i className="fas fa-info-circle me-1 opacity-50"></i>
              Partner notice: We may include optional partner links (e.g. Yesim) for virtual-number tools.
              TempMail Pro and partner services are separate products.
            </p>
          </div>

          {/* Quick Links */}
          <div className="site-footer__col">
            <h3 className="site-footer__heading">Quick Links</h3>
            <ul className="site-footer__links">
              <li><Link to="/"><i className="fas fa-home me-2"></i>Home</Link></li>
              <li><Link to="/app"><i className="fas fa-envelope me-2"></i>Use App</Link></li>
              <li><Link to="/blog"><i className="fas fa-newspaper me-2"></i>Blog</Link></li>
              <li><Link to="/about"><i className="fas fa-info-circle me-2"></i>About</Link></li>
              <li><Link to="/privacy"><i className="fas fa-shield-alt me-2"></i>Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="site-footer__col">
            <h3 className="site-footer__heading">Resources</h3>
            <ul className="site-footer__links">
              <li>
                <a href={yesimUrl} target="_blank" rel="noopener noreferrer sponsored">
                  <i className="fas fa-sim-card me-2"></i>Get Virtual Number
                  <span className="site-footer__badge">via Yesim</span>
                </a>
              </li>
              <li><Link to="/blog/how-to-use-temp-email-for-free-trials"><i className="fas fa-book me-2"></i>How to Use Temp Email</Link></li>
              <li><Link to="/blog/is-free-temp-mail-legal"><i className="fas fa-balance-scale me-2"></i>Is Temp Mail Legal?</Link></li>
              <li><Link to="/blog/temp-email-vs-email-alias"><i className="fas fa-code-branch me-2"></i>Temp Mail vs Alias</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            &copy; {year} TempMail Pro &mdash; All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;