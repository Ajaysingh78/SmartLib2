// 📁 Location: admin/src/components/books/BookTable.jsx
// ✅ Books Data Table Component - FIXED

import React from "react";
import { BookOpen } from "lucide-react";
import BookTableRow from "./BookTableRow";

/**
 * ✅ FIXED Books Table Component
 *
 * CHANGES:
 * - Fixed key prop: book.id → book._id || book.id
 * - This matches backend MongoDB _id field
 */
function BookTable({
  books,
  totalBooks,
  onToggleAvailability,
  onEditBook,
  onDeleteBook,
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Books Management ({books.length} of {totalBooks})
        </h2>
      </div>

      {/* Table */}
      <div className="w-full">
        <table className="w-full table-fixed divide-y divide-gray-200">
          {/* Table Head */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                Cover
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[22%]">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                Author
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                ISBN
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                Views
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body - ✅ FIXED KEY PROP */}
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <BookTableRow
                key={book._id || book.id} // ✅ FIXED: Use _id from MongoDB
                book={book}
                onToggleAvailability={onToggleAvailability}
                onEdit={onEditBook}
                onDelete={onDeleteBook}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {books.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">
            No books found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}

export default BookTable;
