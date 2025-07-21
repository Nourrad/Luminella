import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './ProductCalendar.css';
import { auth, db } from '../firebase/firebase';
import Navbar from './Navbar';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';


const localizer = momentLocalizer(moment);


const ProductSchedulingForm = ({ products, onSchedule, setSelectedProductDetails }) => {
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
    border:
      selectedProduct === product.id
        ? '3px solid #5a273b'
        : '2px solid #5a273b',
    backgroundColor:
      hoveredProduct === product.id
        ? 'transparent'
        : '#fff',
    overflow: 'hidden',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background-color 0.2s ease'
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

      <label style={{ fontWeight: 'bold', display: 'block', marginTop: '1rem', color: '#5a273b' }}>Schedule Time</label>
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
      />

      <label style={{ fontWeight: 'bold', display: 'block', marginTop: '1rem', color: '#5a273b' }}>Notes (optional)</label>
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
      />

      <button onClick={handleSchedule} style={{
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
      </button>
    </div>
  );
};

const ProductCalendar = () => {
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentView, setCurrentView] = useState('week');
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);


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
}, []);


  return (
    <div style={{ padding: '4rem 4rem 9rem', backgroundColor: '#f0ede5', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', overflowY: 'auto' }}>
      <Navbar />
      {/* <h1 style={{ textAlign: 'center', fontSize: '2rem', color: "#5a273b" }}>🗓️ My Skincare Calendar</h1> */}

      <ProductSchedulingForm
        products={products}
        onSchedule={saveCalendarEntry}
        setSelectedProductDetails={setSelectedProductDetails}
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
  <button
    onClick={() => console.log('Auto schedule clicked')}
    style={{
      padding: '0.7rem 1.5rem',
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
