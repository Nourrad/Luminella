// SearchProducts.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from '../pages/Footer';

function SearchProducts() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const containerStyle = {
    padding: '4rem',
    backgroundColor: '#f0ede5',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', sans-serif",
  };

  const headingStyle = {
    fontSize: '2rem',
    marginBottom: '1rem',
    textAlign: 'center',
  };

  const inputStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto 2rem',
    display: 'block',
  };

  const productStyle = {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
    maxWidth: '600px',
    margin: '1rem auto',
    textAlign: 'left',
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Dummy search logic
    const dummyResults = [
      { id: 1, name: 'Gentle Cleanser' },
      { id: 2, name: 'Hydrating Serum' },
    ];
    setResults(dummyResults.filter(p => p.name.toLowerCase().includes(value.toLowerCase())));
  };

  return (
    <div style={containerStyle}>
      <Navbar />
      <h1 style={headingStyle}>🔍 Search Skincare Products</h1>
      <input
        type="text"
        placeholder="Search for a product..."
        value={query}
        onChange={handleSearch}
        style={inputStyle}
      />
      <div>
        {results.map(product => (
          <div key={product.id} style={productStyle}>
            <strong>{product.name}</strong>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default SearchProducts;
