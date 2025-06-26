// Calendar.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from '../pages/Footer';

function Calendar() {
  const pageStyle = {
    padding: '4rem',
    backgroundColor: '#f0ede5',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', sans-serif",
    textAlign: 'center',
  };

  return (
    <div style={pageStyle}>
      <Navbar />
      <h1>📅 Calendar Page (Coming Soon)</h1>
      <Footer />
    </div>
  );
}

export default Calendar;
