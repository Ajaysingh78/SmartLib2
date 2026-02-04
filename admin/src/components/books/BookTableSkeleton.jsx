import React from "react";

const BookTableSkeleton = () => {
  // Generate 5 skeleton rows
  const skeletonRows = Array(5).fill(0);

  const columns = [
    { label: "Cover", width: "w-[8%]" },
    { label: "Title", width: "w-[22%]" },
    { label: "Author", width: "w-[15%]" },
    { label: "Department", width: "w-[10%]" },
    { label: "ISBN", width: "w-[15%]" },
    { label: "Views", width: "w-[8%]" },
    { label: "Status", width: "w-[12%]" },
    { label: "Actions", width: "w-[10%]" },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
      {/* Table Header Skeleton */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>

      {/* Table Skeleton */}
      <div className="w-full">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`px-4 py-3 text-left ${col.width}`}>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {skeletonRows.map((_, index) => (
              <tr key={index}>
                {/* Cover */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-12 w-8 bg-gray-200 rounded"></div>
                </td>

                {/* Title */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </td>

                {/* Author */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </td>

                {/* Department */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </td>

                {/* ISBN */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </td>

                {/* Views */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </td>

                {/* Status */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex space-x-3">
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookTableSkeleton;
