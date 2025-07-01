// import React, { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebase/firebaseConfig';
// import { useNavigate } from 'react-router-dom';

// function Register() {
//   const [form, setForm] = useState({ name: '', age: '', gender: '', email: '', password: '' });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleRegister = async () => {
//     try {
//       // 1. Create user in Firebase
//       const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
//       const uid = userCredential.user.uid;

//       // 2. Send data to backend (Express + PostgreSQL)
//       const res = await fetch('http://localhost:5000/api/create-profile', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ uid, ...form }),
//       });

//       if (!res.ok) throw new Error('Failed to create profile');

//       // 3. Navigate to profile page
//       navigate('/profile');
//     } catch (error) {
//       console.error('Registration failed:', error.message);
//       alert('Something went wrong.');
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <input name="name" placeholder="Name" onChange={handleChange} /><br />
//       <input name="age" placeholder="Age" onChange={handleChange} /><br />
//       <select name="gender" onChange={handleChange}>
//         <option value="">Select Gender</option>
//         <option>Male</option>
//         <option>Female</option>
//         <option>Other</option>
//       </select><br />
//       <input name="email" placeholder="Email" onChange={handleChange} /><br />
//       <input name="password" placeholder="Password" type="password" onChange={handleChange} /><br />
//       <button onClick={handleRegister}>Register</button>
//     </div>
//   );
// }

// export default Register;
// src/pages/Register.jsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault(); // ✅ important for form behavior
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const uid = userCredential.user.uid;

      const res = await fetch('http://localhost:5000/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, ...form }),
      });

      if (!res.ok) throw new Error('Failed to create profile');
      navigate('/profile');
    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      alert('Something went wrong.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input name="name" placeholder="Name" onChange={handleChange} required /><br />
        <input name="age" placeholder="Age" onChange={handleChange} required /><br />
        <select name="gender" onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select><br />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
