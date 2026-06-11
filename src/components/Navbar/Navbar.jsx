import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Generate", path: "/generate" },
    { label: "Gallery", path: "/gallery" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar__logo">
        <div className="navbar__logo-icon">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L14 12H2L8 2Z" fill="white" opacity="0.9" />
          </svg>
        </div>
        <span className="navbar__logo-text">Visionary AI</span>
      </div>

      {/* Desktop Links */}
      <ul className="navbar__links">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`navbar__link ${
                location.pathname === link.path ? "navbar__link--active" : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="navbar__actions">
        <button className="navbar__btn navbar__btn--outline">Sign in</button>
        <button className="navbar__btn navbar__btn--primary">
          Get started free
        </button>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="navbar__hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="navbar__mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button className="navbar__btn navbar__btn--primary navbar__btn--full">
            Get started free
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;