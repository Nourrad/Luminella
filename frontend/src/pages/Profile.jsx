
// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import Navbar from './Navbar';
// import './Questionnaires.css';

// const skinTypeDescriptions = {
//   dry: "Skin produces less sebum than normal skin. As a result of the lack of sebum, dry skin lacks the lipids that it needs to retain moisture and build a protective shield against external influences. Dry skin can feel tight, brittle, rough and look dull, skin elasticity is also low.",
//   normal: "Well-balanced skin, neither too oily nor too dry. The T-zone (forehead, chin and nose) may be a slightly oilier, but overall sebum and moisture are balanced. Normal skin still has pores (pores, peach fuzz, texture, sebaceous filaments - they are all part of ANY skin and are normal<3), good blood circulation, a velvety, soft texture, no blemishes (though pretty much everyone experience comedones from time to time) and is not prone to sensitivity.",
//   combo: "As the name suggests, skin that consists of a mix of skin types. Skin types vary between the T-zone and the cheeks on combination skin. Usually, it's an oilier T-zone (forehead, chin and nose) with slightly more visible pores in this area (perhaps with some comedones) and normal or drier cheeks. This is one of the most common skin types.",
//   oily: "Oilier skin has heightened sebum production, which can be due to genetics, hormonal changes, medication, stress or improper skincare. Oily skin has a glossy shine and a bit more visible pores - which again, is totally normal and NOT a flaw. Oily skin is more prone to comedones, but that's not a rule, just something to keep in mind when creating a routine."
// };

// const possibleConcerns = [
//   'Pimples', 'Enlarged pores', 'Redness', 'Dullness',
//   'Texture', 'Uneven tone', 'Dark circles', 'Dryness', 'Oiliness'
// ];


import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Questionnaires.css';
import { auth, db } from '../firebase/firebase';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, getDoc, getDocs, updateDoc, deleteDoc, collection, setDoc, serverTimestamp } from 'firebase/firestore';
// import { setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';






function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const normalizeConcern = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  const [products, setProducts] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showSkinTypeModal, setShowSkinTypeModal] = useState(false);
  const [showConcernsModal, setShowConcernsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteReason, setShowDeleteReason] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || ' Your Name ');
  const [profilePreview, setProfilePreview] = useState(localStorage.getItem('profileImageURL') || null);
  const [skinType, setSkinType] = useState(localStorage.getItem('skinType') || 'unknown');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [skinTypeProducts, setSkinTypeProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);




  const [userConcerns, setUserConcerns] = useState(() => {
    const stored = localStorage.getItem('concerns');
    return stored ? JSON.parse(stored) : [];
  });
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || 'example@email.com');


  const userId = localStorage.getItem('userId');

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

  const fetchSkinTypeProducts = async (skinTypeToUse) => {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const matched = allProducts.filter(p =>
      p.suitableSkinTypes?.includes(skinTypeToUse.toLowerCase())
    );

    const limited = matched.slice(0, 10);
    setSkinTypeProducts(limited);
  } catch (err) {
    console.error('Error fetching products by skin type:', err);
  }
};

const handleAddToShelf = async () => {
  if (!userId || !selectedProduct) return;

  try {
    const shelfRef = doc(db, 'users', userId, 'shelf', selectedProduct.id);
    await setDoc(shelfRef, {
      productId: selectedProduct.id,
      productName: selectedProduct.productName,
      image_url: selectedProduct.image_url,
      category: selectedProduct.category,
      suitableSkinTypes: selectedProduct.suitableSkinTypes,
      usageTime: selectedProduct.usageTime,
      frequencyPerWeek: selectedProduct.frequencyPerWeek,
      addedAt: serverTimestamp()
    });

    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    setShowProductModal(false);
  } catch (err) {
    console.error('Error adding to shelf:', err);
  }
};



  useEffect(() => {

    const fetchUserProfileAndProducts = async () => {
      if (!userId){
        setLoading(false); // <== prevent infinite loading
        return;
      }
      try {
        const userDocRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          const concernsFromDB = data.concerns || [];

          setUserName(data.userName || 'Your Name');
          setProfilePreview(data.profileImageURL || null);
          setSkinType(data.skinType || 'unknown');
          await fetchSkinTypeProducts(data.skinType || 'unknown');
          setUserConcerns(concernsFromDB);
          setUserEmail(data.userEmail || 'example@email.com');


          localStorage.setItem('userName', data.userName || 'Your Name');
          localStorage.setItem('profileImageURL', data.profileImageURL || '');
          localStorage.setItem('skinType', data.skinType || 'unknown');
          localStorage.setItem('concerns', JSON.stringify(concernsFromDB));
          localStorage.setItem('userEmail', data.userEmail || '');

          //Correct filtering based on "possibleConcerns"
          const productsRef = collection(db, 'products');
          const snapshot = await getDocs(productsRef);
          const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          console.log("🧪 Normalized User Concerns:", concernsFromDB.map(normalizeConcern)); //zzz
          allProducts.forEach(p => {
            console.log(`📦 ${p.productName}:`, p.possibleConcerns);

          });
          const normalizedConcerns = concernsFromDB.map(normalizeConcern);
          const filtered = allProducts.filter(product =>
            product.possibleConcerns?.some(concern =>
              normalizedConcerns.includes(concern)
            )
          );
          setProducts(filtered);
        }
        } catch (err) {
          console.error('Error fetching profile or products:', err);
          } finally {
            setLoading(false);
          }
        };

        fetchUserProfileAndProducts();
        }, [userId]);
  

