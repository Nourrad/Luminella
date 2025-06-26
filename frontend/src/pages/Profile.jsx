import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';


function Profile() {
  const location = useLocation();
  const skinType = location.state?.skinType || 'unknown';
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});

  const userId = localStorage.getItem('userId'); // Optional: If you store userId in localStorage after login

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`/api/products/${skinType}`);
      const data = await res.json();
      setProducts(data);
    };

    if (skinType !== 'unknown') fetchProducts();
  }, [skinType]);

  const toggleProduct = (productId, usage_time) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: usage_time
    }));
  };

  const handleSubmit = async () => {
    for (const [productId, usage_time] of Object.entries(selectedProducts)) {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, usage_time }),
      });
    }

    alert("Schedule saved!");
  };

  return (
    <div>
      <h2>Welcome to your profile!</h2>
      <p>Your skin type is: <strong>{skinType}</strong></p>

      <h3>Recommended Products:</h3>
      {products.map((p) => (
        <div key={p.id} style={{ marginBottom: '1rem' }}>
          <p><strong>{p.name}</strong> ({p.type})</p>
          <img src={`/images/${p.image_url}`} alt={p.name} width="100" />

          <select onChange={(e) => toggleProduct(p.id, e.target.value)}>
            <option value="">Choose usage time</option>
            <option value="morning">Morning</option>
            <option value="night">Night</option>
          </select>
        </div>
      ))}

      <button onClick={handleSubmit}>Save Schedule</button>
    </div>
  );
}

export default Profile;
