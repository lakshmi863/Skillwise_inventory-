import React from 'react';
import api from '../api/axiosConfig';
import { Plus } from 'lucide-react'; // 1. Import the Plus icon

// 2. Add 'onAddClick' to the props list
const Header = ({ search, setSearch, category, setCategory, refreshData, onLogout, onAddClick }) => {
  
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/products/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Updated logic to handle mass import response if you used the database fix
      const added = res.data.added || 0; 
      const skipped = res.data.skipped || 0; 
      alert(`Import processed. Added: ${added}, Skipped: ${skipped}`);
      refreshData();
    } catch (err) {
      console.error(err);
      alert("Import failed");
    }
  };

  const handleExport = () => {
    // Ensure this URL matches your Backend PORT
    window.open(`http://localhost:5000/api/products/export`, '_blank');
  };

  return (
    <header className="app-header">
      <div className="brand">
        <h1>Inventory Manager</h1>
      </div>
      
      <div className="filters">
        <input 
          placeholder="Search products..." 
          value={search} onChange={(e) => setSearch(e.target.value)} 
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Accessories">Accessories</option>
          <option value="Groceries">Groceries</option>
          <option value="Fashion">Fashion</option>
        </select>
      </div>

      <div className="actions">
        {/* 3. The New "Add Product" Button */}
        <button className="btn-primary-add" onClick={onAddClick}>
          
          <Plus size={18} /> Add Product
          
        </button>

        <label className="btn-secondary">
          Import CSV
          <input type="file" hidden accept=".csv" onChange={handleImport} />
        </label>
        <button className="btn-secondary" onClick={handleExport}>Export</button>
        <button className="btn-danger" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;