import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';

const styles = {
  navbar: {
    position: 'fixed',
    bottom: '80px',
    left: 0,
    display: 'flex',
    width: '100vw',
    height: '60px',
    backgroundColor: '#ffe6f0',
    boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)',
    zIndex: 1000,
  },
  navButton: {
    flex: 1,
    display: 'flex',
    height: '85px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid #ddd',
    fontWeight: 600,
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    { label: '🕒 Today', path: '/Today' },
    { label: '📅 Calendar', path: '/ProductCalendar' },
    { label: '📚 My Shelf', path: '/shelf' },
    { label: '🔍 Browse Products', path: '/search' },
    { label: '👤 Profile', path: '/profile' },
  ];

  const handleHover = (e, hover, isActive) => {
    if (isActive) return; // keep active color
    e.target.style.backgroundColor = hover ? '#7e5e63' : '#fff';
    e.target.style.color = hover ? '#fff' : '#000';
  };

  return (
    <nav style={styles.navbar}>
      {buttons.map((btn, index) => {
        const isActive = location.pathname === btn.path;

        return (
          <div
            key={btn.label}
            style={{
              ...styles.navButton,
              borderRight: index === buttons.length - 1 ? 'none' : styles.navButton.borderRight,
              backgroundColor: isActive ? '#5a273b' : '#fff',
              color: isActive ? '#fff' : '#000',
            }}
            onClick={() => navigate(btn.path)}
            onMouseEnter={(e) => handleHover(e, true, isActive)}
            onMouseLeave={(e) => handleHover(e, false, isActive)}
          >
            {btn.label}
          </div>
        );
      })}
    </nav>
  );
}

export default Navbar;
