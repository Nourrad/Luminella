import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

const styles = {
  container: {
    backgroundColor: '#f0ede5',
    padding: '2rem 4rem',
    paddingTop: '120px',
    fontFamily: 'Segoe UI, sans-serif',
    minHeight: '100vh',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#5a273b',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#5a273b',
    marginBottom: '1rem',
    marginTop: '2rem',
  },
  productGrid: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  productCard: {
    backgroundColor: '#fff',
    border: '2px solid #5a273b',
    borderRadius: '16px',
    width: '200px',
    padding: '1rem',
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    transition: 'opacity 0.3s ease',
  },
  productImage: {
    width: '100%',
    height: '130px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '1rem',
  },
  markButton: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#5a273b',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  doneLabel: {
    marginTop: '1rem',
    color: 'green',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#fff',
    color: '#5a273b',
    border: '2px solid #5a273b',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  routineComplete: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#777',
    marginTop: '1rem',
  },
};

function Today() {
  const navigate = useNavigate();
  const [morningProducts, setMorningProducts] = useState([]);
  const [nightProducts, setNightProducts] = useState([]);
  const [markedDone, setMarkedDone] = useState({});

  useEffect(() => {
    const fetchShelf = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const snapshot = await getDocs(collection(db, 'users', userId, 'shelf'));
      const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const today = new Date();
      const todayTime = today.setHours(0, 0, 0, 0);

      const morning = [];
      const night = [];

      allProducts.forEach(product => {
        const createdAt = product.createdAt?.toDate?.();
        if (!createdAt) return;

        const createdTime = createdAt.setHours(0, 0, 0, 0);

        // Only include products scheduled for or before today and meant to be used daily
        if (createdTime <= todayTime && product.frequencyPerWeek === 'Every day') {
          if (product.usageTime?.includes('Morning')) morning.push(product);
          if (product.usageTime?.includes('Night')) night.push(product);
        }
      });

      setMorningProducts(morning);
      setNightProducts(night);
    };

    fetchShelf();
  }, []);

  const handleMarkDone = (productId) => {
    setMarkedDone(prev => ({ ...prev, [productId]: true }));
  };

  const renderProductCard = (product) => (
    <div
      key={product.id}
      style={{
        ...styles.productCard,
        opacity: markedDone[product.id] ? 0.5 : 1,
      }}
    >
      <img
        src={`/images/${product.image_url}`}
        alt={product.productName}
        style={styles.productImage}
      />
      <h4 style={{ color: '#5a273b' }}>{product.productName}</h4>
      <p><strong>Usage:</strong> {Array.isArray(product.usageTime) ? product.usageTime.join(', ') : product.usageTime}</p>
      <p><strong>Frequency:</strong> {product.frequencyPerWeek}</p>
      {markedDone[product.id] ? (
        <div style={styles.doneLabel}>✅ Done</div>
      ) : (
        <button style={styles.markButton} onClick={() => handleMarkDone(product.id)}>
          Mark as Done
        </button>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.titleRow}>
        <button style={styles.backButton} onClick={() => navigate('/')}>
          ← Home
        </button>
        <h2 style={styles.title}>🧴 Your Routine for Today</h2>
        <div></div>
      </div>

      {morningProducts.length > 0 && (
        <>
          <h3 style={styles.sectionTitle}>🌞 Morning Routine</h3>
          <div style={styles.productGrid}>
            {morningProducts.map(renderProductCard)}
          </div>
          {morningProducts.every(p => markedDone[p.id]) && (
            <p style={styles.routineComplete}>✅ Morning routine complete!</p>
          )}
        </>
      )}

      {nightProducts.length > 0 && (
        <>
          <h3 style={styles.sectionTitle}>🌙 Night Routine</h3>
          <div style={styles.productGrid}>
            {nightProducts.map(renderProductCard)}
          </div>
          {nightProducts.every(p => markedDone[p.id]) && (
            <p style={styles.routineComplete}>✅ Night routine complete!</p>
          )}
        </>
      )}

      {morningProducts.length === 0 && nightProducts.length === 0 && (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#888' }}>
          No products scheduled for today.
        </p>
      )}

      <Navbar />
    </div>
  );
}

export default Today;
