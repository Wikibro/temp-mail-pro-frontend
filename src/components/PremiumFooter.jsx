import React from 'react';
import axios from 'axios';
const PremiumFooter = () => {
  return (
    <footer className="premium-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-text">Temp<span>Mail</span> Pro</div>
          </div>
          <p className="footer-description">
            Premium temporary email service for secure and anonymous communication. 
            Protect your privacy with our disposable email solution.
          </p>
          <div className="social-links">
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
            <a href="#"><i className="fab fa-github"></i></a>
          </div>
        </div>
        
        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#"><i className="fas fa-chevron-right"></i> Home</a></li>
            <li><a href="#"><i className="fas fa-chevron-right"></i> Features</a></li>
            <li><a href="#"><i className="fas fa-chevron-right"></i> How It Works</a></li>
            <li><a href="#"><i className="fas fa-chevron-right"></i> Pricing</a></li>
            <li><a href="#"><i className="fas fa-chevron-right"></i> Testimonials</a></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Features</h3>
          <ul className="footer-links">
            <li><a href="#"><i className="fas fa-chevron-right"></i> Disposable Email</a></li>
            <li><a href="#"><i className="fas fa-chevron-right"></i> Email Forwarding</a></li>
            <li><a href="#"><i className="fas fa-chevron-right"></i> Spam Protection</a></li>
            <li><a href="#"><i className="fas fa-chevron-right"></i> Attachment Support</a></li>
            <li><a href="#"><i className="fas fa-chevron-right"></i> Custom Domains</a></li>
          </ul>
        </div>
        
        <div className="footer-column footer-newsletter">
          <h3>Newsletter</h3>
          <p>Subscribe to our newsletter to receive updates and security tips.</p>
          <form className="newsletter-form">
            <input type="email" className="newsletter-input" placeholder="Your email address" />
            <button type="submit" className="subscribe-btn"><i className="fas fa-paper-plane"></i></button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="copyright">
          &copy; {new Date().getFullYear()} TempMail Pro. All rights reserved.
        </div>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
          <a href="#">GDPR</a>
        </div>
      </div>
    </footer>
  );
};

export default PremiumFooter;