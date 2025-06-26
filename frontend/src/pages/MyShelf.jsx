import React from 'react';
import Navbar from './Navbar';

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
  },
};

function MyShelf() {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧴 My Skincare Shelf</h2>
      <p style={styles.placeholder}>
        Your selected products will appear here soon!
      </p>
      <Navbar />
    </div>
  );
}

export default MyShelf;
