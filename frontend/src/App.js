import React from 'react';
import './App.css';
import Homepage from './pages/Homepage.jsx';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Calendar from './pages/Calendar.jsx';
import MyShelf from './pages/MyShelf.jsx';
import SearchProducts from './pages/SearchProducts.jsx';
// import SearchProducts from './SearchProducts'; // ✅ Correct for default export
import Questionnaires from './pages/Questionnaires.jsx';
// import RegisterForm from './pages/RegisterForm.jsx';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Today from './pages/Today';

import ProductCalendar from './pages/ProductCalendar.jsx';

import Footer from './pages/Footer';
import Login from './pages/Login.jsx';

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/Today" element={<Today />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/calendar" element={<Calendar />} /> */}
          <Route path="/ProductCalendar" element={<ProductCalendar userId={1} />} />
          <Route path="/shelf" element={<MyShelf />} />
          <Route path="/search" element={<SearchProducts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/questionnaires" element={<Questionnaires />} />
          {/* <Route path="/register-form" element={<RegisterForm />} /> */}
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </>
    </Router>
  );
}

export default App;
