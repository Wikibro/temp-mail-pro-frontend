import React, { lazy, Suspense } from "react";
import { Link } from "react-router-dom";

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
                    <i className="fas fa-chevron-down"></i>
                  </div>

                  <Link to="/app" className="btn cta-button app-preview-cta mt-3 w-100">
                    <i className="fas fa-bolt me-2"></i>Open Full App
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
                    <i className="fas fa-user-shield"></i>
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
                    <i className="fas fa-shield-alt"></i>
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
                    <i className="fas fa-bolt"></i>
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
            <h2 className="fw-bold section-title d-inline-block">Complete Guide to Temporary Email Privacy</h2>
            <p className="text-muted">Practical guidance for spam protection, safer sign-ups, and optional travel connectivity tools</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <article className="article-content">
                <h3>Why Temporary Email Helps</h3>
                <p>Temporary email gives you a buffer between your real inbox and the websites, apps, and downloads you do not fully trust yet. Instead of spreading your personal address across dozens of services, you can use a disposable inbox for short-term verification and keep your primary email cleaner.</p>

                <h3>When to Use It</h3>
                <p>Temp mail is useful for one-off sign-ups, trials, gated downloads, newsletters, marketplaces, and any workflow where you expect follow-up spam or do not want a long-term relationship with the service. If the account is important or security-sensitive, use an address you control permanently.</p>

                <h3>What It Protects You From</h3>
                <ul>
                  <li><strong>Spam buildup:</strong> Marketing blasts stay out of your personal inbox.</li>
                  <li><strong>Data reuse:</strong> Your real email is less likely to be resold or reused across campaigns.</li>
                  <li><strong>Phishing exposure:</strong> Suspicious follow-up mail lands in a disposable inbox instead of your main one.</li>
                  <li><strong>Account clustering:</strong> You can separate low-trust sign-ups from serious accounts.</li>
                </ul>

                <h3>Limits to Keep in Mind</h3>
                <p>Disposable addresses are not ideal for banking, healthcare, government services, or anything you may need to recover months later. Some websites also block temporary domains, so you should expect occasional sign-up failures on stricter platforms.</p>

                <h3>What Yesim Publicly Offers</h3>
                <p>Based on Yesim's public pages, the company markets eSIM mobile data plans for travel and business, a Pay&amp;Fly option, and a separate virtual-number product. Their site also advertises 24/7 support and states that one eSIM can work across 200+ destinations.</p>

                <h3>Published Pricing and Coverage Examples</h3>
                <p>Yesim publishes destination pricing on its site, with examples such as Thailand from $1.52 per day, the United States from $1.72 per day, and Japan from $2.20 per day at the time of writing. Availability, pricing, and speeds can change by country and plan, so users should always confirm the current destination page before purchasing.</p>

                <h3>How TempMail Pro and Yesim Can Complement Each Other</h3>
                <p>TempMail Pro helps you separate temporary sign-ups from your main inbox. A separate travel eSIM or virtual number can be useful when a service also asks for mobile connectivity or a secondary number. The goal is simple: keep your primary email and main phone number out of low-trust or one-off registrations whenever possible.</p>

                <div className="text-center mt-5">
                  <Link to="/app" className="btn btn-primary btn-lg px-5">
                    <i className="fas fa-envelope me-2"></i>Start Using TempMail Pro Today
                  </Link>
                </div>
              </article>
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
