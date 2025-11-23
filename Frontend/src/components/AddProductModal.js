import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { X, Save } from 'lucide-react';

const AddProductModal = ({ close, refreshData }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    unit: 'pcs',
    stock: 0,
    image: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/products', formData);
      alert("Product Added Successfully!");
      refreshData(); // Reload table
      close();       // Close modal
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add product");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Product</h3>
          <button onClick={close} className="close-btn"><X /></button>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit} className="add-form">
          
          <div className="form-group">
            <label>Product Name *</label>
            <input name="name" required placeholder="e.g. Wireless Mouse" onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input name="category" placeholder="Electronics" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input name="brand" placeholder="Logitech" onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
             <div className="form-group">
              <label>Stock Quantity *</label>
              <input type="number" name="stock" required min="0" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <select name="unit" onChange={handleChange}>
                <option value="pcs">Pieces (pcs)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="box">Box</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input name="image" placeholder="http://..." onChange={handleChange} />
          </div>

          <button type="submit" className="btn-save-primary">
            <Save size={18} style={{marginRight: '8px'}} /> 
            Save Product
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddProductModal;