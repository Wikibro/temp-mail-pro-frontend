import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ isDarkMode = false }) => {
  const yesimUrl = 'https://yesim.app/?partner_id=3317';

  return (
    <footer className={`${isDarkMode ? 'bg-dark text-white' : 'bg-light'} py-5 mt-5`}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 mb-4">
            <h5>TempMail Pro</h5>
            <p>
              Free temporary email service to protect your privacy online. No registration required.
            </p>
            <p className={`small mb-0 ${isDarkMode ? 'text-light' : 'text-muted'}`}>
              Partner notice: We may include optional partner links (such as Yesim) for travel eSIM and virtual-number tools.
              TempMail Pro and partner services are separate products.
            </p>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className={`text-decoration-none ${isDarkMode ? 'text-white' : 'text-dark'}`}>Home</Link></li>
              <li className="mb-2"><Link to="/about" className={`text-decoration-none ${isDarkMode ? 'text-white' : 'text-dark'}`}>About</Link></li>
              <li className="mb-2"><Link to="/app" className={`text-decoration-none ${isDarkMode ? 'text-white' : 'text-dark'}`}>Use App</Link></li>
              <li className="mb-2"><Link to="/blog" className={`text-decoration-none ${isDarkMode ? 'text-white' : 'text-dark'}`}>Blog</Link></li>
              <li className="mb-2"><Link to="/privacy" className={`text-decoration-none ${isDarkMode ? 'text-white' : 'text-dark'}`}>Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <h5>Information</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><i className="fas fa-globe me-2"></i> https://tempmailpk.com</li>
              <li className="mb-2">
                <a
                  href={yesimUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className={`text-decoration-none ${isDarkMode ? 'text-white' : 'text-dark'}`}
                >
                  <i className="fas fa-sim-card me-2"></i>Get Virtual Number
                </a>
                <div className={`small mt-1 ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                  via Yesim
                </div>
              </li>
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