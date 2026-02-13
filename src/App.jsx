import React, { useState } from 'react';
import Calculator from './components/Calculator';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [isLocked, setIsLocked] = useState(false); // Changed to false to show Auth first
  const [user, setUser] = useState(null);

  const handleUnlock = (enteredCode) => {
    // If user is logged in, verify their secret code
    if (user && user.secret_code === enteredCode) {
      setIsLocked(false);
      return true;
    }
    // If no user logged in, just unlock to show auth screen
    if (!user) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLocked(false); // Unlock after successful login
  };

  const handleLogout = () => {
    setUser(null);
    setIsLocked(true); // Lock to show calculator after logout
  };

  return (
    <div className="app">
      {!user ? (
        <Auth onLogin={handleLogin} />
      ) : (
        isLocked ? (
          <Calculator onUnlock={handleUnlock} user={user} />
        ) : (
          <Dashboard user={user} onLogout={handleLogout} />
        )
      )}
    </div>
  );
}

export default App;
