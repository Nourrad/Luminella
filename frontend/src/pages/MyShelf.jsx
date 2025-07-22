import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { db } from '../firebase/firebase';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { useRef } from 'react';



const categories = [
  'Cleansers', 'Toners', 'Serums', 'Moisturizers', 'Sunscreens', 'Exfoliators', 'Eye Creams'
];

function MyShelf() {
  const [productsByCategory, setProductsByCategory] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchList = async () => {
      if (!userId) return;
      const listRef = collection(db, 'users', userId, 'List');
      const snapshot = await getDocs(listRef);
      const fetched = {};

      snapshot.forEach(doc => {
        const data = doc.data();
        const category = data.category;
        if (!fetched[category]) fetched[category] = [];
        fetched[category].push({ id: doc.id, ...data });
      });

      setProductsByCategory(fetched);
    };

    fetchList();
  }, [userId]);

  const handleAddToShelf = async () => {
    if (!userId || !selectedProduct) return;
    const shelfRef = doc(db, 'users', userId, 'shelf', selectedProduct.id);

    try {
      await setDoc(shelfRef, {
        productId: selectedProduct.id,
        productName: selectedProduct.productName,
        image_url: selectedProduct.image_url,
        category: selectedProduct.category,
        suitableSkinTypes: selectedProduct.suitableSkinTypes,
        usageTime: selectedProduct.usageTime,
        frequencyPerWeek: selectedProduct.frequencyPerWeek,
        possibleConcerns: selectedProduct.possibleConcerns,
        use: selectedProduct.use,
        createdAt: serverTimestamp()
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      setShowModal(false);
    } catch (err) {
      console.error('Error adding to shelf:', err);
      alert('Something went wrong.');
    }
  };

const handleRemoveFromList = async () => {
  if (!userId || !selectedProduct) return;

  try {
    // DELETE FROM "shelf" not "List"
    await deleteDoc(doc(db, 'users', userId, 'shelf', selectedProduct.id));
    setShowModal(false);

    // Remove from UI state
    setProductsByCategory(prev => {
      const updated = { ...prev };
      updated[selectedProduct.category] = updated[selectedProduct.category].filter(p => p.id !== selectedProduct.id);
      return updated;
    });
  } catch (error) {
    console.error('Failed to remove product:', error);
    alert('Error removing the product.');
  }
};


  return (
    <div style={{ backgroundColor: '#f0ede5', minHeight: '140vh', padding: '100px 0 150px 0', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#5a273b', fontFamily: 'cursive', fontSize: '2.5rem', fontWeight: 'bold' }}>Top skincare picks 🧴</h2>

      {categories.map(cat => {
        if (!productsByCategory[cat] || productsByCategory[cat].length === 0) return null;
        return (
          <div key={cat} style={{ marginBottom: '3rem' }}>
            <h3 style={{ color: '#5a273b', fontSize: '1.5rem', fontWeight: 'bold', marginLeft: '2rem' }}>{cat}</h3>
            
            <div style={{ display: 'flex', overflowX: 'auto', padding: '1rem 2rem', gap: '1rem' }}>
              {productsByCategory[cat].slice(0, 10).map(p => (
                <button
                  key={p.id}
                  className="product-button"
                  onClick={() => { setSelectedProduct(p); setShowModal(true); }}
                  style={{
                    width: '220px', height: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    alignItems: 'center', borderRadius: '16px', border: '2px solid #5a273b', backgroundColor: '#fff',
                    overflow: 'hidden', cursor: 'pointer'
                  }}
                >
                  {p.image_url && (
                    <img
                      src={`/images/${p.image_url}`}
                      alt={p.productName}
                      style={{
                        height: '160px', width: '100%', objectFit: 'cover', borderBottom: '1px solid #ccc'
                      }}
                    />
                  )}
                  <span style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1rem', color: '#5a273b' }}>
                    {p.productName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {showModal && selectedProduct && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{
            backgroundColor: '#f0ede5', borderRadius: '16px', padding: '2rem',
            width: '700px', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', position: 'relative'
          }}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute', top: '10px', right: '15px', backgroundColor: 'transparent',
                border: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', color: '#000'
              }}
            >✖️</button>
            <img
              src={`/images/${selectedProduct.image_url}`}
              alt={selectedProduct.productName}
              style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
            />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: 'sans-Segoe UI, sans-serif', fontSize: '1.4rem', color: '#5a273b' }}>
                {selectedProduct.productName}
              </h2>
              <p style={{ marginTop: '1rem' }}>
                <strong>Suitable Skin Types:</strong>{' '}
                {selectedProduct.suitableSkinTypes?.join(', ') || 'Not specified'}
              </p>
              <p style={{ marginTop: '0.5rem' }}>{selectedProduct.description}</p>
              <p style={{ marginTop: '0.5rem' }}>
                <strong>Usage time:</strong>{' '}
                {Array.isArray(selectedProduct.usageTime)
                  ? selectedProduct.usageTime.join(', ')
                  : selectedProduct.usageTime || 'Not specified'}
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                <strong>Times per week:</strong> {selectedProduct.frequencyPerWeek || 'Not specified'}
              </p>
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={handleAddToShelf}
                  style={{
                    padding: '0.7rem 1.5rem',
                    backgroundColor: '#fff',
                    color: '#5a273b',
                    border: '2px solid #5a273b',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                  onMouseOver={e => {
                    e.target.style.backgroundColor = '#5a273b';
                    e.target.style.color = '#fff';
                  }}
                  onMouseOut={e => {
                    e.target.style.backgroundColor = '#fff';
                    e.target.style.color = '#5a273b';
                  }}
                >
                  Add to Shelf
                </button>
                  <button
    onClick={handleRemoveFromList}
    style={{
      padding: '0.7rem 1.5rem',
      backgroundColor: '#5a273b',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold'
    }}
    onMouseOver={e => e.target.style.backgroundColor = '#5a273b'}
    onMouseOut={e => e.target.style.backgroundColor = '#5a273b'}
  >
    Remove
  </button>

                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.7rem 1.5rem',
                    backgroundColor: '#5a273b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          left: '40%',
          transform: 'translateX(-50%)',
          backgroundColor: '#5a273b',
          color: '#fff',
          padding: '1rem 2rem',
          borderRadius: '10px',
          fontSize: '1rem',
          fontWeight: 'bold',
          animation: 'fadeInOut 3s ease-in-out',
          zIndex: 1000
        }}>
          ✅ Added to your shelf!
        </div>
      )}

      <Navbar />
    </div>
  );
}

export default MyShelf;
