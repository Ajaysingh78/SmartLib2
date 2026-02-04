import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getAllBooks,
  addBook as apiAddBook,
  updateBook as apiUpdateBook,
  deleteBook as apiDeleteBook,
  toggleBookAvailability as apiToggleAvailability,
  getDashboardStats,
  searchBookByTitle,
  getUnavailableBooks,
  getBooksWithoutImage,
  getMostViewedBooks
} from '../api/axios';

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({ totalBooks: 0, availableBooks: 0, unavailableBooks: 0 });

  // Pagination State
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination State - Derived from URL
  const page = parseInt(searchParams.get("page") || "1", 10);

  // const [page, setPage] = useState(1); // REMOVED local state
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10; // Fixed limit as per requirement

  // Filter State (Derived from URL)
  const filters = {
    availability: searchParams.get("availability") || "all",
    image: searchParams.get("image") || "all",
    sort: searchParams.get("sort") || "default"
  };

  const loadBooks = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);

      console.log(`🔄 Loading books (Page ${page}, Filters:`, filters, `) ${silent ? '(Silent)' : ''}...`);

      let booksPromise;
      // 1. Priority: Unavailable (Most restrictive usually)
      if (filters.availability === 'unavailable') {
        booksPromise = getUnavailableBooks(page, limit);
      }
      // 2. Priority: No Image
      else if (filters.image === 'no-image') {
        booksPromise = getBooksWithoutImage(page, limit);
      }
      // 3. Priority: Most Viewed (Sort)
      else if (filters.sort === 'most-viewed') {
        booksPromise = getMostViewedBooks(page, limit);
      }
      // 4. Default: All Books
      else {
        booksPromise = getAllBooks(page, limit);
      }

      const [booksResponse, statsResponse] = await Promise.all([
        booksPromise,
        getDashboardStats()
      ]);

      console.log('📦 API Response:', booksResponse);

      // Handle Stats
      if (statsResponse?.status === 'success') {
        setStats(statsResponse.data);
      }

      if (booksResponse?.status === 'success') {
        let fetchedBooks = booksResponse.data || [];

        // ✅ Apply Client-side Secondary Filtering & Sorting
        // Since we picked ONE API to call, we must enforce other active filters manually on the returned page.
        // Note: This only filters the CURRENT PAGE. Ideal solution requires backend combinatorial search.

        // Filter: Availability (if we didn't fetch unavailable API)
        if (filters.availability === 'unavailable' && filters.availability !== 'unavailable') {
          // Logic above ensures if availability is unavailable, we fetched unavailable API. 
          // So we don't need to double filter here typically unless logic changes.
        }

        // Filter: Image (if we fetched Unavailable or All)
        if (filters.image === 'no-image') {
          // If we called getUnavailableBooks, we might have books WITH images. Filter them out.
          // If we called getBooksWithoutImage, we are good.
          if (filters.availability === 'unavailable' || filters.sort === 'most-viewed' || (filters.availability === 'all' && filters.sort === 'default')) {
            fetchedBooks = fetchedBooks.filter(book => !book.image);
          }
        }

        // Sort: Most Viewed (if we fetched Unavailable or No Image or All)
        if (filters.sort === 'most-viewed') {
          // If we called getMostViewedBooks, it's already sorted.
          // If we called others, we need to sort client-side.
          if (filters.availability === 'unavailable' || filters.image === 'no-image' || (filters.availability === 'all' && filters.image === 'all')) {
            fetchedBooks.sort((a, b) => (b.views || 0) - (a.views || 0));
          }
        }

        // Handle pagination metadata
        if (booksResponse.pagination) {
          setTotalPages(booksResponse.pagination.totalPages);
          setTotalItems(booksResponse.pagination.totalItems);
        }

        console.log('✅ Loaded', fetchedBooks.length, 'books');
        setBooks(fetchedBooks);
      } else {
        console.warn('⚠️ No books found');
        setBooks([]);
      }

      setLoading(false);

    } catch (err) {
      console.error('❌ Failed to load books:', err);
      setError(err.message || 'Failed to fetch books');
      setLoading(false);
      setBooks([]);
    }
  }, [refreshTrigger, page, filters.availability, filters.image, filters.sort]); // Reload when any filter changes

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams(prev => {
        prev.set("page", newPage.toString());
        return prev;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addBook = async (bookData) => {
    try {
      console.log('➕ Adding book...', bookData);

      const response = await apiAddBook(bookData);

      console.log('✅ Book added successfully:', response);

      // Force refresh to show new book immediately
      setRefreshTrigger(prev => prev + 1);

      return {
        success: true,
        book: response.data || response,
        message: 'Book added successfully! 🎉'
      };

    } catch (err) {
      console.error('❌ Failed to add book:', err);

      return {
        success: false,
        error: err.message || 'Failed to add book'
      };
    }
  };

  const updateBook = async (updatedBookData) => {
    try {
      const bookId = updatedBookData._id || updatedBookData.id;

      if (!bookId) {
        throw new Error('Book ID required');
      }

      console.log('✏️ Updating book:', bookId);

      const { _id, id, createdAt, updatedAt, views, isAvailable, __v, ...updateData } = updatedBookData;

      const response = await apiUpdateBook(bookId, updateData);

      console.log('✅ Book updated:', response);

      setRefreshTrigger(prev => prev + 1);

      return {
        success: true,
        book: response.data || response,
        message: 'Book updated successfully! ✏️'
      };

    } catch (err) {
      console.error('❌ Failed to update book:', err);

      return {
        success: false,
        error: err.message || 'Failed to update book'
      };
    }
  };

  const deleteBook = async (bookId) => {
    try {
      console.log('🗑️ Deleting book:', bookId);

      // Optimistic update
      setBooks(prevBooks => prevBooks.filter(book =>
        (book._id || book.id) !== bookId
      ));

      const response = await apiDeleteBook(bookId);

      console.log('✅ Book deleted:', response);

      // Trigger silent server refresh to get fresh data without UI flicker
      loadBooks(true);

      return {
        success: true,
        message: 'Book deleted successfully! 🗑️'
      };

    } catch (err) {
      console.error('❌ Failed to delete book:', err);

      // Rollback on error
      setRefreshTrigger(prev => prev + 1);

      return {
        success: false,
        error: err.message || 'Failed to delete book'
      };
    }
  };

  const toggleAvailability = async (bookId) => {
    try {
      console.log('🔄 Toggling availability:', bookId);

      // Find book to get current status
      const bookToToggle = books.find(b => (b._id || b.id) === bookId);
      if (!bookToToggle) {
        throw new Error('Book not found');
      }

      const currentStatus = bookToToggle.isAvailable;

      // Optimistic update for Books
      setBooks(prevBooks =>
        prevBooks.map(book =>
          (book._id || book.id) === bookId
            ? { ...book, isAvailable: !book.isAvailable }
            : book
        )
      );

      // Optimistic update for Stats
      setStats(prevStats => {
        const isNowAvailable = !currentStatus;
        return {
          ...prevStats,
          availableBooks: prevStats.availableBooks + (isNowAvailable ? 1 : -1),
          unavailableBooks: prevStats.unavailableBooks + (isNowAvailable ? -1 : 1)
        };
      });

      // Pass currentStatus so API knows what to toggle FROM (or TO, depending on impl)
      // axios expects currentStatus to flip it to !currentStatus
      const response = await apiToggleAvailability(bookId, currentStatus);

      console.log('✅ Availability toggled:', response);

      return {
        success: true,
        message: 'Availability updated! 🔄'
      };

    } catch (err) {
      console.error('❌ Failed to toggle availability:', err);

      // Rollback on error - Force refresh to reset both books and stats
      setRefreshTrigger(prev => prev + 1);

      return {
        success: false,
        error: err.message || 'Failed to update availability'
      };
    }
  };

  const refreshBooks = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const searchBooks = async (query) => {
    try {
      if (!query || query.trim() === '') {
        // If query is empty, reload default paginated books
        loadBooks();
        return;
      }

      setLoading(true);
      console.log('🔍 Searching books for:', query);

      const response = await searchBookByTitle(query);

      if (response.status === 'success') {
        let results = response.data;

        // ✅ Apply All Active Filters Client-Side

        // 1. Availability
        if (filters.availability === 'unavailable') {
          results = results.filter(book => !book.isAvailable);
        }

        // 2. Image
        if (filters.image === 'no-image') {
          results = results.filter(book => !book.image);
        }

        // 3. Sort
        if (filters.sort === 'most-viewed') {
          results.sort((a, b) => (b.views || 0) - (a.views || 0));
        }

        console.log(`✅ Search results (Filtered):`, results.length);
        setBooks(results);
        // Reset pagination for search results
        setTotalItems(results.length);
        setTotalPages(1);
      } else {
        setBooks([]);
        setTotalItems(0);
      }
      setLoading(false);

    } catch (err) {
      console.error('❌ Search failed:', err);
      setError(err.message || 'Search failed');
      setLoading(false);
    }
  };

  return {
    books,
    stats,
    isLoading: loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    toggleAvailability,
    refreshBooks,
    searchBooks, // Export search function
    // Pagination
    page,
    totalPages,
    totalItems,
    changePage,
    // Filter controls
    filters,
    updateFilter: (key, value) => {
      setSearchParams(prev => {
        prev.set(key, value);
        prev.set("page", "1"); // Reset to page 1
        return prev;
      });
    }
  };
}