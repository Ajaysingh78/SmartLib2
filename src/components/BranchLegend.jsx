// src/components/BranchLegend.jsx
import React from 'react';

const BranchLegend = () => {
  return (
    <div className="branch-legend">
      <div className="branch-item">
        <div className="branch-color" style={{ backgroundColor: 'var(--cs-color)' }}></div>
        <span>Computer Science</span>
      </div>
      <div className="branch-item">
        <div className="branch-color" style={{ backgroundColor: 'var(--mech-color)' }}></div>
        <span>Mechanical Engineering</span>
      </div>
      <div className="branch-item">
        <div className="branch-color" style={{ backgroundColor: 'var(--civil-color)' }}></div>
        <span>Civil Engineering</span>
      </div>
      <div className="branch-item">
        <div className="branch-color" style={{ backgroundColor: 'var(--ece-color)' }}></div>
        <span>Electronics & Communication</span>
      </div>
      <div className="branch-item">
        <div className="branch-color" style={{ backgroundColor: 'var(--biotech-color)' }}></div>
        <span>Biotechnology</span>
      </div>
    </div>
  );
};

export default BranchLegend;