import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import backg from '../assets/Signup.jpg';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    authorize: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://localhost:5000/signup', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data);
      navigate('/login'); // Redirect to login page
    } catch (error) {
      alert('Error signing up: ' + error.message);
    }
  };

  return (
    <div className="signup-container">
      <img className="background-img" src={backg} alt="Signup Background" />
      <form onSubmit={handleSubmit} className="signup-box">
        <h2>SIGNUP</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="signup-box-input"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="signup-box-input"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="signup-box-input"
          />
        </div>
        <div className="terms">
          <input
            type="checkbox"
            name="authorize"
            checked={formData.authorize}
            onChange={handleChange}
          />
          <span>I Agree With The Terms & Conditions</span>
        </div>
        <button type="submit" className="register-button">
          Signup
        </button>
        <p className="login-link">
          Already Have An Account?{' '}
          <span onClick={() => navigate('/login')} className="link">
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;