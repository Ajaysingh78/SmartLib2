// src/App.jsx
import React, { useState, useEffect } from 'react';
import './index.css';

// Import all components
import './ui/buttion'; // Ensure FontAwesome icons are loaded
import Header from './components/Header';
import Hero from './components/Hero';
import SearchFilter from './components/SearchFilter';
import BookCard from './components/BookCard';
import BranchLegend from './components/BranchLegend';
import Footer from './components/Footer';

// Import data
import { booksData } from './data/booksData';

function App() {
  const [books] = useState(booksData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    branch: 'all',
    year: 'all',
    genre: 'all',
    availability: 'all'
  });
  const [filteredBooks, setFilteredBooks] = useState(booksData);
  const [stats, setStats] = useState({
    total: booksData.length,
    available: booksData.filter(b => b.available).length,
    showing: booksData.length
  });

  // Filter books effect
  useEffect(() => {
    let result = [...books];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(book =>
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search) ||
        book.isbn.toLowerCase().includes(search) ||
        book.publisher.toLowerCase().includes(search)
      );
    }

    // Branch filter
    if (filters.branch !== 'all') {
      result = result.filter(book => book.branch === filters.branch);
    }

    // Year filter
    if (filters.year !== 'all') {
      result = result.filter(book => book.year === filters.year);
    }

    // Genre filter
    if (filters.genre !== 'all') {
      result = result.filter(book => book.genre === filters.genre);
    }

    // Availability filter
    if (filters.availability !== 'all') {
      result = result.filter(book => 
        filters.availability === 'available' ? book.available : !book.available
      );
    }

    setFilteredBooks(result);
    setStats({
      total: books.length,
      available: books.filter(b => b.available).length,
      showing: result.length
    });
  }, [searchTerm, filters, books]);

  const handleReset = () => {
    setSearchTerm('');
    setFilters({
      branch: 'all',
      year: 'all',
      genre: 'all',
      availability: 'all'
    });
  };

  return (
    <div className="App">
      <Header />
      <Hero />
      
      <div className="container">
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          stats={stats}
          onReset={handleReset}
        />
      </div>

      <div className="container">
        <div className="books-section">
          <h2 className="section-title">
            <i className="fas fa-book-open"></i> Library Catalog
          </h2>
          <div className="books-grid">
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => <BookCard key={book.id} book={book} />)
            ) : (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <h3>No books found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
          <BranchLegend />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;