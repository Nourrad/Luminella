// src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore'; 


import './Questionnaires.css'; // ✅ Reuse styling from Questionnaire



const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user ID and email to localStorage
      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userEmail', user.email);   

      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.name) localStorage.setItem('userName', data.name);
        if (data.profileImageURL) localStorage.setItem('profileImageURL', data.profileImageURL);
        if (data.skinType) localStorage.setItem('skinType', data.skinType);
        if (data.concerns) localStorage.setItem('concerns', JSON.stringify(data.concerns));
      }
      navigate('/profile');
      } catch (err) {
        setError('Invalid Email or Password.');
      }
    };

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setResetCodeSent(true);
    } catch (err) {
      setError('Failed to send reset email. Make sure your email is correct.');
    }
  };

  const renderResetForm = () => (
    <div className="questionnaire-inner">
      <h2 className="questionnaire-title">🔐 Reset Your Password</h2>
      <input
        type="email"
        className="input-field"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleReset}>Send Reset Email</button>
      {resetCodeSent && <p style={{ color: 'green', marginTop: '1rem' }}>✅ A reset link has been sent.</p>}
      <button onClick={() => setShowReset(false)} style={{ marginTop: '1rem' }}>Back to Login</button>
    </div>
  );

  return (
    <div className="questionnaire">
      <div className="questionnaire-inner">
        <h2 className="questionnaire-title">Welcome Back</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {showReset ? (
          renderResetForm()
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
            <p style={{ marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setShowReset(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#5a273b',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '1rem',
                }}
              >
                Forgot Password?
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
