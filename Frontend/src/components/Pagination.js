import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Local state for the input box
  const [inputPage, setInputPage] = useState(currentPage);

  // Sync input with the actual current page when clicking Next/Prev
  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handleInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const pageNumber = parseInt(inputPage);

      if (pageNumber >= 1 && pageNumber <= totalPages) {
        onPageChange(pageNumber); // Valid page: Go there
      } else {
        setInputPage(currentPage); // Invalid page: Reset
        alert(`Please enter a page between 1 and ${totalPages}`);
      }
    }
  };

  return (
    <div className="pagination-container">
<div className="pagination-buttons">
        <button 
          disabled={currentPage === 1} 
          onClick={() => onPageChange(currentPage - 1)}
          className="btn-page"
        >
          <ChevronLeft size={20} />
        </button>

      {/* LEFT SIDE: Page Input + Total Count */}
      <div className="page-input-group">
        <span>Page</span>
        <input 
          type="number" 
          min="1" 
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="page-input"
        />
        <span>of <strong>{totalPages}</strong></span>
      </div>
      
      {/* RIGHT SIDE: Navigation Buttons */}
      
        
        <button 
          disabled={currentPage === totalPages || totalPages === 0} 
          onClick={() => onPageChange(currentPage + 1)}
          className="btn-page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;