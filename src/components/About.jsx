import React from "react";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <div className="about-container">
      <Helmet>
        <title>About TempMail Pro - Free Temporary Email Service</title>
        <meta
          name="description"
          content="Learn about TempMail Pro, the privacy-first temporary email service. Browser-generated emails, no databases, complete anonymity for online privacy protection."
        />
        <meta name="keywords" content="temporary email, disposable email, privacy, anonymous email, spam protection, TempMail Pro" />
        <link rel="canonical" href="https://tempmailpk.com/about" />

        {/* Open Graph */}
        <meta property="og:title" content="About TempMail Pro - Free Temporary Email Service" />
        <meta property="og:description" content="Learn about TempMail Pro, the privacy-first temporary email service. Browser-generated emails, no databases, complete anonymity." />
        <meta property="og:url" content="https://tempmailpk.com/about" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="text-center mb-5">About TempMail Pro</h1>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <i className="bi bi-shield-check text-success" style={{fontSize: '3rem'}}></i>
                  <h3 className="mt-3">Privacy-First Temporary Email Service</h3>
                  <p className="text-muted">Protecting your online privacy since 2025</p>
                </div>

                <p className="lead text-center mb-4">
                  TempMail Pro is a free, privacy-focused temporary email service designed to protect your personal inbox
                  from spam, unwanted marketing, and potential security threats.
                </p>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <i className="bi bi-browser-chrome text-primary mb-3" style={{fontSize: '2rem'}}></i>
                    <h5>Browser-Generated</h5>
                    <p className="text-muted">
                      All temporary email addresses are generated directly in your browser using secure,
                      random algorithms. No server-side generation or storage.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <i className="bi bi-database-x text-danger mb-3" style={{fontSize: '2rem'}}></i>
                    <h5>No Database Storage</h5>
                    <p className="text-muted">
                      We don't maintain any databases or permanent storage systems.
                      Temporary email addresses are generated in your browser and only exist briefly on our mail server.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <i className="bi bi-eye-slash text-warning mb-3" style={{fontSize: '2rem'}}></i>
                    <h5>Complete Anonymity</h5>
                    <p className="text-muted">
                      We have no knowledge of what emails you receive or send.
                      Our service operates on a zero-knowledge principle.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <i className="bi bi-clock text-info mb-3" style={{fontSize: '2rem'}}></i>
                    <h5>Automatic Cleanup</h5>
                    <p className="text-muted">
                      All emails are automatically deleted after expiration.
                      No manual intervention or data retention policies required.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-light">
                <h4 className="mb-0">Our Mission</h4>
              </div>
              <div className="card-body">
                <p>
                  In today's digital world, maintaining privacy online has become increasingly challenging.
                  Websites and services collect email addresses for various purposes, often leading to
                  unwanted spam, marketing emails, and potential security risks.
                </p>
                <p>
                  TempMail Pro was created to give users back control over their digital communication.
                  We believe that privacy should be the default, not an optional feature. Our service
                  provides a simple, effective way to protect your primary email address while still
                  allowing you to access online services that require email verification.
                </p>
                <p>
                  By generating temporary email addresses directly in your browser and maintaining
                  zero permanent storage, we ensure that your online activities remain private and secure.
                </p>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-light">
                <h4 className="mb-0">How It Works</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 text-center mb-4">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                      <span className="fw-bold fs-4">1</span>
                    </div>
                    <h6>Generate</h6>
                    <p className="text-muted small">
                      Click to create a temporary email address instantly in your browser
                    </p>
                  </div>
                  <div className="col-md-4 text-center mb-4">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                      <span className="fw-bold fs-4">2</span>
                    </div>
                    <h6>Use Anywhere</h6>
                    <p className="text-muted small">
                      Use the temporary email for sign-ups, downloads, or any online service
                    </p>
                  </div>
                  <div className="col-md-4 text-center mb-4">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                      <span className="fw-bold fs-4">3</span>
                    </div>
                    <h6>Auto-Delete</h6>
                    <p className="text-muted small">
                      Email expires automatically, protecting your privacy permanently
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h4 className="mb-3">New: Yesim Virtual Number Service</h4>
                <p>
                  TempMail Pro now supports Yesim virtual numbers for secure SMS verification.
                  This privacy-first option helps you receive OTPs without exposing your personal phone number.
                </p>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-light">
                <h4 className="mb-0">Common Use Cases</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <strong>Online Shopping:</strong> Avoid spam from e-commerce sites
                      </li>
                      <li className="mb-3">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <strong>Social Media:</strong> Test new platforms without exposing your real email
                      </li>
                      <li className="mb-3">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <strong>Software Downloads:</strong> Protect against unwanted newsletters
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <strong>Forum Registration:</strong> Keep discussions separate from personal email
                      </li>
                      <li className="mb-3">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <strong>Newsletter Testing:</strong> Try services without commitment
                      </li>
                      <li className="mb-3">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        <strong>Account Verification:</strong> Secure temporary access to services
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h5>Ready to Protect Your Privacy?</h5>
                <p className="text-muted mb-4">
                  Join thousands of users who trust TempMail Pro for their temporary email needs.
                </p>
                <a href="/app" className="btn btn-primary btn-lg">
                  <i className="bi bi-envelope me-2"></i>
                  Create Temporary Email
                </a>
              </div>
            </div>

            <div className="text-center text-muted mt-4">
              <small>Last updated: April 2026</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
