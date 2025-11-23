import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { Loader } from 'lucide-react'; // Import Loader Icon

const LoginPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 1. New State

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // 2. Start Loading

    const endpoint = isRegistering ? '/register' : '/login';
    
    try {
      const res = await api.post(endpoint, formData);
      
      if (isRegistering) {
        setIsRegistering(false);
        alert("Registration successful! Please log in.");
        // Don't stop loading if we switch to login, strictly speaking we could, 
        // but it feels smoother to reset the form state.
      } else {
        localStorage.setItem('token', res.data.token);
        onLogin(res.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Server might be sleeping.");
    } finally {
      setIsLoading(false); // 3. Stop Loading (always runs)
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
        
        {/* Show helpful message if server is slow */}
        {isLoading && !error && (
          <p style={{fontSize: '0.8rem', color: '#666'}}>Connecting to server... (First load may take a minute)</p>
        )}

        {error && <p className="error-msg">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <input 
            name="username" 
            placeholder="Username" 
            onChange={handleChange} 
            required 
            disabled={isLoading} // Disable inputs while loading
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
            disabled={isLoading} 
          />
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Loader className="spin" size={18} /> 
                Please Wait...
              </div>
            ) : (
              isRegistering ? 'Sign Up' : 'Log In'
            )}
          </button>
        </form>

        {/* Disable switching modes while loading */}
        {!isLoading && (
          <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
            {isRegistering ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;