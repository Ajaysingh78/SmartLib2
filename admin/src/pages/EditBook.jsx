import React, { useState, useEffect } from 'react';
import BookForm from '../components/books/BookForm';

/**
 * ✅ EDIT BOOK PAGE - PRODUCTION READY
 * 
 * FIXES APPLIED:
 * 1. ✅ Keep _id separate from formData (don't let it get lost)
 * 2. ✅ Always include _id when submitting to parent
 * 
 * FLOW:
 * 1. Receives book data via props
 * 2. Populates form with existing data
 * 3. User edits fields
 * 4. Validate changes
 * 5. Pass to parent via onBookUpdated callback (WITH _id)
 * 6. Parent handles API call + refresh
 */
const EditBook = ({ isOpen, book, onClose, onBookUpdated }) => {
  
  // ===============================
  // FORM STATE
  // ===============================
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    department: '',
    isbn: '',
    publisher: '',
    edition: '',
    cover_url: '',
    copies: [],
  });

  // ✅ FIX 1: Keep book ID separate so it doesn't get lost
  const [bookId, setBookId] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ===============================
  // POPULATE FORM WHEN BOOK CHANGES
  // ===============================
  useEffect(() => {
    if (book) {
      // ✅ FIX 2: Store ID separately
      setBookId(book._id || book.id);
      
      setFormData({
        title: book.title || '',
        description: book.description || '',
        author: book.author || '',
        department: book.department || '',
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        edition: book.edition || '',
        cover_url: book.cover_url || '',
        copies: book.copies || [],
      });
      setError(null);
    }
  }, [book]);

  // ===============================
  // RESET FORM
  // ===============================
  const resetForm = () => {
    if (book) {
      setBookId(book._id || book.id);
      setFormData({
        title: book.title || '',
        description: book.description || '',
        author: book.author || '',
        department: book.department || '',
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        edition: book.edition || '',
        cover_url: book.cover_url || '',
        copies: book.copies || [],
      });
    }
    setError(null);
  };

  // ===============================
  // ✅ HANDLE SUBMIT - FIXED
  // ===============================
  const handleSubmit = async () => {
    // Validation
    if (!formData.title || !formData.department) {
      setError('Title and Department are required!');
      return;
    }

    // ✅ FIX 3: Check bookId separately
    if (!bookId) {
      setError('Book ID is missing. Cannot update.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Clean data - remove empty fields
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => {
          if (Array.isArray(v)) return v.length > 0;
          return v !== '' && v !== null && v !== undefined;
        })
      );

      // ✅ FIX 4: ALWAYS include _id in the final data
      const dataWithId = {
        _id: bookId,
        ...cleanData
      };

      console.log('✏️ EditBook: Submitting updated data:', dataWithId);

      // ✅ Pass to parent, let parent handle API + refresh
      if (onBookUpdated) {
        const result = await onBookUpdated(dataWithId);
        
        console.log('✏️ EditBook: Result from parent:', result);

        if (result && result.success) {
          alert('✅ Book updated successfully!');
          onClose();
        } else {
          setError(result?.error || 'Failed to update book. Please try again.');
        }
      } else {
        setError('No callback provided. Contact developer.');
      }
      
    } catch (err) {
      console.error('❌ EditBook: Error during submit:', err);
      setError(err.message || 'Failed to update book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===============================
  // HANDLE CANCEL
  // ===============================
  const handleCancel = () => {
    if (isSubmitting) return;
    
    // Check if form was modified
    const hasChanges = book && (
      formData.title !== (book.title || '') ||
      formData.description !== (book.description || '') ||
      formData.author !== (book.author || '') ||
      formData.department !== (book.department || '') ||
      formData.isbn !== (book.isbn || '') ||
      formData.publisher !== (book.publisher || '') ||
      formData.edition !== (book.edition || '') ||
      formData.cover_url !== (book.cover_url || '')
    );
    
    if (hasChanges) {
      if (!window.confirm('Are you sure? All changes will be lost.')) {
        return;
      }
    }
    
    resetForm();
    onClose();
  };

  // ===============================
  // RENDER
  // ===============================
  
  // Don't render if not open or no book selected
  if (!isOpen || !book) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 mt-10 border-2 border-amber-500">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Edit Book</h2>
        </div>
        
        <button
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
          title="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Current Book Info */}
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Editing:</span> {book.title}
          {book.author && ` by ${book.author}`}
          {bookId && <span className="text-xs ml-2">(ID: {bookId})</span>}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start space-x-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Submitting State */}
      {isSubmitting && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center space-x-3">
          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-r-transparent"></div>
          <p>Updating book...</p>
        </div>
      )}

      {/* Book Form Component */}
      <BookForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isSubmitting ? 'Updating...' : 'Update Book'}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default EditBook;