if (loading) {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      color: '#5a273b',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'cursive', 
      fontWeight: 'bold',
      backgroundColor: '#f0ede5',
      cursor: 'pointer',
      padding: 0,
      fontSize: '2rem'
    }}>
      <p>Loading Profile...</p>
    </div>
  );
}

    
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const base64String = reader.result;
    setProfilePreview(base64String);
    localStorage.setItem('profileImageURL', base64String);

    if (userId) {
      const userDocRef = doc(db, 'users', userId);
      updateDoc(userDocRef, { profileImageURL: base64String }).catch(console.error);
    }
  };

  reader.readAsDataURL(file);
};

      // const previewUrl = URL.createObjectURL(file);
      // setProfileImage(file);
      // setProfilePreview(previewUrl);
      // localStorage.setItem('profileImageURL', previewUrl);


      // save to Firestore
      // if (userId) {
      //   try {
      //     const userDocRef = doc(db, 'users', userId);
      //     await updateDoc(userDocRef, { profileImageURL: previewUrl });
      //     localStorage.setItem('profileImageURL', previewUrl); 
      //   } catch (err) {
      //     console.error('Error saving profile image:', err);
      //     }

    const handleFinalDelete = async () => {
      setDeleteError('')
      const user = auth.currentUser;
      if (!user || !passwordInput) {
        setDeleteError('Password is required.');
        return;
      }
      const credential = EmailAuthProvider.credential(user.email, passwordInput);
      try {
        await reauthenticateWithCredential(user, credential);
        await deleteDoc(doc(db, 'users', user.uid)); // Remove user data from Firestore
        await deleteUser(user); // Delete from Firebase Auth

        localStorage.clear();
        navigate('/'); // Redirect after deletion
        } catch (err) {
          console.error('Delete error:', err);
          setDeleteError('Wrong password. Please try again.');
        }
      };

const toggleConcern = async (concern) => {
  const updated = userConcerns.includes(concern)
    ? userConcerns.filter(c => c !== concern)
    : [...userConcerns, concern];

  const normalizedConcerns = updated.map(normalizeConcern);
  setUserConcerns(normalizedConcerns);
  localStorage.setItem('concerns', JSON.stringify(normalizedConcerns));

  if (userId) {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { concerns: normalizedConcerns });

      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filtered = allProducts.filter(product =>
        product.possibleConcerns?.some(concern =>
          normalizedConcerns.includes(concern)
        )
      );

      setProducts(filtered);
    } catch (err) {
      console.error('Failed to update concerns or fetch products:', err);
    }
  }
};
      
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0ede5', fontFamily: 'sans-Segoe UI, sans-serif' }}>
      <Navbar />

      {/* Left Side Summary */}
      <div style={{ flex: 1, padding: '2rem', paddingBottom: '10rem', overflowY: 'auto' }}>

<div style={{ 
  backgroundColor: '#f0ede5',
  width: '100%',
  padding: '2rem 0',
  display: 'flex',
  alignItems: 'center',
  gap: '2rem',
  color: '#5a273b'
}}>
  <div
    style={{
      width: '160px',
      height: '160px',
      borderRadius: '12px',
      border: '5px solid #7e5e63',
      overflow: 'hidden',
      cursor: 'pointer',
      flexShrink: 0
    }}
    onClick={() => setShowImageModal(true)}
  >
    <img
      src={profilePreview || '/default-avatar.png'}
      alt="Profile"
      style={{
        width: '160px',
        height: '160px',
        objectFit: 'cover',
        borderRadius: '0',
        cursor: 'pointer'
      }}
    />
  </div>

  {editingName ? (
    <div style={{ flexGrow: 1 }}>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        style={{ padding: '0.5rem', fontSize: '1.5rem', fontFamily: 'Caveat, cursive' }}
      />
      <button
        onClick={async () => {
          setEditingName(false);
          if (userId) {
            try {
              await updateDoc(doc(db, 'users', userId), {
                userName: userName.trim()
              });
              setUserName(userName.trim());
              localStorage.setItem('userName', userName.trim());
            } catch (err) {
              console.error('Error updating name:', err);
            }
          }
        }}
        style={editBtnStyle}
      >
        Save
      </button>
    </div>
  ) : (
    <h2 style={{
      fontFamily: 'Caveat, cursive',
      fontSize: '2.2rem',
      margin: 0
    }}>
      {userName}
    </h2>
  )}
