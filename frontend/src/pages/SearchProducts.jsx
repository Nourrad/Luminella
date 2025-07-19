// // SearchProducts.jsx
// import React, { useState } from 'react';
// import Navbar from './Navbar';
// import Footer from '../pages/Footer';

// function SearchProducts() {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState([]);

//   const containerStyle = {
//     padding: '4rem',
//     backgroundColor: '#f0ede5',
//     minHeight: '100vh',
//     fontFamily: "'Segoe UI', sans-serif",
//   };

//   const headingStyle = {
//     fontSize: '2rem',
//     marginBottom: '1rem',
//     textAlign: 'center',
//   };

//   const inputStyle = {
//     padding: '0.5rem 1rem',
//     borderRadius: '8px',
//     border: '1px solid #ccc',
//     width: '100%',
//     maxWidth: '400px',
//     margin: '0 auto 2rem',
//     display: 'block',
//   };

//   const productStyle = {
//     backgroundColor: '#f9f9f9',
//     padding: '1rem',
//     borderRadius: '12px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//     marginBottom: '1rem',
//     maxWidth: '600px',
//     margin: '1rem auto',
//     textAlign: 'left',
//   };

//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setQuery(value);
//     // Dummy search logic
//     const dummyResults = [
//       { id: 1, name: 'Gentle Cleanser' },
//       { id: 2, name: 'Hydrating Serum' },
//     ];
//     setResults(dummyResults.filter(p => p.name.toLowerCase().includes(value.toLowerCase())));
//   };

//   return (
//     <div style={containerStyle}>
//       <Navbar />
//       <h1 style={headingStyle}>🔍 Search Skincare Products</h1>
//       <input
//         type="text"
//         placeholder="Search for a product..."
//         value={query}
//         onChange={handleSearch}
//         style={inputStyle}
//       />
//       <div>
//         {results.map(product => (
//           <div key={product.id} style={productStyle}>
//             <strong>{product.name}</strong>
//           </div>
//         ))}
//       </div>
//       <Footer />
//     </div>
//   );
// }


///////////////////////////////////////////////////////////////////////////////////////////////

// // export default SearchProducts;
// import React, { useState } from 'react';
// import Navbar from './Navbar';
// import Footer from '../pages/Footer';

// const categories = [
//   'Cleansers',
//   'Toners',
//   'Serums',
//   'Moisturizers',
//   'Exfoliating/Peeling',
//   'Makeup remover'
// ];

// const skinTypes = ['Dry', 'Normal', 'Oily', 'Combination'];

// function SearchProducts() {
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedSkinType, setSelectedSkinType] = useState('');
//   const [products, setProducts] = useState([]);

//   const fetchProducts = async (category, skinType) => {
//     try {
//       const res = await fetch(`/api/products/${category}/${skinType}`);
//       const data = await res.json();
//       setProducts(data);
//     } catch (err) {
//       console.error('Error fetching products:', err);
//       setProducts([]);
//     }
//   };

//   const handleCategoryClick = (category) => {
//     setSelectedCategory(category);
//     setSelectedSkinType('');
//     setProducts([]);
//   };

//   const handleSkinTypeClick = (skinType) => {
//     setSelectedSkinType(skinType);
//     fetchProducts(selectedCategory, skinType);
//   };
  

//   return (
//     <div style={{ padding: '4rem', backgroundColor: '#f0ede5', minHeight: '100vh' }}>
//       <Navbar />
//       <h1 style={{ textAlign: 'center', fontSize: '2rem' }}>🧴 Browse Products</h1>

