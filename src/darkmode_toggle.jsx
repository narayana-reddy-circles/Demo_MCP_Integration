import React, { useState, useEffect } from 'react';
import './darkmode_toggle.css';

const DarkModeToggle = () => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Apply theme to document root and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="theme-toggle-container">
      <button
        className={`theme-toggle-btn ${theme}`}
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <div className="toggle-track">
          <div className="toggle-thumb">
            <span className="toggle-icon">
              {theme === 'light' ? '☀️' : '🌙'}
            </span>
          </div>
        </div>
        <span className="toggle-label">
          {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>
    </div>
  );
};

export default DarkModeToggle;
