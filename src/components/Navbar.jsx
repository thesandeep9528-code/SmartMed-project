import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, LogIn, LogOut, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

export default function Navbar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Patient', path: '/patient' },
    { name: 'Doctor', path: '/doctor' },
    { name: 'Admin', path: '/admin' },
    { name: 'Book', path: '/book' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-primary-50 p-2 rounded-lg">
                  <Activity className="h-6 w-6 text-primary-500" />
                </div>
                <span className="font-bold text-xl text-gray-900 tracking-tight">SmartMed</span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden sm:flex sm:items-center sm:space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Right: Auth + Live Queue */}
            <div className="hidden sm:flex sm:items-center gap-3">
              <Link
                to="/queue"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-500 hover:bg-primary-600 shadow-sm transition-all shadow-primary-500/20"
              >
                Live Queue
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  {/* User Avatar */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/queue"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-500 text-center"
            >
              Live Queue
            </Link>
            {user ? (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 px-4 mb-2 truncate">{user.email}</p>
                <button
                  onClick={() => { handleSignOut(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setShowModal(true); setMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </>
  );
}
