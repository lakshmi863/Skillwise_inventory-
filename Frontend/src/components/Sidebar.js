import React from 'react';
import { LayoutDashboard, Box, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <div 
      className="nav-sidebar" 
      // UPDATED BACKGROUND COLOR HERE (Light Grayish-Blue)
      style={{ 
        backgroundColor: '#F8FAFC', // <--- Very soft light color
        minHeight: '100vh', 
        borderRight: '1px solid #e2e8f0' 
      }}
    >
      
      {/* Logo Section */}
      <div className="nav-brand" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <img 
          src="/logo.png" 
          alt="Skillwise" 
          style={{ maxWidth: '150px', height: 'auto', display: 'block' }} 
        />
      </div>
      
      {/* Navigation Buttons */}
      <button 
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => setActiveTab('home')}
      >
        <LayoutDashboard size={20} /> Dashboard
      </button>

      <button 
        className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
        onClick={() => setActiveTab('inventory')}
      >
        <Box size={20} /> Inventory
      </button>

      <div className="spacer"></div>

      <button className="nav-item logout" onClick={onLogout}>
        <LogOut size={20} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;