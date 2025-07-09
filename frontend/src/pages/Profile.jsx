// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import Navbar from './Navbar';
// import './Questionnaires.css';

// function Profile() {
//   const location = useLocation();
//   const skinType = location.state?.skinType || 'unknown';
//   const [products, setProducts] = useState([]);
//   const [selectedProducts, setSelectedProducts] = useState({});

//   const userId = localStorage.getItem('userId');

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const res = await fetch(`/api/products/${skinType}`);
//       const data = await res.json();
//       setProducts(data);
//     };

//     if (skinType !== 'unknown') fetchProducts();
//   }, [skinType]);

//   const toggleProduct = (productId, usage_time) => {
//     setSelectedProducts(prev => ({
//       ...prev,
//       [productId]: usage_time
//     }));
//   };

//   const handleSubmit = async () => {
//     for (const [productId, usage_time] of Object.entries(selectedProducts)) {
//       await fetch('/api/schedule', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, productId, usage_time }),
//       });
//     }

//     alert("Schedule saved!");
//   };

//   return (
//     <div className="questionnaire" style={{ backgroundColor: '#f0ede5', minHeight: '100vh' }}>
//       <Navbar />
//       <div className="questionnaire-inner">
//         <h2 className="questionnaire-title">👤 Your Profile</h2>
//         <p>Your skin type is: <strong>{skinType}</strong></p>

//         <h3 style={{ marginTop: '2rem' }}>Recommended Products:</h3>
//         {products.map((p) => (
//           <div key={p.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
//             <p><strong>{p.name}</strong> ({p.type})</p>
//             <img src={`/images/${p.image_url}`} alt={p.name} width="100" style={{ borderRadius: '8px' }} />

//             <select onChange={(e) => toggleProduct(p.id, e.target.value)} className="input-field" style={{ marginTop: '0.5rem' }}>
//               <option value="">Choose usage time</option>
//               <option value="morning">Morning</option>
//               <option value="night">Night</option>
//             </select>
//           </div>
//         ))}

//         <button onClick={handleSubmit}>Save Schedule</button>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import './Questionnaires.css';

const skinTypeDescriptions = {
  dry: "Skin produces less sebum than normal skin. As a result of the lack of sebum, dry skin lacks the lipids that it needs to retain moisture and build a protective shield against external influences. Dry skin can feel tight, brittle, rough and look dull, skin elasticity is also low.",
  normal: "Well-balanced skin, neither too oily nor too dry. The T-zone (forehead, chin and nose) may be a slightly oilier, but overall sebum and moisture are balanced. Normal skin still has pores (pores, peach fuzz, texture, sebaceous filaments - they are all part of ANY skin and are normal<3), good blood circulation, a velvety, soft texture, no blemishes (though pretty much everyone experience comedones from time to time) and is not prone to sensitivity.",
  combo: "As the name suggests, skin that consists of a mix of skin types. Skin types vary between the T-zone and the cheeks on combination skin. Usually, it's an oilier T-zone (forehead, chin and nose) with slightly more visible pores in this area (perhaps with some comedones) and normal or drier cheeks. This is one of the most common skin types.",
  oily: "Oilier skin has heightened sebum production, which can be due to genetics, hormonal changes, medication, stress or improper skincare. Oily skin has a glossy shine and a bit more visible pores - which again, is totally normal and NOT a flaw. Oily skin is more prone to comedones, but that's not a rule, just something to keep in mind when creating a routine."
};

const possibleConcerns = [
  'Pimples', 'Enlarged pores', 'Redness', 'Dullness',
  'Texture', 'Uneven tone', 'Dark circles', 'Dryness', 'Oiliness'
];

function Profile() {
  const location = useLocation();
  const skinType = location.state?.skinType || 'unknown';
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [userConcerns, setUserConcerns] = useState(location.state?.concerns || []);
  const [userName, setUserName] = useState('Your Name');
  const [editingName, setEditingName] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const userId = localStorage.getItem('userId');

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

  const toggleConcern = (concern) => {
    setUserConcerns(prev =>
      prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    for (const [productId, usage_time] of Object.entries(selectedProducts)) {
      await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, usage_time }),
      });
    }

    // Save concerns
    await fetch(`/api/auth/${userId}/concerns`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concerns: userConcerns })
    });

    // Save updated name (optional enhancement)
    await fetch(`/api/auth/${userId}/name`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName })
    });

    alert("Schedule and profile saved!");
  };

  return (
    <div className="questionnaire" style={{ backgroundColor: '#f0ede5', minHeight: '100vh' }}>
      <Navbar />
      <div className="questionnaire-inner">

        {/* Profile Picture + Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <label htmlFor="upload-image">
            <img
              src={profilePreview || '/default-avatar.png'}
              alt="Profile"
              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
            />
          </label>
          <input id="upload-image" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />

          {editingName ? (
            <>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{ fontSize: '1.2rem' }}
              />
              <button onClick={() => setEditingName(false)}>Save</button>
            </>
          ) : (
            <>
              <h2 className="questionnaire-title" style={{ marginBottom: 0 }}>{userName}'s Profile</h2>
              <button onClick={() => setEditingName(true)}>✏️</button>
            </>
          )}
        </div>

        {/* Skin type summary */}
        <h3>Your skin type is: <span style={{ textTransform: 'capitalize' }}>{skinType}</span></h3>
        <p className="skin-type-description">{skinTypeDescriptions[skinType]}</p>

        {/* Concerns */}
        <div style={{ marginTop: '2rem' }}>
          <h3>Your skin concerns:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {possibleConcerns.map((concern) => (
              <label key={concern} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={userConcerns.includes(concern)}
                  onChange={() => toggleConcern(concern)}
                  style={{ marginRight: '0.5rem' }}
                />
                {concern}
              </label>
            ))}
          </div>
        </div>

        {/* Products */}
        <h3 style={{ marginTop: '2rem' }}>Recommended Products:</h3>
        {products.map((p) => (
          <div key={p.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <p><strong>{p.name}</strong> ({p.type})</p>
            <img src={`/images/${p.image_url}`} alt={p.name} width="100" style={{ borderRadius: '8px' }} />

            <select onChange={(e) => toggleProduct(p.id, e.target.value)} className="input-field" style={{ marginTop: '0.5rem' }}>
              <option value="">Choose usage time</option>
              <option value="morning">Morning</option>
              <option value="night">Night</option>
            </select>
          </div>
        ))}

        <button onClick={handleSubmit}>Save Schedule</button>
      </div>
    </div>
  );
}

export default Profile;
