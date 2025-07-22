import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './ProductCalendar.css';
import { auth, db } from '../firebase/firebase';
import Navbar from './Navbar';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';



const localizer = momentLocalizer(moment);


const ProductSchedulingForm = ({ products, onSchedule, setSelectedProductDetails, scheduledProductIds }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  



  const handleSchedule = () => {
    if (selectedProduct && scheduledTime) {
      const data = {
        productId: selectedProduct,
        usageTime: scheduledTime,
        notes,
      };
      onSchedule(data);
      setSelectedProduct('');
      setScheduledTime('');
      setNotes('');
    }
  };

  return (
    <div style={{
      marginTop: '1rem',
      width: '80%',
      padding: '0 2rem',
      marginLeft: 'auto',
      marginRight: 'auto'

    }}>
      <h2 style={{ textAlign: 'center', color: '#5a273b', fontFamily:'cursive', fontSize: '2.5rem', fontWeight: 'bold' }}> Schedule your products 🧴</h2>

<h3 style={{ color: '#5a273b', marginTop: '2rem' }}>Schedule from Your Shelf</h3>
<div style={{
  display: 'flex',
  overflowX: 'auto',
  gap: '1rem',
  padding: '1rem 0',
  whiteSpace: 'nowrap'
}}>
  {products.map((product) => (
    <button
      key={product.id}
      className="calendar-product-button"
      onClick={() => setSelectedProductDetails(product)}
      onMouseEnter={() => setHoveredProduct(product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
style={{
  display: 'inline-flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '220px',
  height: '260px',
  borderRadius: '16px',
  border: selectedProduct === product.id
    ? '3px solid #5a273b'
    : '2px solid #5a273b',
  backgroundColor: hoveredProduct === product.id ? 'transparent' : '#fff',
  overflow: 'hidden',
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background-color 0.2s ease',
  opacity: scheduledProductIds.includes(product.id) ? 0.5 : 1, // 👈 HERE
}}
>
  {product.image_url && (
    <img
      src={`/images/${product.image_url}`}
      alt={product.productName}
      style={{
        height: '160px',
        width: '100%',
        objectFit: 'cover',
        borderBottom: '1px solid #ccc'
      }}
    />
  )}
  <span
    style={{
      padding: '0.8rem',
      fontWeight: 'bold',
      fontSize: '1rem',
      color: '#5a273b',
      textAlign: 'center',
      overflowWrap: 'break-word',
      whiteSpace: 'normal',
      lineHeight: '1.2',
      maxHeight: '3.6em',
      overflow: 'hidden'
    }}
  >
    {product.productName}
  </span>
</button>
  ))}
</div>

      {/* <label style={{ fontWeight: 'bold', display: 'block', marginTop: '1rem', color: '#5a273b' }}>Schedule Time</label>
      <input
        type="datetime-local"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
        style={{
          padding: '0.7rem',
          borderRadius: '10px',
          border: '2px solid #5a273b',
          width: '100%',
          marginTop: '0.5rem'
        }}
      /> */}

      {/* <label style={{ fontWeight: 'bold', display: 'block', marginTop: '1rem', color: '#5a273b' }}>Notes (optional)</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{
          padding: '0.7rem',
          borderRadius: '10px',
          border: '2px solid #5a273b',
          width: '100%',
          height: '80px',
          marginTop: '0.5rem'
        }}
      /> */}

      {/* <button onClick={handleSchedule} style={{
        marginTop: '1.5rem',
        padding: '0.8rem 1.5rem',
        backgroundColor: '#5a273b',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%'
      }}>
        Add to Calendar
      </button> */}
    </div>
  );
};

const ProductCalendar = () => {
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentView, setCurrentView] = useState('week');
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [scheduledProductIds, setScheduledProductIds] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');




  const saveCalendarEntry = async ({ productId, usageTime, notes }) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');
      const token = await user.getIdToken();

      const response = await fetch('http://localhost:5050/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, usageTime, notes }),
      });

      if (!response.ok) throw new Error('Failed to save entry');
      fetchEvents();
    } catch (err) {
      console.error('Save error:', err.message);
    }
  };


  const deleteCalendarEntry = async (entryId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch(`http://localhost:5050/api/calendar/${entryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Delete failed');
      fetchEvents();
    } catch (err) {
      console.error(' Delete error:', err.message);
    }
  };

  const handleRemoveFromShelf = async () => {
  const user = auth.currentUser;
  if (!user || !selectedProductDetails) return;

  try {
    await deleteDoc(doc(db, 'users', user.uid, 'shelf', selectedProductDetails.id));
    setProducts(prev => prev.filter(p => p.id !== selectedProductDetails.id));
    setSelectedProductDetails(null);
    setShowRemoveConfirm(false);
  } catch (err) {
    console.error('Error removing from shelf:', err);
  }
};

const handleAutoSchedule = async () => {
  const user = auth.currentUser;
  if (!user || !selectedProductDetails || !selectedProductDetails.usageTime || !selectedProductDetails.frequencyPerWeek) return;

  const product = selectedProductDetails;
  const userId = user.uid;
  const frequency = product.frequencyPerWeek.toLowerCase();
  const usageTime = Array.isArray(product.usageTime) ? product.usageTime : [product.usageTime];
  const now = new Date();
  let daysToSchedule = [];

  if (frequency.includes('every day')) {
    daysToSchedule = [...Array(7)].map((_, i) => i);
  } else {
    const count = Math.floor(Math.random() * 3) + 3;
    const pool = [...Array(7)].map((_, i) => i);
    while (daysToSchedule.length < count) {
      const rand = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      daysToSchedule.push(rand);
    }
  }

  const createDatetime = (baseDate, timeLabel) => {
    const date = new Date(baseDate);
    if (timeLabel.toLowerCase().includes('morning')) {
      date.setHours(9 + Math.floor(Math.random() * 2));
    } else {
      date.setHours(21 + Math.floor(Math.random() * 2));
    }
    date.setMinutes(0, 0, 0);
    return date;
  };

  const scheduledTimestamps = [];

  for (let i = 0; i < daysToSchedule.length; i++) {
    const offset = daysToSchedule[i];
    const scheduledDate = new Date();
    scheduledDate.setDate(now.getDate() + offset);
    const label = usageTime[i % usageTime.length];
    const dateTime = createDatetime(scheduledDate, label);
    const iso = dateTime.toISOString();

    scheduledTimestamps.push(iso);

    await saveCalendarEntry({
      productId: product.id,
      usageTime: iso,
      notes: '[Auto] Scheduled by Luminella',
    });
  }

  // 🟡 Save product metadata to user's "schedule" collection
  try {
    await setDoc(
      doc(db, 'users', userId, 'schedule', product.id),
      {
        ...product,
        scheduledTimes: scheduledTimestamps,
        scheduledBy: 'auto',
        scheduledAt: new Date().toISOString(),
      }
    );
  } catch (err) {
    console.error('Error saving to schedule collection:', err);
  }

  await fetchEvents();
  await fetchScheduledProducts();
  setSuccessMessage('✅ [Auto] Scheduled by Luminella!');
  setTimeout(() => setSuccessMessage(''), 3000);
  setSelectedProductDetails(null);
};


const handleRemoveFromSchedule = async () => {
  const user = auth.currentUser;
  if (!user || !selectedProductDetails) return;

  const productId = selectedProductDetails.id;

  try {
    // 1. Remove from Firestore
    await deleteDoc(doc(db, 'users', user.uid, 'schedule', productId));

    // 2. Remove calendar entries via API
    const token = await user.getIdToken();
    const res = await fetch(`http://localhost:5050/api/schedule/${user.uid}/product/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to delete calendar entries');

    // 3. Refresh calendar and scheduled list BEFORE closing the modal
    await fetchEvents(); // Refresh calendar
    await fetchScheduledProducts(); // Refresh scheduledProductIds list

    // 4. Clear modal and show message
    setSelectedProductDetails(null);
    setSuccessMessage('🗑️ Cleared from schedule!');
    setTimeout(() => {
      setSuccessMessage('');
      setSelectedProductDetails(null); // close modal after message fades out
      }, 3000);
      
  await fetchEvents();
  await fetchScheduledProducts();
  setSuccessMessage('✅ [Auto] Scheduled by Luminella!');
  setTimeout(() => setSuccessMessage(''), 3000);
  setSelectedProductDetails(null);



  } catch (err) {
    console.error('Error removing scheduled product:', err.message);
  }
};


