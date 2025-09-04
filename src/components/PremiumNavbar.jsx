import React from 'react';

const PremiumNavbar = () => {
  return (
    <nav className="premium-navbar">
      <div className="nav-container">
        <div className="logo-brand">
          <div className="logo-icon">
            <i className="fas fa-envelope"></i>
          </div>
          <div className="logo-text">Temp<span>Mail</span> Pro</div>
        </div>
        
        <div className="nav-menu">
          <div className="nav-links">
            <a href="#"><i className="fas fa-home"></i> Home</a>
            <a href="#"><i className="fas fa-inbox"></i> Inbox</a>
            <a href="#"><i className="fas fa-history"></i> History</a>
            <a href="#"><i className="fas fa-cog"></i> Settings</a>
          </div>
          
          <div className="nav-actions">
            <button className="upgrade-btn">
              <i className="fas fa-crown"></i>
              <span>Upgrade to Premium</span>
            </button>
            
            <div className="user-profile">
              <div className="avatar">JD</div>
              <div className="username">John Doe</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PremiumNavbar;
