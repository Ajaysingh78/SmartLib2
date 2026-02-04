import { useState, useEffect, useCallback } from 'react';
import {
  getAllBooks,
  addBook as apiAddBook,
  updateBook as apiUpdateBook,
  deleteBook as apiDeleteBook,
  toggleBookAvailability as apiToggleAvailability,
} from '../api/axios';

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Loading books...');

      const response = await getAllBooks();
      
      console.log('📦 API Response:', response);

      if (response?.status === 'success' && response?.data) {
        // Sort by views (highest first)
        const sortedBooks = [...response.data].sort((a, b) => 
          (b.views || 0) - (a.views || 0)
        );
        
        console.log('✅ Loaded', sortedBooks.length, 'books');
        setBooks(sortedBooks);
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
  }, [refreshTrigger]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

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
      
      // Optimistic update
      setBooks(prevBooks => 
        prevBooks.map(book =>
          (book._id || book.id) === bookId 
            ? { ...book, isAvailable: !book.isAvailable } 
            : book
        )
      );
      
      const response = await apiToggleAvailability(bookId);
      
      console.log('✅ Availability toggled:', response);
      
      return { 
        success: true,
        message: 'Availability updated! 🔄'
      };
      
    } catch (err) {
      console.error('❌ Failed to toggle availability:', err);
      
      // Rollback on error
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

  return {
    books,
    isLoading: loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    toggleAvailability,
    refreshBooks,
  };
}