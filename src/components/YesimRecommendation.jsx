import React from 'react';
import AppIcon from './AppIcon';

const YesimRecommendation = () => {
  return (
    <div className="yesim-card mb-4">
      <div className="yesim-card-content">
        <div className="yesim-card-icon">
          <AppIcon iconClass="bi bi-shield-check" />
        </div>
        <div className="yesim-card-body">
          <h4 className="yesim-card-title">
            Optional Travel Add-On
          </h4>
          <p className="yesim-card-text">
            Need travel data or a second number too? Yesim publicly offers eSIM plans, Pay&Fly, and virtual numbers as a separate service.
          </p>
          <a
            href="https://yesim.app/?partner_id=3317"
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn btn-yesim-card"
          >
            <AppIcon iconClass="bi bi-arrow-right-circle me-2" />
            View Yesim Options
          </a>
        </div>
      </div>
    </div>
  );
};

export default YesimRecommendation;