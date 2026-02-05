import React from "react";
import { Search } from "lucide-react";

/**
 * Search Bar with Category Filter
 * @param {string} searchQuery - Current search query
 * @param {function} setSearchQuery - Update search query
 * @param {string} selectedCategory - Selected category
 * @param {function} setSelectedCategory - Update selected category
 * @param {array} categories - Available categories
 */
function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  // New props for active filters
  filters,
  updateFilter,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Availability Filter */}
        <select
          value={filters?.availability || "all"}
          onChange={(e) => updateFilter("availability", e.target.value)}
          className="w-full lg:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="all">Availability: All</option>
          <option value="unavailable">Unavailable Only</option>
        </select>

        {/* Image Filter */}
        <select
          value={filters?.image || "all"}
          onChange={(e) => updateFilter("image", e.target.value)}
          className="w-full lg:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="all">Images: All</option>
          <option value="no-image">No Image Only</option>
        </select>

        {/* Sort Filter */}
        <select
          value={filters?.sort || "default"}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full lg:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="default">Sort: Default</option>
          <option value="most-viewed">Sort: Most Viewed</option>
        </select>

        {/* Category Filter Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full lg:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SearchBar;
