import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">
          <span className="brand-icon">🥩</span>
          <span>MeatLink</span>
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <Link to="/login" className="nav-login-btn">
          Sign In
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
