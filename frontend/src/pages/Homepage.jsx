
// export default Homepage;
// src/pages/Homepage.jsx
import React from 'react';
import Footer from '../pages/Footer';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import worldmap from '../assets/worldmap.png';
import './Homepage.css';
import { auth, db } from '../firebase/firebase';


function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <header className="hero">
        <h1 className="hero-title">Luminella</h1>
        <p className="hero-subtitle">
          You're Not Alone, Join our Skincare Lovers Around the World – From Breakouts to Glow-ups, We’ve Got You Covered!
        </p>

        <button className="hero-button" onClick={() => navigate('/questionnaires')}>
          Get Started
        </button>

        <button className="secondary-button" onClick={() => navigate('/login')}>
          Already have an account?
        </button>

        <img src={worldmap} alt="World map" className="worldmap" />
      </header>

      {/* <section className="features">
        <div className="feature" onClick={() => navigate('/')}>🕒 Today</div>
        <div className="feature" onClick={() => navigate('/ProductCalendar')}>📅 Calendar</div>
        <div className="feature" onClick={() => navigate('/shelf')}>📚 My Shelf</div>
        <div className="feature" onClick={() => navigate('/search')}>🔍 Search Products</div>
        <div className="feature" onClick={() => navigate('/profile')}>👤 Profile</div>
      </section> */}

      <Footer />
    </div>
  );
}

export default Homepage;
