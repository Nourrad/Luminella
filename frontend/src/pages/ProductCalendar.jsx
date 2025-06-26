import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CircleDayView from './CircleDayView';
import './ProductCalendar.css';

const localizer = momentLocalizer(moment);

const ProductCalendar = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState('week');

  // 🟢 Save new calendar entry to backend
  const saveCalendarEntry = async ({ userId, productId, usageTime, notes }) => {
    try {
      const response = await fetch('http://localhost:5050/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, usageTime, notes }),
      });

      if (!response.ok) throw new Error('Failed to save entry');
      console.log('✅ Entry saved!');
    } catch (err) {
      console.error('❌ Save error:', err.message);
    }
  };

  // 🟢 Fetch calendar events
  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5050/api/schedule/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          title: item.product_name,
          start: new Date(item.usage_time),
          end: new Date(new Date(item.usage_time).getTime() + 1800000),
          allDay: false,
        }));
        setEvents(formatted);
      });
  }, [userId]);

  return (
    <div className="product-calendar">
      <h2>🗓️ Product Schedule</h2>

      <button
        className="add-product-button"
        onClick={() => {
          const entry = {
            userId,
            productId: 'cleanser123',
            usageTime: new Date().toISOString(),
            notes: 'Morning cleanser before sun exposure',
          };
          saveCalendarEntry(entry);
        }}
      >
        + Add New Product
      </button>

      {currentView === 'day' ? (
        <CircleDayView events={events} userId={userId} />
      ) : (
        <div className="calendar-wrapper">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={currentView}
            onView={setCurrentView}
            views={['week', 'day']} // 👈 agenda removed
            style={{ height: 500 }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductCalendar;
