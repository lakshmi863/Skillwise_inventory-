import React, { useState } from 'react';
import api from '../api/axiosConfig';

const LoginPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegistering ? '/register' : '/login';
    
    try {
      const res = await api.post(endpoint, formData);
      if (isRegistering) {
        setIsRegistering(false);
        alert("Registration successful! Please log in.");
      } else {
        // Save token and notify App.js
        localStorage.setItem('token', res.data.token);
        onLogin(res.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <input 
            name="username" placeholder="Username" 
            onChange={handleChange} required 
          />
          <input 
            type="password" name="password" placeholder="Password" 
            onChange={handleChange} required 
          />
          <button type="submit">{isRegistering ? 'Sign Up' : 'Log In'}</button>
        </form>

        <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
          {isRegistering ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;