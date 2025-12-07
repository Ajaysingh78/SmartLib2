// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>College Library</h3>
            <p>
              Our digital catalog provides easy access to all library resources. 
              Scan the QR code placed outside the library to check book availability anytime.
            </p>
            <p><i className="fas fa-map-marker-alt"></i> Library Building, Central Campus</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#"><i className="fas fa-arrow-right"></i> Library Hours</a></li>
              <li><a href="#"><i className="fas fa-arrow-right"></i> Issue & Return Policy</a></li>
              <li><a href="#"><i className="fas fa-arrow-right"></i> Digital Resources</a></li>
              <li><a href="#"><i className="fas fa-arrow-right"></i> Faculty Publications</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact & Support</h3>
            <p><i className="fas fa-phone"></i> (123) 456-7890</p>
            <p><i className="fas fa-envelope"></i> library@college.edu</p>
            <p><i className="fas fa-clock"></i> Mon-Fri: 8AM-10PM, Sat: 9AM-6PM</p>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2023 College Library. All rights reserved. | QR Access System v2.1</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;