//       {/* Step 1: Category buttons */}
//       <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => handleCategoryClick(cat)}
//             style={{
//               padding: '1rem 2rem',
//               fontSize: '1.1rem',
//               borderRadius: '10px',
//               backgroundColor: selectedCategory === cat ? '#5a273b' : '#fff',
//               color: selectedCategory === cat ? '#fff' : '#5a273b',
//               border: '2px solid #5a273b',
//               cursor: 'pointer'
//             }}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* Step 2: Skin type filters (only after category selected) */}
//       {selectedCategory && (
//         <>
//           <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Filter by Skin Type:</h2>
//           <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' }}>
//             {skinTypes.map((type) => (
//               <button
//                 key={type}
//                 onClick={() => handleSkinTypeClick(type.toLowerCase())}
//                 style={{
//                   padding: '0.5rem 1.5rem',
//                   borderRadius: '8px',
//                   backgroundColor: selectedSkinType === type.toLowerCase() ? '#5a273b' : '#fff',
//                   color: selectedSkinType === type.toLowerCase() ? '#fff' : '#5a273b',
//                   border: '1px solid #5a273b',
//                   cursor: 'pointer'
//                 }}
//               >
//                 {type}
//               </button>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Step 3: Product list */}
//       <div style={{ marginTop: '2rem' }}>
//         {products.length > 0 ? (
//           products.map((p) => (
//             <div key={p.id} style={{
//               backgroundColor: '#fff',
//               margin: '1rem auto',
//               padding: '1rem',
//               borderRadius: '10px',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//               maxWidth: '600px'
//             }}>
//               <h3>{p.name}</h3>
//               <p>Type: {p.type}</p>
//               <p>For: {p.suitable_for.join(', ')}</p>
//               {p.image_url && <img src={`/images/${p.image_url}`} alt={p.name} width="150" />}
//             </div>
//           ))
//         ) : selectedSkinType ? (
//           <p style={{ textAlign: 'center', marginTop: '2rem' }}>No products found.</p>
//         ) : null}
//       </div>

//       <Footer />
//     </div>
//   );
// }

import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from '../pages/Footer';
import { auth, db } from '../firebase/firebase';


const categories = [
  'Cleansers',
  'Toners',
  'Serums',
  'Moisturizers',
  'Exfoliating/Peeling',
  'Makeup remover'
];

const skinTypes = ['Dry', 'Normal', 'Oily', 'Combination'];

function SearchProducts() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkinType, setSelectedSkinType] = useState('');
  const [products, setProducts] = useState([]);

  const fetchProducts = async (category, skinType) => {
    try {
      // const res = await fetch(`/api/products/${category}/${skinType}`);
      const res = await fetch(`/api/products/${encodeURIComponent(category)}/${skinType}`);

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSkinType('');
    setProducts([]);
  };

  const handleSkinTypeClick = (skinType) => {
    setSelectedSkinType(skinType);
    fetchProducts(selectedCategory, skinType);
  };

  return (
    <div style={{ padding: '4rem', backgroundColor: '#f0ede5', minHeight: '100vh' }}>
      <Navbar />
      <h1 style={{ textAlign: 'center', fontSize: '2rem' }}>🧴 Browse Products</h1>

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
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Step 2: Skin type buttons */}
      {selectedCategory && (
        <>
          <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Filter by Skin Type:</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' }}>
            {skinTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleSkinTypeClick(type.toLowerCase())}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '8px',
                  backgroundColor: selectedSkinType === type.toLowerCase() ? '#5a273b' : '#fff',
                  color: selectedSkinType === type.toLowerCase() ? '#fff' : '#5a273b',
                  border: '1px solid #5a273b',
                  cursor: 'pointer'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Step 3: Product image buttons */}
      {selectedCategory && selectedSkinType && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          marginTop: '2rem'
        }}>
          {products.slice(0, 4).map((p, idx) => {
            console.log('📦', p.name, p.image_url); // debug
            return (
              <button key={idx} style={{
                width: '220px',
                height: '260px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '16px',
                border: '2px solid #5a273b',
                backgroundColor: '#fff',
                overflow: 'hidden',
                cursor: 'pointer',
              }}>
                {p.image_url && (
                  <img
                    src={`/images/${p.image_url}`}
                    alt={p.name}
                    style={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'cover',
                      borderBottom: '1px solid #ccc'
                    }}
                  />
                )}
                <span style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1rem', color: '#5a273b' }}>
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default SearchProducts;