</div>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 'normal' }}>
          Your skin type is: <strong style={{ textTransform: 'capitalize' }}>{skinType}</strong>
          </h3>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.5' }}>
        <strong>{skinTypeDescriptions[skinType]}</strong>
        </p>
        <h3 style={{ marginTop: '2rem', fontSize: '1.3rem', fontWeight: 'normal' }}>Your skin concerns:</h3>
        <ul style={{ fontSize: '1.2rem', paddingLeft: '1.2rem' }}>
          {userConcerns.map(c => <li key={c}><strong>{c}</strong></li>)}
          </ul>

        <h3 style={{ marginTop: '2rem', fontSize: '1.2rem', fontWeight: 'normal' }}>
          Top recommended products for your skin:
          </h3>
        <div style={{ backgroundColor: '#f0ede5', borderRadius: '12px', padding: '1rem', overflowX: 'auto',
        whiteSpace: 'nowrap', border: '2px solid #f0ede5', marginTop: '1rem', display: 'flex', gap: '1rem'
         }}>
          {skinTypeProducts.length > 0 ? (
            skinTypeProducts.map(p => (
              <button
              key={p.id}
              className="product-button"
              onClick={() => {
                setSelectedProduct(p);
                setShowProductModal(true);
              }}
                
              style={{
                display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '220px', height: '260px',
                borderRadius: '16px', border: '2px solid #5a273b', backgroundColor: '#fff', overflow: 'hidden', cursor: 'pointer', flexShrink: 0
              }}>
                {p.image_url && (
                  <img
                  src={`/images/${p.image_url}`}
                  alt={p.productName}
                  style={{
                    height: '160px', width: '100%', objectFit: 'cover', borderBottom: '1px solid #ccc'
                  }}
                  />
                )}
                <span style={{ padding: '0.8rem', fontWeight: 'bold', fontSize: '1rem', color: '#5a273b', textAlign: 'center', overflowWrap: 'break-word',
                  wordWrap: 'break-word', whiteSpace: 'normal', lineHeight: '1.2', maxHeight: '3.6em', overflow: 'hidden'

                 }}>
                  {p.productName}
                  </span>    
                </button>
                ))
              ) : (
              <p style={{ fontStyle: 'italic', padding: '1rem' }}>No products found for your skin type.</p>
            )}
            </div>
            </div>

      {/* Right Panel with Scrollable Content */}
      <div style={{
        width: '400px',
        backgroundColor: '#7e5e63', 
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid #f0ede5',
        height: '100vh'
      }}>
        <div style={{ padding: '1rem', overflowY: 'auto' }}>
          <h3 style={{ fontWeight: 'bold' }}>Your Account Information</h3>
          <p><strong>Email:</strong><br />{userEmail}</p>

          <p style={{ marginTop: '1rem' }}>
            <strong>Password:</strong><br />
            <button onClick={() => setShowResetModal(true)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}>
              Change password &gt;
            </button>
          </p>

          <button onClick={() => setEditingName(true)} style={editBtnStyle}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#5a273b';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = '#f0ede5';
              e.currentTarget.style.color = 'black';
            }}
            >Edit Name</button>

          <button onClick={() => document.getElementById('profile-upload').click()}style={editBtnStyle}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = '#5a273b';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = '#f0ede5';
            e.currentTarget.style.color = 'black';
          }}
          >Upload Profile Picture</button>
          <input id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />

          <button onClick={() => setShowSkinTypeModal(true)} style={editBtnStyle}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = '#5a273b';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = '#f0ede5';
            e.currentTarget.style.color = 'black';
          }}
          >Edit Skin Type</button>

          <button onClick={() => setShowConcernsModal(true)} style={editBtnStyle}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = '#5a273b';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = '#f0ede5';
            e.currentTarget.style.color = 'black';
          }}
          >Edit Skin Concerns</button>

          <button 
          className="delete-account-button"
          onClick={() => setShowDeleteConfirm(true)} 
          style={{ ...dangerBtnStyle, marginTop: '1rem' }}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = 'darkred';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = '#7e5e63';
            e.currentTarget.style.color = 'white';
          }}
          >Delete Your Data and Account</button>


          <button onClick={() => setShowLogoutConfirm(true)} style={{ ...dangerBtnStyle, marginTop: '1rem' }}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = '#5a273b';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = '#7e5e63';
            e.currentTarget.style.color = 'white';
          }}
          
          >Log Out</button>
        </div>
      </div>

      {/* MODALS */}
      {showProductModal && selectedProduct && (
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
        onClick={() => setShowProductModal(false)}
        className="close-button"
        style={{
          position: 'absolute', top: '10px', right: '15px', background: 'none',
          border: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer'
        }}
      >✖️</button>
      <img
        src={`/images/${selectedProduct.image_url}`}
        alt={selectedProduct.productName}
        style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
      />
      <div style={{ flex: 1 }}>
        <h2 style={{ fontFamily: 'Segoe UI, sans-serif', fontSize: '1.4rem', color: '#5a273b' }}>
          {selectedProduct.productName}
        </h2>
        <p style={{ marginTop: '1rem', fontSize: '1rem' }}>
          <strong>Suitable Skin Types:</strong>{' '}
          {selectedProduct.suitableSkinTypes?.join(', ') || 'Not specified'}
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
          {selectedProduct.description}
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
          <strong>Usage time:</strong>{' '}
          {Array.isArray(selectedProduct.usageTime)
            ? selectedProduct.usageTime.join(', ')
            : selectedProduct.usageTime || 'Not specified'}
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
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
      e.currentTarget.style.backgroundColor = '#5a273b';
      e.currentTarget.style.color = '#fff';
    }}
    onMouseOut={e => {
      e.currentTarget.style.backgroundColor = '#fff';
      e.currentTarget.style.color = '#5a273b';
    }}
  >
    Add to Shelf
  </button>

  {/* Close and Add to Fav on the right */}
  <div style={{ display: 'flex', gap: '1rem' }}>
    <button
      onClick={() => setShowProductModal(false)}
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
      style={{
        padding: '0.7rem 1.5rem',
        backgroundColor: '#5a273b',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
      // Add your "Add to Fav" logic here later
    >
      Add to List
    </button>
  </div>
</div>

      </div>
    </div>
  </div>
)}

      {showResetModal && (
        <Modal title="Reset Password" onClose={() => setShowResetModal(false)}>
          <p>You’ll be redirected to the reset page.</p>
          <button onClick={() => navigate('/login')} style={{ marginTop: '1rem' }}>Go to Reset</button>
        </Modal>
      )}
      {showImageModal && (
        <Modal title="Profile Picture" onClose={() => setShowImageModal(false)}>
          <img src={profilePreview || '/default-avatar.png'} alt="Preview" style={{ width: '100%' }} />
        </Modal>
      )}
      {showSkinTypeModal && (
        <Modal title="Select Your Skin Type" onClose={() => setShowSkinTypeModal(false)} bg="#f0ede5">
          <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {Object.entries(skinTypeDescriptions).map(([type, desc]) => {
              const isSelected = type === skinType;


              return (
                <button
                  key={type}
                  onClick={async () => {
                    setSkinType(type); // update local state
                    if (userId) {
                      try {
                        await updateDoc(doc(db, 'users', userId), {
                          skinType: type
                        });
                        localStorage.setItem('skinType', type);
                        await fetchSkinTypeProducts(type); // 🔥 re-fetch updated recommendations
                        } catch (err) {
                          console.error('Failed to save skin type:', err);
                        }}
                        setShowSkinTypeModal(false);
                      }}
                  style={{
                    backgroundColor: isSelected ? '#5a273b' : '#7e5e63',
                    color: '#eee',
                    border: '2px solid #5a273b',
                    textAlign: 'left',
                    fontFamily: 'sans-serif',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '12px',
                    width: '100%',
                    transition: 'background-color 0.2s ease',
                    userSelect: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseOver={e => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#5a273b';
                  }}
                  onMouseOut={e => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#7e5e63';
                  }}
                >
                  <strong>{type.charAt(0).toUpperCase() + type.slice(1)}</strong><br />
                  <span style={{ fontSize: '0.9rem', userSelect: 'none' }}>{desc}</span>
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {showSuccessMessage && (
  <div style={{
    position: 'fixed',
    top: '2rem',
    left: '50%',
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

      {showConcernsModal && (
        <Modal title="Edit Skin Concerns" onClose={() => setShowConcernsModal(false)}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {possibleConcerns.map((concern) => {
              const isSelected = userConcerns.includes(concern);
              return (
                
                <button
                  key={concern}
                  onClick={() => toggleConcern(concern)}
                  style={{
                    flex: '1 1 45%',
                    padding: '10px',
                    backgroundColor: isSelected ? '#5a273b' : '#fff',
                    color: isSelected ? '#fff' : '#000',
                    border: isSelected ? '2px solid #5a273b' : '2px solid #ccc',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: '0.2s'
                  }}
                  onMouseOver={e => e.target.style.backgroundColor = isSelected ? '#5a273b' : '#7e5e63'}
                  onMouseOut={e => e.target.style.backgroundColor = isSelected ? '#5a273b' : '#fff'}
                >
                  {concern}
                </button>
              );
            })}
          </div>
        </Modal>
      )}
      {showDeleteConfirm && (
        <Modal title="Are you sure?" onClose={() => setShowDeleteConfirm(false)} bg="#f0ede5">
          <p>This will permanently delete your account. Are you sure?</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button onClick={() => setShowDeleteConfirm(false)} style={modalBtnStyle}>Cancel</button>
            <button onClick={() => { setShowDeleteConfirm(false); setShowDeleteReason(true); }} style={modalBtnStyle}>Delete Account</button>
            </div>
            </Modal>
          )}
          {showDeleteReason && (
            <Modal title="Tell us why you're leaving" onClose={() => setShowDeleteReason(false)} bg="#f0ede5">
              <p>Please select a reason and confirm your password:</p>
              <select value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} 
              style={{
                width: '100%', fontFamily: 'sans-serif', border: '1px solid #ccc',
                padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px'
              }}>
                <option value="">Select a reason</option>
                <option>No longer using the service</option>
                <option>Too much notifications or emails</option>
                <option>Privacy concerns</option>
                <option>Bad experience</option>
                <option>No longer interested in Skincare</option>
                </select>
                
                <input
                type="password"
                placeholder="Confirm your password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{
                  width: '94%', fontFamily: 'sans-serif', border: '1px solid #ccc',
                  padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px'
                }}
                />
                
                {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <button onClick={() => setShowDeleteReason(false)} style={modalBtnStyle}>Cancel</button>
                  <button onClick={handleFinalDelete} style={modalBtnStyle}>Confirm Delete</button>
                  </div>
                  </Modal>
                )}
                {showLogoutConfirm && (
                  <Modal title="Are you sure you want to log out?" onClose={() => setShowLogoutConfirm(false)} bg="#f0ede5">
                    <p>This will log you out of your session.</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                      <button onClick={() => setShowLogoutConfirm(false)} style={modalBtnStyle}>Stay in browser</button>
                      <button onClick={() => {
                        localStorage.clear();
                        navigate('/login');
                      }}
                      style={modalBtnStyle}
                      >Log Out</button>
                    </div>
                  </Modal>
                )}
          </div>
          );
        }

const Modal = ({ title, onClose, children, bg = '#f0ede5' }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 999, fontFamily: 'sans-serif'
  }}>
    <div style={{
      background: bg, padding: '2rem', borderRadius: '12px',
      width: '400px', maxHeight: '90vh', overflowY: 'auto', position: 'relative'
    }}>
      <button
        onClick={onClose}
        className="close-button"
        style={{
          position: 'absolute',
          top: '10px',
          right: '15px',
          background: 'none',
          border: 'none',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#000',
          cursor: 'pointer'
        }}
        aria-label="Close"
      >
        ✖️
      </button>
      <h3>{title}</h3>
      {children}
    </div>
  </div>
);

// ========== Reusable Styles ===========
const editBtnStyle = {
  width: '100%',
  padding: '0.8rem',
  marginTop: '1rem',
  backgroundColor: '#5a273b',
  color: '#fff',
  border: '1px solid #fff',
  borderRadius: '6px',
  cursor: 'pointer',
  fontFamily: 'sans-serif',
  transition: 'background-color 0.3s ease'

};

const dangerBtnStyle = {
  ...editBtnStyle,
  backgroundColor: '#7e5e63',
  border: '1px solid #fff',
  borderRadius: '6px',
  color: '#fff',
};

const inactiveBtnStyle = {
  ...editBtnStyle,
  backgroundColor: '#f0ede5',
  color: '#000',
  border: 'none'
};

const modalBtnStyle = {
  backgroundColor: '#5a273b',
  color: 'white',
  padding: '0.6rem 1.2rem',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontFamily: 'sans-serif'
};

export default Profile;

