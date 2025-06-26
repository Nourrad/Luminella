import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RegisterForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const questionnaireAnswers = location.state?.answers;

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    email: '',
    country: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allFilled = Object.values(formData).every(field => field.trim() !== '');
    if (!allFilled) {
      setError('Please fill in all fields.');
      return;
    }

    console.log('📝 Registering User with Data:', formData);
    console.log('📋 Questionnaire Answers:', questionnaireAnswers);

    alert('Account created successfully!');
    navigate('/');
  };

  const styles = {
    container: {
      padding: '2rem',
      backgroundColor: '#f0ede5',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', sans-serif",
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    heading: {
      marginBottom: '2rem',
      color: '#5a273b',
      textAlign: 'center'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '600px',
      width: '100%'
    },
    input: {
      padding: '12px',
      marginBottom: '1rem',
      border: '1px solid #ccc',
      borderRadius: '10px',
      fontSize: '1rem',
      width: '100%'
    },
    button: {
      padding: '12px',
      backgroundColor: '#5a273b',
      color: 'white',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      width: '100%'
    },
    buttonHover: {
      backgroundColor: '#7e5e63'
    },
    error: {
      color: 'red',
      marginBottom: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Your Account</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} style={styles.input} />
        <input name="dob" type="date" value={formData.dob} onChange={handleChange} style={styles.input} />
        
        <select name="gender" value={formData.gender} onChange={handleChange} style={styles.input}>
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>

        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} style={styles.input} />
        <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} style={styles.input} />
        <input name="password" type="password" placeholder="Create Password" value={formData.password} onChange={handleChange} style={styles.input} />

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>Create Account</button>
      </form>
    </div>
  );
}

export default RegisterForm;
