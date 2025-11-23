import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Header from '../components/Header';
import ProductTable from '../components/ProductTable';
import HistorySidebar from '../components/HistorySidebar';
import Pagination from '../components/Pagination'; 
import AddProductModal from '../components/AddProductModal'; // 1. NEW IMPORT

const Dashboard = ({ onLogout }) => {
  const [products, setProducts] = useState([]);
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 2. NEW STATE for Modal

  // Reset to page 1 if user searches
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  // Fetch Data whenever these change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [search, category, currentPage]); 

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products', {
        params: { 
            search, 
            category, 
            page: currentPage, 
            limit: 10 
        }
      });
      
      // Update State from new backend structure
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);

    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  return (
    <div className="dashboard">
      <Header 
        search={search} setSearch={setSearch} 
        category={category} setCategory={setCategory} 
        refreshData={fetchProducts}
        onLogout={onLogout}
        onAddClick={() => setIsAddModalOpen(true)} // 3. PASS TRIGGER TO HEADER
      />
      
      <main className="content">
        <ProductTable 
          products={products} 
          refreshData={fetchProducts}
          onViewHistory={setSelectedProductId}
        />
        
        {/* Pagination Controls */}
        <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
        
        {/* Debug info */}
        <div style={{marginTop: '10px', color: '#666', fontSize: '12px'}}>
            Showing {products.length} of {totalItems} items
        </div>
      </main>

      {/* History Sidebar (Slide-in) */}
      {selectedProductId && (
        <HistorySidebar 
          productId={selectedProductId} 
          close={() => setSelectedProductId(null)} 
        />
      )}

      {/* 4. RENDER ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <AddProductModal 
          close={() => setIsAddModalOpen(false)} 
          refreshData={fetchProducts} 
        />
      )}
    </div>
  );
};

export default Dashboard;