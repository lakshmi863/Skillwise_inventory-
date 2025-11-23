import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';     
import Sidebar from './components/Sidebar'; 
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // 1. New State to track which page is open ('home' or 'inventory')
  const [activeTab, setActiveTab] = useState('home'); 

  useEffect(() => {
    // Optional: Validate token validity with backend here if needed
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setActiveTab('home'); // Reset tab on logout
  };

  // 2. Check if not logged in first
  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  // 3. Render the Split Layout (Sidebar + Content)
  return (
    <div className="app-layout">
      {/* LEFT SIDE: Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      {/* RIGHT SIDE: Changing Content */}
      <div className="main-content-area">
        {/* If activeTab is 'home', show Stats */}
        {activeTab === 'home' && <HomePage />}
        
        {/* If activeTab is 'inventory', show the Table */}
        {activeTab === 'inventory' && <Dashboard onLogout={handleLogout} />}
      </div>
    </div>
  );
}

export default App;