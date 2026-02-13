import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Top navigation bar with app branding and auth controls. */
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="nav">
      <div className="nav__left">
        <Link to="/" className="nav__brand">
          Recipe Explorer
        </Link>
        <nav className="nav__links" aria-label="Primary navigation">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav__link nav__link--active" : "nav__link")}>
            Home
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) => (isActive ? "nav__link nav__link--active" : "nav__link")}
          >
            Search
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? "nav__link nav__link--active" : "nav__link")}
          >
            Favorites
          </NavLink>
        </nav>
      </div>

      <div className="nav__right">
        {isAuthenticated ? (
          <button
            className="btn btn--secondary"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        ) : (
          <Link className="btn" to="/login">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
