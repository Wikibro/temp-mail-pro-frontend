import React from "react";
import { Helmet } from "react-helmet-async";

const Privacy = () => {
  return (
    <div className="privacy-container">
        {/* ADD THIS SEO SECTION */}
      <Helmet>
        <title>Privacy Policy | TempMail Pro</title>
        <meta
          name="description"
          content="TempMail Pro privacy policy. We do not store your temporary emails permanently and your privacy is our priority."
        />
        <link rel="canonical" href="https://tempmailpk.com/privacy" />

        {/* Open Graph */}
        <meta property="og:title" content="Privacy Policy | TempMail Pro" />
        <meta property="og:description" content="TempMail Pro privacy policy. We protect your privacy with temporary email services." />
        <meta property="og:url" content="https://tempmailpk.com/privacy" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="text-center mb-5">Privacy Policy</h1>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <i className="bi bi-shield-check text-success" style={{fontSize: '3rem'}}></i>
                  <h3 className="mt-3">Privacy-First by Design</h3>
                  <p className="text-muted">Your privacy is our foundation, not an afterthought.</p>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-browser-chrome text-primary me-3 mt-1"></i>
                      <div>
                        <h5>Browser-Generated Emails</h5>
                        <p className="text-muted mb-0">
                          All temporary email addresses are generated entirely in your browser.
                          We never see or store your email content.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-database-x text-danger me-3 mt-1"></i>
                      <div>
                        <h5>No Database Storage</h5>
                        <p className="text-muted mb-0">
                          We don't maintain any databases. Your emails exist only in your browser
                        and our temporary mail server, keeping your experience private and ephemeral.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-eye-slash text-warning me-3 mt-1"></i>
                      <div>
                        <h5>We Don't Know Your Data</h5>
                        <p className="text-muted mb-0">
                          We have no knowledge of what emails you receive or send.
                          Our service is completely anonymous.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-clock text-info me-3 mt-1"></i>
                      <div>
                        <h5>Automatic Deletion</h5>
                        <p className="text-muted mb-0">
                          All emails are automatically deleted after expiration.
                          No manual cleanup or data retention.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-light">
                <h4 className="mb-0">How It Works</h4>
              </div>
              <div className="card-body">
                <ol className="list-unstyled">
                  <li className="mb-3 d-flex">
                    <span className="badge bg-primary me-3 align-self-start">1</span>
                    <div>
                      <strong>Browser Generation:</strong> Your temporary email address is created
                      locally in your browser using secure random generation.
                    </div>
                  </li>
                  <li className="mb-3 d-flex">
                    <span className="badge bg-primary me-3 align-self-start">2</span>
                    <div>
                      <strong>Server Communication:</strong> Only the email address and a secure token
                      are sent to our mail server for receiving emails.
                    </div>
                  </li>
                  <li className="mb-3 d-flex">
                    <span className="badge bg-primary me-3 align-self-start">3</span>
                    <div>
                      <strong>Zero Storage:</strong> We don't store your emails, personal data, or browsing history.
                      Everything is temporary and ephemeral.
                    </div>
                  </li>
                  <li className="mb-3 d-flex">
                    <span className="badge bg-primary me-3 align-self-start">4</span>
                    <div>
                      <strong>Auto Cleanup:</strong> Emails expire automatically based on your chosen duration,
                      with no data retention policies.
                    </div>
                  </li>
                </ol>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-light">
                <h4 className="mb-0">Data We Don't Collect</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2"><i className="bi bi-x-circle text-danger me-2"></i> Email addresses</li>
                      <li className="mb-2"><i className="bi bi-x-circle text-danger me-2"></i> Email content</li>
                      <li className="mb-2"><i className="bi bi-x-circle text-danger me-2"></i> IP addresses</li>
                      <li className="mb-2"><i className="bi bi-x-circle text-danger me-2"></i> Personal information</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2"><i className="bi bi-x-circle text-danger me-2"></i> Browser fingerprints</li>
                      <li className="mb-2"><i className="bi bi-x-circle text-danger me-2"></i> Usage analytics</li>
                      <li className="mb-2"><i className="bi bi-x-circle text-danger me-2"></i> Cookies or tracking</li>
                      <li className="mb-2"><i className="bi bi-x-circle text-danger me-2"></i> Third-party sharing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-light">
                <h4 className="mb-0">Your Rights</h4>
              </div>
              <div className="card-body">
                <p>Since we don't store any of your data, there are no data deletion requests to process.
                Your privacy is automatically protected by our design:</p>
                <ul>
                  <li><strong>No Data Collection:</strong> We never had your data to begin with</li>
                  <li><strong>Immediate Deletion:</strong> Emails expire and are gone forever</li>
                  <li><strong>No Tracking:</strong> We don't monitor or analyze your usage</li>
                  <li><strong>Anonymous Service:</strong> Use our service without any identification</li>
                </ul>
                <p>
                  We also partner with Yesim to offer a privacy-respecting virtual SMS number option for OTP verification,
                  so you can verify accounts without exposing your personal phone number.
                </p>
                                <p>
                                     <p>
                    Third-Party Partners & Cookies
To support our free service, we may participate in affiliate marketing programs. When you click on a referral link on our site, a "cookie" may be placed in your browser by the partner service to track the referral for commission purposes. These third-party services have their own privacy policies, which we encourage you to review.

                 </p>
                </p>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h5>Questions About Privacy?</h5>
                <p className="text-muted mb-3">
                  Our privacy practices are designed to be transparent and protective by default.
                  Since we don't collect any data, there are no privacy concerns to address.
                </p>
                <p className="text-muted">
                  <strong>Privacy Guarantee:</strong> We never see, store, or share your information.
                </p>
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

export default Privacy;
