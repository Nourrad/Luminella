import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { auth, db } from '../firebase/firebase';


const styles = {
  container: {
    backgroundColor: '#f0ede5',
    padding: '2rem',
    paddingTop: '100px',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#333',
  },
  placeholder: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#777',
    marginBottom: '2rem',
  },
  button: {
    display: 'block',
    margin: '0 auto',
    padding: '0.8rem 1.5rem',
    backgroundColor: '#7e5e63',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

function Today() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧴 Today</h2>
      <p style={styles.placeholder}>
        Your selected products will appear here soon!
      </p>
      <button style={styles.button} onClick={() => navigate('/')}>
        Go to Homepage
      </button>
      <Navbar />
    </div>
  );
}

export default Today;
