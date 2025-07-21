import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    password: '',
    age: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { userName, userEmail, password, age } = formData;
    const parsedAge = Number(age);
    if (!parsedAge || parsedAge < 16) {
      setError('You must be at least 16 years old to register.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: userName });

      await setDoc(doc(db, 'users', user.uid), {
        userName,
        userEmail,
        age: parsedAge,
        skinType: '',
        concerns: [],
        profileImageURL: '',
        createdAt: serverTimestamp()
      });

      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('userName', userName);

      navigate('/questionnaires');
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Register</h2>

        <input
          type="text"
          name="userName"
          placeholder="Full Name"
          value={formData.userName}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="email"
          name="userEmail"
          placeholder="Email Address"
          value={formData.userEmail}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          min="16"
          style={styles.input}
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f0ede5',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  form: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    width: '300px'
  },
  title: {
    marginBottom: '1.5rem',
    color: '#5a273b',
    fontFamily: 'sans-serif'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontFamily: 'sans-serif'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#5a273b',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'sans-serif'
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
    marginBottom: '1rem'
  }
};

export default Register;
