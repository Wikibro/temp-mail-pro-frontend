import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const PageNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Home", icon: "fas fa-home" },
    { to: "/app", label: "Use App", icon: "fas fa-bolt" },
    { to: "/blog", label: "Blog", icon: "fas fa-newspaper" },
    { to: "/about", label: "About", icon: "fas fa-info-circle" },
    { to: "/privacy", label: "Privacy", icon: "fas fa-shield-alt" },
  ];

  return (
    <nav className="page-navbar sticky-top">
      <div className="container page-navbar__inner">
        {/* Brand */}
        <Link to="/" className="page-navbar__brand">
          <span className="page-navbar__logo-icon">
            <i className="fas fa-shield-alt"></i>
          </span>
          <span className="page-navbar__brand-text">
            TempMail<span className="page-navbar__brand-accent">Pro</span>
          </span>
        </Link>

        {/* Hamburger */}
        <button
          className={`page-navbar__toggler${menuOpen ? " is-open" : ""}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu */}
        <div className={`page-navbar__menu${menuOpen ? " is-open" : ""}`}>
          <ul className="page-navbar__nav">
            {links.map(({ to, label, icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`page-navbar__link${pathname === to ? " active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <i className={`${icon} me-1`}></i>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/app" className="page-navbar__cta" onClick={() => setMenuOpen(false)}>
            <i className="fas fa-envelope"></i> Get Free Email
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PageNavbar;
