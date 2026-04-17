









































import React from "react";
import { Link } from "react-router-dom";
import FAQSection from "./FAQSection";
import BlogList from "./BlogList";
import Footer from "./Footer";
import YesimRecommendation from "./YesimRecommendation";
import { Helmet } from "react-helmet-async";

const Landing = () => {
  // Smooth scroll function for anchor links
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="landing-page">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>TempMail Pro - Free Temporary Email Service</title>
        <meta 
          name="description" 
          content="TempMail Pro provides free disposable email addresses to protect your inbox from spam. Create, use, and delete emails instantly." 
        />
        <meta name="keywords" content="temporary email, disposable email, temp mail, spam protection, free email service, anonymous email" />
         <link rel="canonical" href="https://tempmailpk.com/" />
        {/* Open Graph */}
        <meta property="og:title" content="TempMail Pro - Free Disposable Email Service" />
        <meta property="og:description" content="Protect your inbox with free disposable emails from TempMail Pro. No registration required." />
        <meta property="og:image" content="https://tempmailpro.com/images/temp-mail-promo.png" />
        <meta property="og:url" content="https://tempmailpro.com" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TempMail Pro - Free Disposable Email Service" />
        <meta name="twitter:description" content="Protect your inbox with free disposable emails from TempMail Pro." />
        <meta name="twitter:image" content="https://tempmailpro.com/images/temp-mail-promo.png" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "TempMail Pro",
            "url": "https://tempmailpro.com",
            "description": "Free temporary email service for anonymous and secure communication.",
            "applicationCategory": "CommunicationApplication",
            "operatingSystem": "Web Browser",
            "permissions": "browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <i className="fas fa-envelope me-2"></i>
            <strong>TempMail<span className="brand-highlight">Pro</span></strong>
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link active" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('features')}
                >
                  Features
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('how-it-works')}
                >
                  How It Works
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('seo-article')}
                >
                  Email Security Guide
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('faq')}
                >
                  FAQ
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => scrollToSection('blog')}
                >
                  Blog
                </button>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/app">Use App</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Secure Your Privacy with <span className="brand-highlight">Temporary Email</span></h1>
              <p className="lead mb-5">TempMail Pro provides free disposable email addresses to protect your personal inbox from spam, phishing, and unwanted marketing emails. No registration required!</p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/app" className="btn cta-button">
                  <i className="fas fa-bolt me-2"></i>Generate Temp Email
                </Link>
                <button 
                  className="btn btn-outline-light"
                  onClick={() => scrollToSection('features')}
                >
                  <i className="fas fa-question-circle me-2"></i>Learn More
                </button>
              </div>
            </div>
            {/* <div className="col-lg-6 mt-5 mt-lg-0 text-center">
              <img 
                src="/images/temp-mail-promo.png" 
                alt="TempMail Pro - Free Temporary Email Service" 
                className="promo-image img-fluid" 
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1515942405154-483d35a4fe5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
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
                  <h4 className="card-title">Complete Anonymity</h4>
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
                  <h4 className="card-title">Spam Protection</h4>
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
                  <h4 className="card-title">Instant Setup</h4>
                  <p className="card-text">Get a temporary email address instantly with just one click. No registration or credit card required.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <YesimRecommendation />

      {/* How It Works */}
      <section id="how-it-works" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold section-title d-inline-block">How It Works</h2>
            <p className="text-muted">Get started with TempMail Pro in three simple steps</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: "80px", height: "80px"}}>
                <span className="fs-1 fw-bold">1</span>
              </div>
              <h4>Generate Address</h4>
              <p>Click the generate button to create a random email address instantly</p>
            </div>
            
            <div className="col-md-4 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: "80px", height: "80px"}}>
                <span className="fs-1 fw-bold">2</span>
              </div>
              <h4>Use It Anywhere</h4>
              <p>Use this email for sign-ups, downloads, or any temporary need across the web</p>
            </div>
            
            <div className="col-md-4 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: "80px", height: "80px"}}>
                <span className="fs-1 fw-bold">3</span>
              </div>
              <h4>Stay Protected</h4>
              <p>All spam stays in your temporary inbox, protecting your main email account</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Article Section */}
      <section id="seo-article" className="py-5">
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
      <section id="faq" className="py-5 bg-light">
        <div className="container">
          <FAQSection />
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-5">
        <div className="container">
          <BlogList limit={4} showHeader={false} />
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Add CSS styles to fix the mismatch */}
      <style>
        {`
          .article-content {
            font-family: 'Poppins', sans-serif;
            line-height: 1.7;
            color: #495057;
          }
          
          .article-content h3 {
            font-weight: 600;
            color: #4361ee;
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-size: 1.5rem;
          }
          
          .article-content p {
            margin-bottom: 1.5rem;
            font-size: 1.05rem;
          }
          
          .article-content ul {
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
          }
          
          .article-content li {
            margin-bottom: 0.5rem;
            font-size: 1.05rem;
          }
          
          .article-content strong {
            color: #4361ee;
            font-weight: 600;
          }
          
          /* Ensure consistency with existing styles */
          .section-title {
            position: relative;
            padding-bottom: 15px;
          }
          
          .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: #4361ee;
            border-radius: 2px;
          }
          
          .brand-highlight {
            color: #f72585;
          }
          
          .hero-section {
            background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
            color: white;
            padding: 100px 0;
          }
          
          .cta-button {
            background-color: #f72585;
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          
          .cta-button:hover {
            background-color: #e51276;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          
          .feature-icon {
            width: 70px;
            height: 70px;
            background: rgba(67, 97, 238, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 28px;
            color: #4361ee;
          }
          
          .feature-card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            transition: transform 0.3s ease;
          }
          
          .feature-card:hover {
            transform: translateY(-5px);
          }
          
          .promo-image {
            max-width: 100%;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          }
        `}
      </style>
    </div>
  );
};

export default Landing;
