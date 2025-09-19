import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container flex items-center gap-4">
        <Link to="/" className="font-semibold">NotifApp</Link>

        {/* Sirf login hone ke baad hi show karo */}
        {user && (
          <>
            <Link to="/campaigns">Campaigns</Link>
            <Link to="/deliveries">Deliveries</Link>
            <Link to="/assigned" className="px-2">Assigned to Me</Link>

          </>
        )}

        {/* Admin link ko conditionally render karo */}
        {user?.role === 'admin' && (
          <Link to="/admin">Admin</Link>
        )}
        
        <div className="ml-auto">
          {user ? (
            <div className="flex items-center gap-3">
              {/* User ka naam dikhao */}
              <span>{user.username || user.email}</span>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-600 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-3 py-1 bg-blue-600 rounded">
                Login
              </Link>
              <Link to="/register" className="px-3 py-1 border rounded">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
