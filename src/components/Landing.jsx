import React, { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { Helmet } from "react-helmet-async";
import AppIcon from "./AppIcon";

const LandingDeferredSections = lazy(() => import("./LandingDeferredSections.jsx"));

const deferredSectionIds = new Set(["features", "how-it-works", "seo-article", "faq", "blog"]);

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let rafA;
    let rafB;
    let timeoutId;
    let idleId;

    const mountDeferred = () => setShowDeferredSections(true);

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(
        () => {
          rafA = window.requestAnimationFrame(() => {
            rafB = window.requestAnimationFrame(mountDeferred);
          });
        },
        { timeout: 1200 }
      );
    } else {
      rafA = window.requestAnimationFrame(() => {
        rafB = window.requestAnimationFrame(() => {
          timeoutId = window.setTimeout(mountDeferred, 120);
        });
      });
    }

    return () => {
      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (rafA) {
        window.cancelAnimationFrame(rafA);
      }
      if (rafB) {
        window.cancelAnimationFrame(rafB);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const scrollToSection = (id) => {
    const performScroll = () => {
      const element = document.getElementById(id);
      if (!element) {
        return false;
      }

      element.scrollIntoView({ behavior: "smooth" });
      return true;
    };

    if (!performScroll() && deferredSectionIds.has(id) && !showDeferredSections) {
      setShowDeferredSections(true);
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          performScroll();
        }, 60);
      });
    }

    setMenuOpen(false);
  };

  return (
    <div className="landing-page">
      <Helmet>
        <title>TempMail Pro - Free Multi Inbox Temp Email, Custom Time & Name</title>
        <meta
          name="description"
          content="Create free temporary email addresses with multi inbox support, custom expiry time, custom name options, and no sign-in required. Protect your inbox from spam, phishing, and unwanted marketing."
        />
        <meta
          name="keywords"
          content="temporary email, disposable email, temp mail, spam protection, free email service, anonymous email"
        />
        <link rel="canonical" href="https://tempmailpk.com/" />
        <meta property="og:title" content="TempMail Pro - Free Multi Inbox Temp Email, No Sign-In" />
        <meta
          property="og:description"
          content="Get free multi inbox temporary emails with custom time and custom name options. No sign-in needed."
        />
        <meta property="og:image" content="https://tempmailpk.com/images/temp-mail-promo.png" />
        <meta property="og:url" content="https://tempmailpk.com/" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TempMail Pro - Free Multi Inbox Temp Email, No Sign-In" />
        <meta
          name="twitter:description"
          content="Create temporary emails with multi inbox, custom time, and custom names for free. No sign-in required."
        />
        <meta name="twitter:image" content="https://tempmailpk.com/images/temp-mail-promo.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "TempMail Pro",
            url: "https://tempmailpk.com/",
            description: "Free temporary email service with multi inbox, custom expiry time, custom names, and no sign-in.",
            applicationCategory: "CommunicationApplication",
            operatingSystem: "Web Browser",
            permissions: "browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          })}
        </script>
      </Helmet>

      <nav className={`landing-navbar${scrolled ? " landing-navbar--scrolled" : ""}`}>
        <div className="landing-navbar__inner">
          <Link className="landing-navbar__brand" to="/">
            <span className="landing-navbar__logo-icon">
              <AppIcon iconClass="fas fa-shield-alt" />
            </span>
            <span className="landing-navbar__brand-text">
              TempMail<span className="landing-navbar__brand-accent">Pro</span>
            </span>
          </Link>

          <button
            className={`landing-navbar__toggler${menuOpen ? " is-open" : ""}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`landing-navbar__menu${menuOpen ? " is-open" : ""}`}>
            <ul className="landing-navbar__nav">
              <li>
                <Link className="landing-navbar__link" to="/" onClick={() => setMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <button className="landing-navbar__link landing-navbar__link--btn" onClick={() => scrollToSection("features")}>
                  Features
                </button>
              </li>
              <li>
                <button className="landing-navbar__link landing-navbar__link--btn" onClick={() => scrollToSection("how-it-works")}>
                  How It Works
                </button>
              </li>
              <li>
                <button className="landing-navbar__link landing-navbar__link--btn" onClick={() => scrollToSection("faq")}>
                  FAQ
                </button>
              </li>
              <li>
                <button className="landing-navbar__link landing-navbar__link--btn" onClick={() => scrollToSection("blog")}>
                  Blog
                </button>
              </li>
            </ul>
            <Link to="/app" className="landing-navbar__cta" onClick={() => setMenuOpen(false)}>
              <AppIcon iconClass="fas fa-bolt me-1" /> Use App
            </Link>
          </div>
        </div>
      </nav>

      <main id="main-content">
        <section className="hero-section">
          <div className="container landing-hero-container">
            <div className="landing-hero-grid">
              <div className="landing-hero-content">
                <h1 className="hero-title landing-hero-title">
                  Get <span className="brand-highlight">Multi Inbox + Multi Email</span> Free
                </h1>
                <p className="landing-hero-lead">
                  Create multiple inboxes, generate multiple temporary emails, and even use custom names at no cost. While
                  many services charge for these features, TempMail Pro gives them free for everyone.
                </p>
                <div className="landing-hero-actions">
                  <Link to="/app" className="cta-button landing-hero-primary-btn">
                    <AppIcon iconClass="fas fa-bolt me-2" />Generate Temp Email
                  </Link>
                  <button className="landing-hero-secondary-btn" onClick={() => scrollToSection("features")}>
                    <AppIcon iconClass="fas fa-question-circle me-2" />Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<div className="landing-lazy-placeholder landing-lazy-placeholder--deferred" aria-hidden="true" />}>
          {showDeferredSections ? (
            <LandingDeferredSections />
          ) : (
            <div className="landing-lazy-placeholder landing-lazy-placeholder--deferred" aria-hidden="true" />
          )}
        </Suspense>
      </main>

      {showDeferredSections ? <Footer /> : null}
    </div>
  );
};

export default Landing;
