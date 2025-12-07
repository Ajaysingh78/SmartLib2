// src/components/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-book-reader"></i>
            <div>
              <h1>College <span>Library</span></h1>
              <p>Digital Book Catalog System</p>
            </div>
          </div>
          <div className="scan-info">
            <i className="fas fa-qrcode"></i> Scan QR code outside library to access catalog
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;