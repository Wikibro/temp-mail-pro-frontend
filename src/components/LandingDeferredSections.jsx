import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import AppIcon from "./AppIcon";
import HomeSeoArticle from "./HomeSeoArticle";

const FAQSection = lazy(() => import("./FAQSection"));
const BlogList = lazy(() => import("./BlogList"));
const YesimRecommendation = lazy(() => import("./YesimRecommendation"));

const LandingDeferredSections = () => {
  return (
    <>
      {/* Compact App Preview */}
      <section className="app-preview-section py-5 defer-render-section">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold section-title d-inline-block">What You Get Inside /app</h2>
            <p className="text-muted mb-0">
              Transparent, real-looking inbox data with multiple accounts, expiry timers, and custom-name options.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="app-preview-shell app-preview-shell--compact">
                <div className="app-preview-topbar" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                  <p>Inboxes (3)</p>
                </div>

                <div className="app-preview-body">
                  <div className="app-preview-account-row is-active">
                    <span className="app-preview-avatar">P</span>
                    <div className="app-preview-account-meta">
                      <span>peter2026@delta.com</span>
                      <small>⏱ 133h 31m</small>
                    </div>
                    <b className="app-preview-count">1</b>
                  </div>

                  <div className="app-preview-account-row">
                    <span className="app-preview-avatar">A</span>
                    <div className="app-preview-account-meta">
                      <span>alpha2026@delta.com</span>
                      <small>⏱ 29h 58m</small>
                    </div>
                  </div>

                  <div className="app-preview-account-row mb-0">
                    <span className="app-preview-avatar">B</span>
                    <div className="app-preview-account-meta">
                      <span>beta2026@delta.com</span>
                      <small>⏱ 59m</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="app-preview-shell app-preview-shell--compact">
                <div className="app-preview-topbar" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                  <p>Active Email + Inbox</p>
                </div>

                <div className="app-preview-body">
                  <div className="app-preview-stat-line">
                    <small>Active Email</small>
                    <span>peter2026@delta.com</span>
                  </div>
                  <div className="app-preview-stat-line">
                    <small>Expires in</small>
                    <span>5d 13h 31m</span>
                  </div>

                  <div className="app-preview-mini-btn">Refresh Inbox</div>

                  <div className="app-preview-mail-row mb-0">
                    <span>Amazon</span>
                    <small>From: updates@amazon-mailer.com</small>
                    <b>4/18/2026, 8:00:37 PM</b>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="app-preview-shell app-preview-shell--compact">
                <div className="app-preview-topbar" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                  <p>Create Custom Email</p>
                </div>

                <div className="app-preview-body">
                  <label className="app-preview-label">username (optional)</label>
                  <div className="app-preview-input">david</div>
                  <div className="app-preview-result">david@delta.com</div>

                  <div className="app-preview-duration-row">
                    <span>10 min</span>
                    <span className="is-active">1 hour</span>
                    <span>24 hours</span>
                    <span>7 days</span>
                    <span>Custom</span>
                  </div>

                  <div className="app-preview-custom-dropdown" aria-hidden="true">
                    30 minutes / hours / day
                    <AppIcon iconClass="fas fa-chevron-down" />
                  </div>

                  <Link to="/app" className="btn cta-button app-preview-cta mt-3 w-100">
                    <AppIcon iconClass="fas fa-bolt me-2" />Open Full App
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 defer-render-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold section-title d-inline-block">Why Choose TempMail Pro?</h2>
            <p className="text-muted">The best temporary email service for protecting your privacy</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <AppIcon iconClass="fas fa-user-shield" />
                  </div>
                  <h3 className="card-title">Complete Anonymity</h3>
                  <p className="card-text">No personal information required. Use our service without revealing your identity or providing any personal details.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <AppIcon iconClass="fas fa-shield-alt" />
                  </div>
                  <h3 className="card-title">Spam Protection</h3>
                  <p className="card-text">Keep your primary inbox clean by using disposable addresses for sign-ups, downloads, and online registrations.</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <AppIcon iconClass="fas fa-bolt" />
                  </div>
                  <h3 className="card-title">Instant Setup</h3>
                  <p className="card-text">Get a temporary email address instantly with just one click. No registration or credit card required.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="landing-lazy-placeholder landing-lazy-placeholder--yesim" aria-hidden="true" />}>
        <YesimRecommendation />
      </Suspense>

      {/* How It Works */}
      <section id="how-it-works" className="py-5 bg-light defer-render-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold section-title d-inline-block">How It Works</h2>
            <p className="text-muted">Get started with TempMail Pro in three simple steps</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                <span className="fs-1 fw-bold">1</span>
              </div>
              <h3>Generate Address</h3>
              <p>Click the generate button to create a random email address instantly</p>
            </div>

            <div className="col-md-4 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                <span className="fs-1 fw-bold">2</span>
              </div>
              <h3>Use It Anywhere</h3>
              <p>Use this email for sign-ups, downloads, or any temporary need across the web</p>
            </div>

            <div className="col-md-4 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "80px", height: "80px" }}>
                <span className="fs-1 fw-bold">3</span>
              </div>
              <h3>Stay Protected</h3>
              <p>All spam stays in your temporary inbox, protecting your main email account</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Article Section */}
      <section id="seo-article" className="py-5 defer-render-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold section-title d-inline-block">The Complete Guide to Free Temporary Email</h2>
            <p className="text-muted">How disposable inboxes work, where they help, and how to use them responsibly</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <HomeSeoArticle />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-5 bg-light defer-render-section">
        <div className="container">
          <Suspense fallback={<div className="landing-lazy-placeholder landing-lazy-placeholder--faq" aria-hidden="true" />}>
            <FAQSection />
          </Suspense>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-5 defer-render-section">
        <div className="container">
          <Suspense fallback={<div className="landing-lazy-placeholder landing-lazy-placeholder--blog" aria-hidden="true" />}>
            <BlogList limit={4} showHeader={false} />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default LandingDeferredSections;
