import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-emerald-700 text-white px-4 py-3 shadow-md">
      <div className="container flex justify-between items-center">
        {/* Left side: Title and Hamburger */}
        <div className="flex items-center space-x-4">
          {/* Hamburger (small screens only) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className="text-2xl">
              {menuOpen ? '✕' : '☰'}
            </span>
          </button>

          {/* Title - always shown */}
          <Link to="/" className="text-xl font-bold">
            AMN Finance Manager
          </Link>

          {/* Nav links - large screens only */}
          <div className="hidden lg:flex space-x-4">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/students" className="hover:underline">
              Students
            </Link>
            <Link to="/books" className="hover:underline">
              Books
            </Link>
          </div>
        </div>


        {/* Right side*/}
        <div className="flex items-center space-x-4">

          {/* Auth links - always visible */}
          {user ? (
            <>
              <span className="font-semibold">{user.username}</span>
              <button onClick={logout} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Dropdown menu - small screens only */}
      {menuOpen && (
        <div className="lg:hidden mt-2 space-y-2">
          <Link to="/" className="block px-4 hover:underline" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/students" className="block px-4 hover:underline" onClick={() => setMenuOpen(false)}>
            Students
          </Link>
          <Link to="/books" className="block px-4 hover:underline" onClick={() => setMenuOpen(false)}>
            Books
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
