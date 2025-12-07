// src/components/SearchFilter.jsx
import React from 'react';

const SearchFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  filters, 
  setFilters, 
  stats, 
  onReset 
}) => {
  const handleSearch = () => {
    setFilters({ ...filters });
  };

  return (
    <div className="search-filter-section">
      <div className="search-box">
        <input
          type="text"
          id="searchInput"
          placeholder="Search books by title, author, ISBN, or publisher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>
          <i className="fas fa-search"></i> Search
        </button>
      </div>

      <div className="filters-container">
        <div className="filter-group branch-filter">
          <label htmlFor="branchFilter">
            <i className="fas fa-graduation-cap"></i> Filter by Branch
          </label>
          <select
            id="branchFilter"
            value={filters.branch}
            onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
          >
            <option value="all">All Branches</option>
            <option value="cs">Computer Science</option>
            <option value="mech">Mechanical Engineering</option>
            <option value="civil">Civil Engineering</option>
            <option value="ece">Electronics & Communication</option>
            <option value="biotech">Biotechnology</option>
            <option value="general">General</option>
          </select>
        </div>

        <div className="filter-group year-filter">
          <label htmlFor="yearFilter">
            <i className="fas fa-calendar-alt"></i> Filter by Year
          </label>
          <select
            id="yearFilter"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            <option value="all">All Years</option>
            <option value="1">First Year</option>
            <option value="2">Second Year</option>
            <option value="3">Third Year</option>
            <option value="4">Fourth Year</option>
            <option value="reference">Reference</option>
          </select>
        </div>

        <div className="filter-group genre-filter">
          <label htmlFor="genreFilter">
            <i className="fas fa-tags"></i> Filter by Subject
          </label>
          <select
            id="genreFilter"
            value={filters.genre}
            onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          >
            <option value="all">All Subjects</option>
            <option value="programming">Programming</option>
            <option value="mathematics">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="engineering">Engineering</option>
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
          </select>
        </div>

        <div className="filter-group availability-filter">
          <label htmlFor="availabilityFilter">
            <i className="fas fa-check-circle"></i> Availability
          </label>
          <select
            id="availabilityFilter"
            value={filters.availability}
            onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
          >
            <option value="all">All Books</option>
            <option value="available">Available Now</option>
            <option value="unavailable">Currently Issued</option>
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Total Books</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Available</span>
            <span className="stat-value">{stats.available}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Showing</span>
            <span className="stat-value">{stats.showing}</span>
          </div>
        </div>
        <button className="reset-btn" onClick={onReset}>
          <i className="fas fa-redo"></i> Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;