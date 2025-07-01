import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CircleDayView from './CircleDayView';
import './ProductCalendar.css';
import { auth } from '../firebase/firebase';
import Navbar from './Navbar';

const localizer = momentLocalizer(moment);

const ProductSchedulingForm = ({ products, onSchedule }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSchedule = () => {
    if (selectedProduct && scheduledTime) {
      const data = {
        productId: selectedProduct,
        usageTime: scheduledTime,
        notes,
      };
      onSchedule(data);
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h3>Schedule Your Product</h3>

      <label>Select Product</label>
      <select
        onChange={(e) => setSelectedProduct(e.target.value)}
        style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%' }}
      >
        <option value="">-- Choose a product --</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>

      <label>Schedule Time</label>
      <input
        type="datetime-local"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
        style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%' }}
      />

      <label>Notes (optional)</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%', height: '80px' }}
      ></textarea>

      <button onClick={handleSchedule} style={{ padding: '0.5rem 1rem' }}>
        Schedule Product
      </button>
    </div>
  );
};

const ProductCalendar = () => {
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentView, setCurrentView] = useState('week');

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
      console.log('✅ Entry saved!');
      fetchEvents();
    } catch (err) {
      console.error('❌ Save error:', err.message);
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
      console.log('🗑️ Entry deleted!');
      fetchEvents();
    } catch (err) {
      console.error('❌ Delete error:', err.message);
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
      console.error('❌ Fetch error:', err.message);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetch('http://localhost:5050/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Failed to fetch products:', err));
  }, []);

  return (
    <div style={{ backgroundColor: '#f0ede5', minHeight: '100vh', paddingBottom: '100px' }}>
      <Navbar />
      <div className="product-calendar">
        <h2>🗓️ Product Schedule</h2>

        <ProductSchedulingForm
          products={products}
          onSchedule={saveCalendarEntry}
        />

        {currentView === 'day' ? (
          <CircleDayView events={events} userId={auth.currentUser?.uid} />
        ) : (
          <div className="calendar-wrapper">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={currentView}
              onView={setCurrentView}
              views={['week', 'day']}
              style={{ height: 500 }}
              components={{
                event: ({ event }) => (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{event.title}</span>
                    <button
                      onClick={() => deleteCalendarEntry(event.id)}
                      style={{ background: 'none', border: 'none', color: '#b00', cursor: 'pointer' }}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                )
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCalendar;
