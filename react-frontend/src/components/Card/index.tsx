import { Edit, Star } from "lucide-react";

export const BookCard = ({ book, viewMode, user }) => (
  <div
    className={`border border-[#CEA882] ${
      viewMode === "card"
        ? "rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:-translate-y-1"
        : ""
    }`}
  >
    <div className="relative h-48 bg-[#D1D7E5] flex items-center justify-center">
      <div className="aspect-square relative  py-2">
        <img
          src={book.bookCoverImageUrl}
          alt={book.title}
          className="w-full h-full object-contain"
        />
      </div>
      {/* <div
          className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(
            book.status
          )}`}
        >
          {book.status}
        </div> */}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-[#875332] truncate">{book.title}</h3>
      <p className="text-sm text-gray-600">by {book.authorName}</p>
      <div className="flex justify-between items-center mt-3 flex-wrap">
        <div className="flex items-center flex-nowrap">
          {book.discount ? (
            <>
              <span className="font-bold text-base">
                ₹{" "}
                {(
                  book.originalPrice -
                  (book.originalPrice * book.discount) / 100
                ).toFixed(0)}
              </span>
              <span className="text-gray-500 line-through mx-1 text-sm">
                ₹ {book.originalPrice.toFixed(0)}
              </span>
              <span className="text-green-600 text-sm">({book.discount}%)</span>
            </>
          ) : (
            <span className="font-bold text-lg">₹ {book.originalPrice}</span>
          )}
        </div>
        {user == true ? (
          <div className="flex items-center text-sm flex-nowrap">
            <Star fill="#FFD700" stroke="#FFD700" size={18} />
            <span className="font-bold text-base ml-1">
              {(book.rating ?? 0).toFixed(1)}
            </span>{" "}
            / 5
          </div>
        ) : (
          <>
            <div className="flex items-center text-sm flex-nowrap">
              <span className="text-sm bg-[#FCF9DC] px-2 py-1 rounded">
                Qty: {book.qty}
              </span>
            </div>
            <button className="mt-3 w-full bg-[#8E6547] text-white px-3 py-1 rounded flex items-center justify-center">
              <Edit size={16} className="mr-1" /> Edit
            </button>
          </>
        )}
      </div>
    </div>
  </div>
);
