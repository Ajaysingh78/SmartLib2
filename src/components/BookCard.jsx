// src/components/BookCard.jsx - Shadcn UI Style
import React from 'react';

const BookCard = ({ book }) => {
  const yearLabels = {
    '1': 'Year 1',
    '2': 'Year 2',
    '3': 'Year 3',
    '4': 'Year 4',
    'reference': 'Reference'
  };

  const branchLabels = {
    'cs': 'CS',
    'mech': 'Mech',
    'civil': 'Civil',
    'ece': 'ECE',
    'biotech': 'Biotech',
    'general': 'General'
  };

  return (
    <div className={`card book-card ${book.branch}`}>
      {/* Card Header - Book Cover */}
      <div className="card-header">
        <div 
          className="book-cover" 
          style={{ background: `linear-gradient(135deg, ${book.coverColor}, ${book.coverColor}dd)` }}
        >
          <div className="book-branch">{branchLabels[book.branch]}</div>
          <div className="book-year">{yearLabels[book.year]}</div>
          <i className="fas fa-book"></i>
        </div>
      </div>

      {/* Card Content - Book Details */}
      <div className="card-content">
        <h3 className="card-title book-title">{book.title}</h3>
        
        <p className="card-description book-author">
          <i className="fas fa-user"></i> {book.author}
        </p>

        <div className="book-details">
          <span className="book-genre">{book.genre}</span>
          <div className={`book-availability ${book.available ? 'available' : 'unavailable'}`}>
            <span className="availability-dot"></span>
            {book.available ? 'Available' : 'Issued'}
          </div>
        </div>
      </div>

      {/* Card Footer - ISBN & Publisher */}
      <div className="card-footer book-footer">
        <span className="book-isbn">{book.isbn}</span>
        <span className="book-publisher">
          <i className="fas fa-building"></i> {book.publisher}
        </span>
      </div>
    </div>
  );
};

export default BookCard;