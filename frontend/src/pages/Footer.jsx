// Footer.jsx
import React from 'react';

const footerStyle = {
  width: '100vw',
  backgroundColor: '#5a273b', // dark brown
  color: '#f5f5dc',           // light beige text
  padding: '20px',
  fontSize: '0.9rem',
  textAlign: 'center',
  position: 'fixed',
  bottom: 0,
  left: 0,
  zIndex: 1000
};

function Footer() {
  return (
    <footer style={footerStyle}>
      © 2025 Luminella. All rights reserved.
    </footer>
  );
}

export default Footer;
