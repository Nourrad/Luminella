// Homepage.jsx
import React from 'react';
import Footer from '../pages/Footer';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import worldmap from '../assets/worldmap.png';
import './Homepage.css';


const styles = {
  homepage: {
    width: '100vw',
    minHeight: '100vh',
    backgroundColor: '#f0ede5',
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowX: 'hidden',
    position: 'relative',
    paddingBottom: '100px',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#5a273b',
    padding: '0 20px 10px 20px',
    width: '100vw',
    position: 'relative',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
    borderBottomLeftRadius: '30px',
    borderBottomRightRadius: '30px',
  },
  heroH1: {
    fontSize: '3.5rem',
    marginBottom: '10px',
  },
  heroP: {
    fontSize: '1.2rem',
    marginBottom: '30px',
  },
 heroButton: {
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    padding: '12px 30px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: '0.3s',
    fontWeight: 'bold',
},
  worldmap: {
    width: '100%',
    maxWidth: '800px',
    display: 'block',
    margin: '0 auto 1rem auto',
  },
  features: {
    position: 'fixed',
    bottom: '80px',
    left: 0,
    display: 'flex',
    width: '100vw',
    height: '60px',
    backgroundColor: '#f0ede5',
    boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)',
    zIndex: 1000,
  },
  feature: {
    flex: 1,
    display: 'flex',
    height: '85px',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid #ddd',
    backgroundColor: '#fff',
    fontWeight: 600,
    fontSize: '1.2rem',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    transition: 'background-color 0.3s ease',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
};

function Homepage() {
  const navigate = useNavigate();

  return (
    <div style={styles.homepage}>
      <header style={styles.hero} className="hero">
        <h1 style={styles.heroH1}>Luminella</h1>
        <p style={styles.heroP}>
          You're Not Alone, Join our Skincare Lovers Around the World – From Breakouts to Glow-ups, We’ve Got You Covered!
        </p>
        <button
          style={styles.heroButton}
          className="hero-button"
          onClick={() => navigate('/questionnaires')}
        >
          Get Started
        </button>
      
      <img src={worldmap} alt="World map with dots" style={styles.worldmap} />
      </header>

      <section style={styles.features}>
        <div style={styles.feature} onClick={() => navigate('/')}>✨ Homepage</div>
        <div style={styles.feature} onClick={() => navigate('/ProductCalendar')}>📅 Calendar</div>
        <div style={styles.feature} onClick={() => navigate('/shelf')}>📚 My Shelf</div>
        <div style={styles.feature} onClick={() => navigate('/search')}>🔍 Search Products</div>
        <div style={styles.feature} onClick={() => navigate('/profile')}>👤 Profile</div>
      </section>
      <Footer />
    </div>
  );
}

export default Homepage;
