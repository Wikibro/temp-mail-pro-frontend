import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ isDarkMode = false }) => {
  return (
    <footer className={`${isDarkMode ? 'bg-dark text-white' : 'bg-light'} py-5 mt-5`}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 mb-4">
            <h5>TempMail Pro</h5>
            <p>Free temporary email service to protect your privacy online. No registration required.</p>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className={`text-decoration-none ${isDarkMode ? 'text-white' : 'text-dark'}`}>Home</Link></li>
              <li className="mb-2"><Link to="/about" className={`text-decoration-none ${isDarkMode ? 'text-white' : 'text-dark'}`}>About</Link></li>
              <li className="mb-2"><Link to="/app" className={`text-decoration-none ${isDarkMode ? 'text-white' : 'text-dark'}`}>Use App</Link></li>
              <li className="mb-2"><Link to="/privacy" className={`text-decoration-none ${isDarkMode ? 'text-white' : 'text-dark'}`}>Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <h5>Information</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><i className="fas fa-globe me-2"></i> https://tempmailpk.com</li>
            </ul>
          </div>
        </div>
        <hr className={`${isDarkMode ? 'bg-light' : 'bg-dark'} my-4`} />
        <div className="text-center py-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} TempMail Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;