import React from "react";
import { Link } from "react-router-dom";

export function IntroCard({ iconClass, title, subtitle, lead }) {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">
        <div className="text-center mb-4">
          <i className={`${iconClass} text-success`} style={{ fontSize: "3rem" }}></i>
          <h3 className="mt-3">{title}</h3>
          <p className="text-muted">{subtitle}</p>
        </div>
        <p className="lead text-center mb-4">{lead}</p>
      </div>
    </div>
  );
}

export function FeatureGrid({ items }) {
  return (
    <div className="row g-4 mb-4">
      {items.map((item) => (
        <div className="col-md-6" key={item.title}>
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <i className={`${item.iconClass} ${item.iconColor} mb-3`} style={{ fontSize: "2rem" }}></i>
              <h5>{item.title}</h5>
              <p className="text-muted">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SectionCard({ title, children }) {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-light">
        <h4 className="mb-0">{title}</h4>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

export function StepsGrid({ steps }) {
  return (
    <div className="row">
      {steps.map((step, index) => (
        <div className="col-md-4 text-center mb-4" key={step.title}>
          <div
            className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
            style={{ width: "60px", height: "60px" }}
          >
            <span className="fw-bold fs-4">{index + 1}</span>
          </div>
          <h6>{step.title}</h6>
          <p className="text-muted small">{step.description}</p>
        </div>
      ))}
    </div>
  );
}

export function FinalCtaCard({
  iconClass,
  title,
  description,
  primaryTo,
  primaryLabel,
  secondaryTo,
  secondaryLabel,
}) {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body text-center py-5">
        {iconClass && <i className={`${iconClass} text-primary mb-3`} style={{ fontSize: "2.5rem" }}></i>}
        <h4 className="mb-3">{title}</h4>
        <p className="text-muted mb-4">{description}</p>
        <Link to={primaryTo} className="btn btn-primary btn-lg me-3">
          <i className="bi bi-envelope me-2"></i>
          {primaryLabel}
        </Link>
        <Link to={secondaryTo} className="btn btn-outline-secondary btn-lg">
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}

export function UpdatedAt({ date, topClass = "mt-4" }) {
  return (
    <div className={`text-center text-muted ${topClass} mb-4`}>
      <small>Last updated: {date}</small>
    </div>
  );
}