const fetchScheduledProducts = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const snapshot = await getDocs(collection(db, 'users', user.uid, 'schedule'));
    const scheduledIds = snapshot.docs.map(doc => doc.id);
    setScheduledProductIds(scheduledIds);
  } catch (err) {
    console.error('Error fetching scheduled products:', err);
  }
};




  const fetchEvents = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();

      const res = await fetch(`http://localhost:5050/api/schedule/${user.uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const formatted = data.map((item) => ({
        id: item.id,
        title: item.product_name,
        start: new Date(item.usage_time),
        end: new Date(new Date(item.usage_time).getTime() + 1800000),
        allDay: false,
      }));
      setEvents(formatted);
    } catch (err) {
      console.error(' Fetch error:', err.message);
    }
  };


const fetchProductsFromShelf = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const snapshot = await getDocs(collection(db, 'users', user.uid, 'shelf'));
    const shelfProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(shelfProducts);
  } catch (err) {
    console.error(' Error fetching shelf products:', err);
  }
};

useEffect(() => {
  fetchEvents();
  fetchProductsFromShelf(); // Use this instead
  fetchScheduledProducts();
}, []);


  return (
    <div style={{ padding: '4rem 4rem 9rem', backgroundColor: '#f0ede5', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', overflowY: 'auto' }}>
      <Navbar />
      {/* <h1 style={{ textAlign: 'center', fontSize: '2rem', color: "#5a273b" }}>🗓️ My Skincare Calendar</h1> */}

      <ProductSchedulingForm
        products={products}
        onSchedule={saveCalendarEntry}
        setSelectedProductDetails={setSelectedProductDetails}
        scheduledProductIds={scheduledProductIds}
      />

      <div style={{ marginTop: '3rem' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={currentView}
          onView={setCurrentView}
          views={['week', 'day']}
          style={{
            height: 500,
            borderRadius: '16px',
            padding: '1rem',
            backgroundColor: '#fff',
            border: '2px solid #5a273b'
          }}
          components={{
            event: ({ event }) => (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
                color: '#5a273b'
              }}>
                <span>{event.title}</span>
                <button
                  onClick={() => deleteCalendarEntry(event.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#b00',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            )
          }}
        />
      </div>
      {selectedProductDetails && (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 9999
  }}>
    <div style={{
      backgroundColor: '#f0ede5', padding: '2rem', borderRadius: '16px',
      width: '700px', position: 'relative', display: 'flex', gap: '1.5rem'
    }}>
      <button 
      className="product-close-button"
      onClick={() => setSelectedProductDetails(null)} style={{
        position: 'absolute', top: '10px', right: '15px',background: 'none',
        border: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', color: '#5a273b'
      }}>✖️</button>

      <img
        src={`/images/${selectedProductDetails.image_url}`}
        alt={selectedProductDetails.productName}
        style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
      />

      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '1.4rem', color: '#5a273b' }}>
          {selectedProductDetails.productName}
        </h2>
        <p><strong>Helps with:</strong> {selectedProductDetails.possibleConcerns?.join(', ')}</p>
        {selectedProductDetails.use && (
          <p><strong>How to Use:</strong> {selectedProductDetails.use || 'No usage instructions available.'}</p>
          )}
        <p><strong>Usage Time:</strong> {Array.isArray(selectedProductDetails.usageTime)
          ? selectedProductDetails.usageTime.join(', ')
          : selectedProductDetails.usageTime}</p>
        <p><strong>Frequency:</strong> {selectedProductDetails.frequencyPerWeek}</p>

<div style={{
  marginTop: '2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}}>
{/* Auto Schedule - Far Left */}
<div style={{ flex: 1 }}>
  {scheduledProductIds.includes(selectedProductDetails.id) ? (
  <button
    onClick={handleRemoveFromSchedule}
    style={{
      padding: '0.7rem 1.9rem',
      backgroundColor: '#fff',
      color: '#5a273b',
      border: '2px solid #5a273b',
      borderRadius: '6px',
      fontWeight: 'bold',
      cursor: 'pointer'
    }}
    onMouseEnter={e => {
      e.target.style.backgroundColor = '#5a273b';
      e.target.style.color = '#fff';
    }}
    onMouseLeave={e => {
      e.target.style.backgroundColor = '#fff';
      e.target.style.color = '#5a273b';
    }}
  >
    Clear from Schedule 🗑️
  </button>
) : (
  <button
    onClick={handleAutoSchedule}
    style={{
      padding: '0.7rem 1.9rem',
      backgroundColor: '#fff',
      color: '#5a273b',
      border: '2px solid #5a273b',
      borderRadius: '6px',
      fontWeight: 'bold',
      cursor: 'pointer'
    }}
    onMouseEnter={e => {
      e.target.style.backgroundColor = '#5a273b';
      e.target.style.color = '#fff';
    }}
    onMouseLeave={e => {
      e.target.style.backgroundColor = '#fff';
      e.target.style.color = '#5a273b';
    }}
  >
    Auto Schedule ✨
  </button>
)}
</div>


  {/* Right side: Cancel + Remove */}
  <div style={{ display: 'flex', gap: '1rem' }}>
    <button onClick={() => setSelectedProductDetails(null)} style={{
      padding: '0.7rem 1.5rem', backgroundColor: '#5a273b', color: '#fff',
      border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
    }}>
      Cancel
    </button>

    <button onClick={() => setShowRemoveConfirm(true)} style={{
      padding: '0.7rem 1.5rem', backgroundColor: '#5a273b', color: '#fff',
      border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'
    }}>
      Remove
    </button>
  </div>
</div>
      </div>
    </div>
  </div>
)}

{successMessage && (
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
    {successMessage}
  </div>
)}

{showRemoveConfirm && (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 99999
  }}>
    <div style={{
      backgroundColor: '#f0ede5', padding: '2rem', borderRadius: '16px',
      width: '400px', textAlign: 'center'
    }}>
      <h3 style={{ color: '#5a273b' }}>Are you sure you want to remove this product from your shelf?</h3>
<div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-around' }}>
  <button onClick={() => setShowRemoveConfirm(false)} style={{
    padding: '0.7rem 1.5rem', backgroundColor: '#fff', color: '#5a273b',
    border: '2px solid #5a273b', borderRadius: '6px', cursor: 'pointer'
  }}>Cancel</button>

  <button onClick={handleRemoveFromShelf} style={{
    padding: '0.7rem 1.5rem', backgroundColor: '#5a273b', color: '#fff',
    border: 'none', borderRadius: '6px', cursor: 'pointer'
  }}>Remove Product</button>
</div>
      
    </div>
  </div>
)}


    </div>
  );
};

export default ProductCalendar;
