// ============================================
// 🔍 SEARCH BAR COMPONENT - FIXED
// ============================================

import React from 'react';
import { Search, X, Filter } from 'lucide-react';

const SearchBar = ({ 
  searchQuery,          // ✅ FIXED: searchQuery (not searchTerm)
  setSearchQuery,       // ✅ FIXED: setSearchQuery (not setSearchTerm)
  selectedCategory,     // ✅ ADDED
  setSelectedCategory,  // ✅ ADDED
  categories = []       // ✅ ADDED
}) => {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 space-y-4">
      
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-indigo-500 focus-within:bg-white focus-within:shadow-md transition-all">
          <Search 
            className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" 
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search by title, author, ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-2 py-3 md:py-4 text-sm md:text-base text-gray-800 placeholder-gray-400 bg-transparent outline-none font-medium"
            aria-label="Search books"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors mr-1"
              aria-label="Clear search"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 px-4 py-3 text-sm md:text-base text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all font-medium"
            aria-label="Filter by department"
          >
            <option value="all">All Departments</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {selectedCategory !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;