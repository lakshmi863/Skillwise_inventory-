import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { Edit, Trash2, Save, X, Eye } from 'lucide-react';

const ProductTable = ({ products, refreshData, onViewHistory }) => {
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});

  const startEdit = (product) => {
    setEditId(product.id);
    setFormData(product);
  };

  // Handle changes for input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put(`/products/${editId}`, {
        ...formData,
        status: parseInt(formData.stock) > 0 ? 'In Stock' : 'Out of Stock'
      });
      setEditId(null);
      refreshData();
    } catch (err) {
      alert("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      await api.delete(`/products/${id}`);
      refreshData();
    }
  };

  // Fallback image if URL is empty or broken
  const defaultImage = "https://via.placeholder.com/50?text=No+Img";

  return (
    <div className="table-wrapper">
      <table className="styled-table">
        <thead>
          <tr>
            <th>Image</th> {/* NEW COLUMN HEADER */}
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Unit</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              {editId === p.id ? (
                <>
                  {/* EDIT MODE: Show Input for Image URL */}
                  <td>
                    <input 
                      name="image" 
                      value={formData.image} 
                      onChange={handleChange} 
                      placeholder="Image URL" 
                      
                    />
                  </td>
                  <td><input name="name" value={formData.name} onChange={handleChange} /></td>
                  <td><input name="category" value={formData.category} onChange={handleChange} /></td>
                  <td><input name="brand" value={formData.brand} onChange={handleChange} /></td>
                  <td><input name="unit" value={formData.unit} onChange={handleChange} /></td>
                  <td><input type="number" name="stock" value={formData.stock} onChange={handleChange} /></td>
                  <td>-</td>
                  <td>
                    <button className="icon-btn save" onClick={handleSave}><Save size={18}/></button>
                    <button className="icon-btn cancel" onClick={() => setEditId(null)}><X size={18}/></button>
                  </td>
                </>
              ) : (
                <>
                  {/* VIEW MODE: Show the actual Image */}
                  <td>
                    <img 
                      src={p.image || defaultImage} 
                      alt={p.name} 
                      className="product-img-thumb" 
                      onError={(e) => { e.target.src = defaultImage; }} // Handle broken links
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.brand}</td>
                  <td>{p.unit}</td>
                  <td className={p.stock === 0 ? "text-danger" : ""}>{p.stock}</td>
                  <td><span className={`badge ${p.stock > 0 ? 'success' : 'danger'}`}>{p.status}</span></td>
                  <td>
                    <button className="icon-btn" title="View History" onClick={() => onViewHistory(p.id)}><Eye size={18}/></button>
                    <button className="icon-btn edit" onClick={() => startEdit(p)}><Edit size={18}/></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(p.id)}><Trash2 size={18}/></button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;