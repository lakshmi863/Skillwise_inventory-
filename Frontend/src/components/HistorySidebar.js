import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig'; // Use our configured Axios
import { X, Calendar, User, Package } from 'lucide-react';

const HistorySidebar = ({ productId, close }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data whenever the productId changes
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Calls: GET /api/products/:id/history
        const response = await api.get(`/products/${productId}/history`);
        setHistory(response.data);
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchHistory();
    }
  }, [productId]);

  return (
    <>
      {/* Backdrop (Click to close) */}
      <div className="sidebar-backdrop" onClick={close}></div>

      {/* The Sidebar Panel */}
      <div className="sidebar open">
        
        {/* Header */}
        <div className="sidebar-header">
          <h3>Inventory History</h3>
          <button onClick={close} className="close-btn">
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="sidebar-content">
          {loading ? (
            <p className="status-msg">Loading logs...</p>
          ) : history.length === 0 ? (
            <div className="empty-state">
              <p>No history recorded for this product.</p>
              <small>Logs appear when you change stock levels.</small>
            </div>
          ) : (
            <ul className="history-list">
              {history.map((log) => (
                <li key={log.id} className="history-card">
                  
                  {/* Date Header */}
                  <div className="card-header">
                    <span className="date-badge">
                      <Calendar size={14} style={{marginRight:'5px'}}/>
                      {new Date(log.change_date).toLocaleString()}
                    </span>
                    <span className="user-badge">
                      <User size={14} style={{marginRight:'5px'}}/>
                      {log.changed_by || 'System'}
                    </span>
                  </div>

                  {/* Stock Change Visual */}
                  <div className="stock-change">
                    <div className="stock-box old">
                        <small>Old</small>
                        <strong>{log.old_stock}</strong>
                    </div>
                    <div className="arrow">➝</div>
                    <div className="stock-box new">
                        <small>New</small>
                        <strong style={{ color: log.new_stock > log.old_stock ? 'green' : 'red' }}>
                            {log.new_stock}
                        </strong>
                    </div>
                  </div>
                  
                  <div className="log-detail">
                    <Package size={14} /> Stock Update
                  </div>

                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;