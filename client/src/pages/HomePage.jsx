import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
import EnhancedSearchFilter from "../components/EnhancedSearchFilter";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { getDepartmentBook } from "../api/fetchBookAPI";
import { BookContext } from "../context/BookContext";

function HomePage() {
  const navigate = useNavigate();
  // context
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("BookContext must be used inside BookProvider");
  }
  const { allBooks, setAllBooks } = context;

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    branch: "all",
    year: "all",
    genre: "all",
    availability: "all",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // Memoized Filtered Books
  const filteredBooks = useMemo(() => {
    let result = [...allBooks];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(search) ||
          book.author.toLowerCase().includes(search) ||
          book.isbn.toLowerCase().includes(search) ||
          (book.publisher && book.publisher.toLowerCase().includes(search))
      );
    }

    // Branch filter
    if (filters.branch !== "all") {
      result = result.filter((book) => book.branch === filters.branch);
    }

    // Year filter
    if (filters.year !== "all") {
      result = result.filter((book) => book.year === filters.year);
    }

    // Genre filter
    if (filters.genre !== "all") {
      result = result.filter((book) => book.genre === filters.genre);
    }

    // Availability filter
    if (filters.availability !== "all") {
      result = result.filter((book) =>
        filters.availability === "available" ? book.available : !book.available
      );
    }

    return result;
  }, [searchTerm, filters, allBooks]);

  // Paginated Books
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBooks.slice(startIndex, endIndex);
  }, [filteredBooks, currentPage, itemsPerPage]);

  // Stats
  const stats = useMemo(
    () => ({
      total: allBooks?.length,
      available: allBooks?.filter((b) => b.available).length,
      showing: filteredBooks.length,
    }),
    [allBooks, filteredBooks]
  );

  // Total Pages
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // Reset handler
  const handleReset = useCallback(() => {
    setSearchTerm("");
    setFilters({
      branch: "all",
      year: "all",
      genre: "all",
      availability: "all",
    });
    setCurrentPage(1);
  }, []);

  // Page change handler
  const handlePageChange = useCallback((page) => {
    setIsLoading(true);
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });

    setTimeout(() => setIsLoading(false), 300);
  }, []);

  // Items per page change handler
  const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  // Book click handler
  const handleBookClick = useCallback((index) => {
    navigate(`/book/${index}`);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const { data, error, isLoading } = useSWR(
    `${BASE_URL}/get/books/agriculture`,
    getDepartmentBook
  );

  useEffect(() => {
    const someBooks = data?.slice(0, 12);

    if (!someBooks) return;
    setAllBooks(someBooks);
    console.log(someBooks);
  }, [data]);

  return (
    <>
      {/* Main Container - FIXED RESPONSIVE */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-[1800px] mx-auto">
        {/* Search & Filter */}
        <EnhancedSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          stats={stats}
          onReset={handleReset}
        />

        {/* Books Section */}
        <div className="mt-8 sm:mt-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
              Library Catalog
            </h2>
            <div className="text-xs sm:text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1.5 rounded-lg">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <LoadingSkeleton count={itemsPerPage} />
          ) : (
            <>
              {/* Books Grid */}
              {allBooks?.length > 0 ? (
                <div className="books-grid">
                  {allBooks.map((book, index) => (
                    <BookCard
                      key={index}
                      book={book}
                      onClick={handleBookClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 sm:py-20 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-6">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    No books found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm sm:text-base"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {allBooks?.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredBooks.length}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
