// NewFooter.js
import React from 'react';
import '../../styles/Footer.css'; 

const NewFooter = () => {
  return (
    <footer className="footer-container">
      <div className="footer-logo">
        <h2>Gateway for Financial freedon </h2>
      </div>
      <p className="footer-text">&copy; {new Date().getFullYear()} Bubul Roy. All rights reserved. </p>
    </footer>
  );
};

export default NewFooter;
