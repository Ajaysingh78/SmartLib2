import React, { memo } from "react";
import {
  BookOpen,
  User,
  Calendar,
  Hash,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Branch color mappings
const branchColors = {
  cs: {
    bg: "from-blue-500 to-cyan-500",
    border: "border-blue-500",
    text: "text-blue-600",
  },
  mech: {
    bg: "from-red-500 to-orange-500",
    border: "border-red-500",
    text: "text-red-600",
  },
  civil: {
    bg: "from-yellow-500 to-orange-500",
    border: "border-yellow-500",
    text: "text-yellow-600",
  },
  ece: {
    bg: "from-purple-500 to-pink-500",
    border: "border-purple-500",
    text: "text-purple-600",
  },
  biotech: {
    bg: "from-green-500 to-emerald-500",
    border: "border-green-500",
    text: "text-green-600",
  },
  general: {
    bg: "from-gray-200 to-slate-300",
    border: "border-gray-500",
    text: "text-gray-600",
  },
};

const BookCard = memo(({ book, onClick }) => {
  const branchStyle = branchColors[book.branch] || branchColors.general;

  return (
    <div
      onClick={() => onClick && onClick(book._id)}
      className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-gray-300 shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
    >
      {/* Book Cover Section */}
      <div
        className={`relative h-76 bg-gradient-to-br ${branchStyle.bg} flex items-center justify-center overflow-hidden`}
      >
        {book.bookImage ? (
          <img
            className="h-full object-cover object-center bg-cover"
            src={book?.bookImage}
            alt="book img"
          />
        ) : (
          ""
        )}

        {/* Branch Badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-bold rounded-lg uppercase tracking-wider">
          {book.branch}
        </div>

        {/* Year Badge */}
        <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold rounded-lg">
          Year {book?.year || "NA"}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
            <span className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">
              View Details <ExternalLink className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {book.title}
        </h3>

        <p className="text-xs tracking-wider">{book.desc}</p>

        {/* Author */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4 text-gray-400" />
          <span className="font-medium truncate">{book.author}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100"></div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* ISBN */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
            <Hash className="h-3 w-3" />
            <span className="truncate max-w-[100px]">
              {book.language || "NA"}
            </span>
          </div>

          {/* Availability */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs ${
              book.isAvailable
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {book.isAvailable ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Available
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Issued
              </>
            )}
          </div>
        </div>

        {/* Publisher */}
        {book.publisher && (
          <p className="text-xs text-gray-400 truncate">
            Published by {book.publisher}
          </p>
        )}
      </div>

      {/* Loading Shimmer Effect on Hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
    </div>
  );
});

BookCard.displayName = "BookCard";

export default BookCard;
