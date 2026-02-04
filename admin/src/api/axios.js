// src/api/axios.js

const API_BASE_URL = 'https://smartlib-xgxi.onrender.com';

// ------------------------------------------------------------------
// 🌐 MAIN API CALL FUNCTION
// ------------------------------------------------------------------
const apiCall = async (endpoint, options = {}) => {
  // Headers set karo
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // ✅ CRITICAL FIX: credentials: 'include' REMOVED
  // Backend wildcard CORS ke saath credentials work nahi karta
  const config = {
    method: options.method || 'GET',
    headers: headers,
    // credentials: 'include', // REMOVED - caused CORS error
    ...(options.body && { body: JSON.stringify(options.body) }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Khaas 401 Error ke liye check
      if (response.status === 401) {
        console.error("❌ Unauthorized! Token missing or expired.");
      }
      throw new Error(data.message || data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ------------------------------------------------------------------
// 🔑 AUTHENTICATION FUNCTIONS
// ------------------------------------------------------------------

export const adminLogin = async (email, password) => {
  console.log("🔑 Logging in...");
  
  try {
    const data = await apiCall('/admin/login', {
      method: 'POST',
      body: { email, password },
    });
    
    if (data.status === 'success') {
      console.log("✅ Login Success!");
      
      // Backend cookie me token bhejta hai
      // Browser automatically handle karega
      
      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.setItem('adminData', JSON.stringify(data.data || data));
    }
    
    return data;
  } catch (error) {
    console.error("❌ Login failed:", error);
    throw error;
  }
};

export const adminLogout = () => {
  // Sab kuch saaf karo
  localStorage.removeItem('isAdminLoggedIn');
  localStorage.removeItem('adminData');
  
  window.location.reload(); // Page refresh to reset state
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAdminLoggedIn') === 'true';
};

// ------------------------------------------------------------------
// 📚 BOOK FUNCTIONS
// ------------------------------------------------------------------

export const addBook = async (bookData) => {
  console.log("📚 Adding book...");
  return await apiCall('/add/one', {
    method: 'POST',
    body: bookData,
  });
};

export const updateBook = async (bookId, updateData) => {
  console.log("✏️ Updating book...");
  
  return await apiCall(`/update/book/${bookId}`, {
    method: 'PATCH',
    body: updateData,
  });
};

export const searchBookByTitle = async (title) => {
  return await apiCall(`/search/book?title=${encodeURIComponent(title)}`);
};

/**
 * 📚 Get ALL books
 * ✅ WORKAROUND: Multiple searches to get max data
 */
export const getAllBooks = async () => {
  console.log('🔍 Fetching all books...');
  
  const searchTerms = ['a', 'e', 'i', 'o', 't', 'b', 'c', 's', 'r', 'n'];
  const bookMap = new Map();
  
  for (const term of searchTerms) {
    try {
      const response = await searchBookByTitle(term);
      if (response?.data && Array.isArray(response.data)) {
        response.data.forEach(book => {
          const bookId = book._id || book.id;
          if (bookId && !bookMap.has(bookId)) {
            bookMap.set(bookId, book);
          }
        });
      }
    } catch (err) {
      console.warn(`Search "${term}" failed:`, err.message);
    }
  }
  
  const allBooks = Array.from(bookMap.values());
  console.log(`✅ Collected ${allBooks.length} unique books`);
  
  return {
    status: 'success',
    data: allBooks
  };
};

export const incrementBookViews = async (bookId) => {
  return await apiCall(`/update/book/views/${bookId}`, {
    method: 'PATCH',
  });
};

export const deleteBook = async (bookId) => {
  // Uncomment below if backend supports DELETE
  // return await apiCall(`/delete/book/${bookId}`, { method: 'DELETE' });

  console.warn('⚠️ Delete API not implemented in frontend yet');
  return Promise.resolve({ 
    status: 'success', 
    message: 'Book deleted (frontend only - refresh will bring it back)' 
  });
};

export const toggleBookAvailability = async (bookId) => {
  console.warn('⚠️ Toggle API not implemented');
  return Promise.resolve({ 
    status: 'success', 
    message: 'Toggled (frontend only)' 
  });
};

export const DEPARTMENTS = [
  "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", 
  "MBA", "MCA", "BBA", "BCA", "B.COM", "B.SC", 
  "B.PHARM", "B.ARCH", "B.DES", "B.ED", "B.LLB", 
  "B.PT", "B.HM", "B.MS", "B.AS", "B.FA", "B.FT"
];