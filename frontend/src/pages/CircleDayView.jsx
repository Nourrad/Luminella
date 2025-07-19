import React, { useState } from 'react';
import './CircleDayView.css';
import { auth, db } from '../firebase/firebase';


const hours = [
  '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
  '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'
];

const dummyProducts = ['Cleanser', 'Serum', 'Moisturizer', 'Toner'];

const CircleDayView = ({ events, userId }) => {
  const [notifications, setNotifications] = useState({});
  const [editingHour, setEditingHour] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleToggleNotification = (hour) => {
    setNotifications((prev) => ({
      ...prev,
      [hour]: !prev[hour]
    }));
  };

  const handleSave = async (hour) => {
    const hourNumber = (hours.indexOf(hour) + 6) % 12;
    const time = selectedTime || `${hourNumber}:00`;

    const payload = {
      userId,
      product_name: selectedProduct,
      usage_time: `2025-01-01T${time}:00`, // you may need to localize this
    };

    try {
      const res = await fetch(`http://localhost:5050/api/schedule/by-name`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('✅ Product scheduled!');
        setEditingHour(null);
      } else {
        alert('❌ Failed to save.');
      }
    } catch (err) {
      console.error('Error saving:', err);
    }
  };

  return (
    <div className="circle-view-container">
      <div className="clock-circle">
        {hours.map((hour, i) => {
          const event = events.find((e) => new Date(e.start).getHours() % 12 === (i + 6) % 12);

          return (
            <div className="clock-hour" key={i} style={{ transform: `rotate(${i * 30}deg)` }}>
              <div className="clock-label" style={{ transform: `rotate(-${i * 30}deg)` }}>
                {hour}
                {event && (
                  <div className="event-info">
                    <div>{event.title}</div>
                    <button onClick={() => setEditingHour(hour)} className="edit-btn">Edit</button>
                    <button
                      className={`notify-btn ${notifications[hour] ? 'on' : ''}`}
                      onClick={() => handleToggleNotification(hour)}
                    >
                      {notifications[hour] ? '🔔' : '🔕'}
                    </button>
                  </div>
                )}

                {editingHour === hour && (
                  <div className="edit-form">
                    <select onChange={(e) => setSelectedProduct(e.target.value)} defaultValue="">
                      <option value="" disabled>Select Product</option>
                      {dummyProducts.map((prod, idx) => (
                        <option key={idx} value={prod}>{prod}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      onChange={(e) => setSelectedTime(e.target.value)}
                      style={{ marginLeft: '4px' }}
                    />
                    <button onClick={() => handleSave(hour)} style={{ marginTop: '4px' }}>Save</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CircleDayView;
