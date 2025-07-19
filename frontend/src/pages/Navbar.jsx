import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    backgroundColor: '#fff',
    transition: 'background-color 0.3s ease',
  },
};

function Navbar() {
  const navigate = useNavigate();

  const handleHover = (e, hover) => {
    e.target.style.backgroundColor = hover ? '#7e5e63' : '#fff';
    e.target.style.color = hover ? '#fff' : '#000';
    e.target.style.boxShadow = hover
      ? '0 8px 16px rgba(0, 0, 0, 0.15)'
      : 'none';
  };

  return (
    <nav style={styles.navbar}>
      {[
        { label: '🕒 Today', path: '/Today' },
        { label: '📅 Calendar', path: '/ProductCalendar' },
        { label: '📚 My Shelf', path: '/shelf' },
        { label: '🔍 Search Products', path: '/search' },
        { label: '👤 Profile', path: '/profile' },
      ].map((btn, index, arr) => (
        <div
          key={btn.label}
          style={{
            ...styles.navButton,
            borderRight: index === arr.length - 1 ? 'none' : styles.navButton.borderRight,
          }}
          onClick={() => navigate(btn.path)}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          {btn.label}
        </div>
      ))}
    </nav>
  );
}

export default Navbar;
