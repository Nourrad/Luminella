// SearchProducts.jsx

// import React, { useState } from 'react';
// import Navbar from './Navbar';
// import Footer from '../pages/Footer';
// import { auth, db } from '../firebase/firebase';
// import { collection, getDocs, query, where } from 'firebase/firestore';



// const categories = [
//   'Cleansers',
//   'Sunscreens',
//   'Toners',
//   'Serums',
//   'Moisturizers',
//   'Exfoliating/Peeling',
//   'Makeup removers'
// ];

// const skinTypes = ['Dry', 'Normal','Combo', 'Oily' ];


import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from '../pages/Footer';
// import { db } from '../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';


const possibleConcerns = [
  'Pimples', 'Enlarged pores', 'Redness', 'Dullness',
  'Texture', 'Uneven tone', 'Dark circles', 'Dryness', 'Oiliness'
];


const categories = [
  'Cleansers',
  'Sunscreens',
  'Toners',
  'Serums',
  'Moisturizers',
  'Exfoliating/Peeling',
  'Makeup removers'
];

const skinTypes = ['Dry', 'Normal', 'Combo', 'Oily'];

function SearchProducts() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkinType, setSelectedSkinType] = useState('');
  const [products, setProducts] = useState([]);
  const [showConcernsFilter, setShowConcernsFilter] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // new: to store product clicked
  const [showModal, setShowModal] = useState(false); // new: to control modal visibility
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showListSuccessMessage, setShowListSuccessMessage] = useState(false);




  const handleAddToShelf = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId || !selectedProduct) return;
  const shelfRef = doc(db, 'users', userId, 'shelf', selectedProduct.id);


  try {
    // const shelfRef = doc(db, 'users', user.uid, 'shelf', selectedProduct.id);
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
    // alert('Product added to your shelf!');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    setShowModal(false);
  } catch (err) {
    console.error('Error adding to shelf:', err);
    alert('Something went wrong.');
  }
};
const handleAddToList = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId || !selectedProduct) return;

  const listRef = doc(db, 'users', userId, 'List', selectedProduct.id);

  try {
    await setDoc(listRef, {
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

    setShowListSuccessMessage(true);
    setTimeout(() => setShowListSuccessMessage(false), 3000);
    setShowModal(false);
  } catch (err) {
    console.error('Error adding to list:', err);
    alert('Something went wrong.');
  }
};



  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    } catch (err) {
      console.error('❌ Error fetching all products:', err);
    }
  };

  const fetchFilteredProducts = async (category, skinType = '') => {
    try {
      const productsRef = collection(db, 'products');
      let q;

      if (category && skinType) {
        q = query(
          productsRef,
          where('category', '==', category),
          where('suitableSkinTypes', 'array-contains', skinType)
        );
      } else if (category) {
        q = query(productsRef, where('category', '==', category));
      }

      const snapshot = await getDocs(q);
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    } catch (err) {
      console.error('❌ Error fetching filtered products:', err);
      setProducts([]);
    }
  };

  const handleConcernClick = async (concern) => {
    setSelectedConcern(concern);
    try{
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('possibleConcerns', 'array-contains', concern));
      const snapshot = await getDocs(q);
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
        }));
        setProducts(productList);
        } catch (err) {
          console.error('❌ Error fetching concern-based products:', err);
          setProducts([]);
    }
  };



  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSkinType('');
    fetchFilteredProducts(category);
  };

  const handleSkinTypeClick = (skinType) => {
    setSelectedSkinType(skinType);
    fetchFilteredProducts(selectedCategory, skinType);
  };

  return (
    <div style={{ padding: '4rem 4rem 9rem', backgroundColor: '#f0ede5', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', overflowY: 'auto' }}>
      <style>
  {`
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(20px); }
      10% { opacity: 1; transform: translateY(0); }
      90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(20px); }
    }
  `}
</style>

      <Navbar />
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', color: "#5a273b",fontFamily:'cursive', fontWeight: 'bold' }}> Your Skincare Matchmaker 🧴</h1>

      {/* Step 1: Category buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              borderRadius: '10px',
              backgroundColor: selectedCategory === cat ? '#5a273b' : '#fff',
              color: selectedCategory === cat ? '#fff' : '#5a273b',
              border: '2px solid #5a273b',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
         <button onClick={() => { setShowConcernsFilter(true);
         setSelectedCategory('');
         setSelectedSkinType('');
         setProducts([]);
         }}
         style={{  
          padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '10px', border: '2px solid #5a273b', cursor: 'pointer',
          backgroundColor: showConcernsFilter ? '#5a273b' : '#fff', color: showConcernsFilter ? '#fff' : '#5a273b', fontWeight: 'bold'
         }}>
          Skin Concerns
         </button>
         </div>
         {showListSuccessMessage && (
  <div style={{
  position: 'fixed',
  top: '2rem',
  left: '40%',
  transform: 'translateX(-50%)',
  backgroundColor: '#5a273b',
  color: '#fff',
  padding: '1rem 2rem',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  fontSize: '1rem',
  zIndex: 9999,
  fontWeight: 'bold',
  animation: 'fadeInOut 3s ease-in-out'
  }}>
    ✅ Added to your list!
  </div>
)}

         {showConcernsFilter && (
          <>
          <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Select a Concern:</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', margin: '1rem' }}>
            {possibleConcerns.map((concern) => (
              <button
              key={concern}
              onClick={() => handleConcernClick(concern)}
              style={{
                padding: '0.75rem 1.5rem', borderRadius: '10px', backgroundColor: selectedConcern === concern ? '#5a273b' : '#fff',
                color: selectedConcern === concern ? '#fff' : '#5a273b',border: '2px solid #5a273b', cursor: 'pointer', fontWeight: 'bold'
              }} 
              >{concern}</button>
              ))}
              </div>
              </>
              )}

      {/* Step 2: Skin type buttons */}
      {selectedCategory && (
        <>
          <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Filter by Skin Type:</h2>
          <div style={{ display: 'flex',flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', margin: '2rem' }}>
            {skinTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleSkinTypeClick(type.toLowerCase())}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  backgroundColor: selectedSkinType === type.toLowerCase() ? '#5a273b' : '#fff',
                  color: selectedSkinType === type.toLowerCase() ? '#fff' : '#5a273b',
                  border: '2px solid #5a273b',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Step 3: Display Products */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '2rem',
        marginTop: '2rem'
      }}>
        {products.map((p) => (
          <button
          key={p.id}
          className="product-card"

          onClick={() => {
            setSelectedProduct(p);
            setShowModal(true);
          }}
          style={{
            width: '220px', height: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', borderRadius: '16px', border: '2px solid #5a273b', backgroundColor: '#fff',
            overflow: 'hidden', cursor: 'pointer' }}
            >
              {p.image_url && (
                <img
                src={`/images/${p.image_url}`}
                alt={p.productName}
                style={{ 
                  height: '160px', width: '100%',objectFit: 'cover', borderBottom: '1px solid #ccc'}}
                  />
                )}
                <span style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1rem', color: '#5a273b' }}>
                  {p.productName}
                  
                </span>
            </button>
            ))}
      </div>
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
            className="close-button"
            style={{
              position: 'absolute', top: '10px', right: '15px', backgroundColor: 'transparent',
             border: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer',color: '#000'
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
            <p style={{ marginTop: '1rem', fontFamily: 'sans-Segoe UI, sans-serif', fontSize: '1rem' }}>
              <strong>Suitable Skin Types:</strong>{' '}
              {selectedProduct.suitableSkinTypes?.join(', ') || 'Not specified'}
            </p>
            
            <p style={{ marginTop: '0.5rem', fontFamily: 'Segoe UI, sans-serif', fontSize: '1rem' }}>
              {selectedProduct.description}
              </p>
              <p style={{ marginTop: '0.5rem', fontFamily: 'Segoe UI, sans-serif', fontSize: '1rem' }}>
                 <strong>Usage time:</strong>{' '}
              {Array.isArray(selectedProduct.usageTime)
              ? selectedProduct.usageTime.join(', ')
              : selectedProduct.usageTime || 'Not specified'}

            </p>

            <p style={{ marginTop: '0.5rem', fontFamily: 'sans-Segoe UI, sans-serif', fontSize: '1rem' }}>
              <strong>Times per week:</strong>{' '}
              {selectedProduct.frequencyPerWeek || 'Not specified'}
            </p>
<div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  {/* Add to Shelf on the left */}
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

  {/* Close and Add to Fav on the right */}
  <div style={{ display: 'flex', gap: '1rem' }}>
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

    <button
    onClick={handleAddToList}
      style={{
        padding: '0.7rem 1.5rem',
        backgroundColor: '#5a273b',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
      // Will add function later
    >
      Add to List
    </button>
  </div>
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
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  fontSize: '1rem',
  zIndex: 9999,
  fontWeight: 'bold',
  animation: 'fadeInOut 3s ease-in-out'
}}>
  ✅ Added to your shelf!
</div>
)}

                  <Footer />
                  </div>
                );
                }

export default SearchProducts;
