import React, { useState } from 'react';
import BookForm from '../components/books/BookForm';

/**
 * ✅ ADD BOOK PAGE - PRODUCTION READY
 * 
 * WHAT WAS FIXED:
 * ❌ OLD: Called API internally + via callback (duplicate calls)
 * ✅ NEW: Only validates data and passes to parent component
 * 
 * FLOW:
 * 1. User fills form
 * 2. Validate required fields
 * 3. Clean empty fields
 * 4. Pass to parent via onBookAdded callback
 * 5. Parent handles API call + dashboard refresh
 * 6. Show success/error message
 * 7. Close form and reset
 */
const AddBook = ({ isOpen, onClose, onBookAdded }) => {
  
  // ===============================
  // FORM STATE - Matched to Backend Schema
  // ===============================
  const [formData, setFormData] = useState({
    title: '',              // Required
    description: '',        // Optional
    author: '',            // Optional
    department: '',        // Required (enum)
    isbn: '',              // Optional (but unique if provided)
    publisher: '',         // Optional
    edition: '',           // Optional
    cover_url: '',         // Optional
    copies: [],            // Optional (array of strings)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ===============================
  // RESET FORM
  // ===============================
  const resetForm = () => {
    setFormData({
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
    setError(null);
  };

  // ===============================
  // ✅ HANDLE SUBMIT - FIXED
  // ===============================
  const handleSubmit = async () => {
    // Step 1: Validate required fields
    if (!formData.title || !formData.department) {
      setError('Title and Department are required!');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Step 2: Clean data - remove empty fields
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => {
          if (Array.isArray(v)) return v.length > 0;
          return v !== '' && v !== null && v !== undefined;
        })
      );

      console.log('📝 AddBook: Submitting clean data:', cleanData);

      // Step 3: ✅ FIXED - Pass to parent, let parent handle API + refresh
      if (onBookAdded) {
        const result = await onBookAdded(cleanData);
        
        console.log('📝 AddBook: Result from parent:', result);

        // Step 4: Handle result
        if (result && result.success) {
          alert('✅ Book added successfully!');
          resetForm();
          onClose();
        } else {
          setError(result?.error || 'Failed to add book. Please try again.');
        }
      } else {
        setError('No callback provided. Contact developer.');
      }
      
    } catch (err) {
      console.error('❌ AddBook: Error during submit:', err);
      setError(err.message || 'Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===============================
  // HANDLE CANCEL
  // ===============================
  const handleCancel = () => {
    if (isSubmitting) return; // Prevent cancel during submission
    
    // Ask for confirmation if form has data
    const hasData = Object.values(formData).some(v => 
      Array.isArray(v) ? v.length > 0 : v !== ''
    );
    
    if (hasData) {
      if (!window.confirm('Are you sure? All entered data will be lost.')) {
        return;
      }
    }
    
    resetForm();
    onClose();
  };

  // ===============================
  // RENDER
  // ===============================
  
  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 mt-10 border-2 border-blue-500">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Add New Book</h2>
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
          <p>Adding book to library...</p>
        </div>
      )}

      {/* Book Form Component */}
      <BookForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isSubmitting ? 'Adding Book...' : 'Add Book'}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default AddBook;