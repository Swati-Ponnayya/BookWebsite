import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Book } from "../../services/BookServices";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from "react-router-dom";

const BookCarousel = ({ data, title, link }) => {
  const [books, setBooks] = useState<Book[]>([]);

  // Update books state whenever `data` changes
  useEffect(() => {
    setBooks(data);
  }, [data]);
  const navigate = useNavigate();
  // Custom arrow components for Slick
  const NextArrow = ({ onClick }) => (
    <button
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#FCF9DC] rounded-full p-1 shadow-lg"
      onClick={onClick}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#FCF9DC] rounded-full p-1 shadow-lg"
      onClick={onClick}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );

  // Slick settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="w-full px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#764932]">{title}</h2>
        <Link to={`${link}`}>
          {" "}
          <button className="px-4 py-2 text-sm text-[#FCF9DC] bg-[#764932] rounded-md shadow-md hover:shadow-lg transition-all">
            View All
          </button>
        </Link>
      </div>
      <div className="slick-container relative">
        {books.length === 0 ? (
          <p className="text-center text-gray-500">Loading books...</p>
        ) : (
          <Slider {...settings}>
            {books.slice(0, 5).map((book) => (
              <div key={book.id} className="px-3 py-6">
                <Link
                  to={`/book-details/${book.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  state={book}
                >
                  <div className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:translate-y-2 hover:shadow-lg border border-[#CEA882]">
                    <div className="relative bg-[#D1D7E5] rounded-t-lg overflow-hidden">
                      <div className="aspect-square relative">
                        <img
                          src={book.bookCoverImageUrl}
                          alt={book.title}
                          className="w-full h-full object-contain bg-[#D1D7E5]"
                        />
                      </div>
                    </div>

                    <div className="p-4 text-[#764932]">
                      <h3 className="text-lg font-semibold mt-2 truncate">
                        {book.title}
                      </h3>

                      <p className="text-sm text-gray-600">
                        by {book.authorName}
                      </p>
                      <div className="flex items-center mt-2">
                        {book.discount ? (
                          <>
                            <span className="font-bold">
                              ₹{" "}
                              {(
                                book.originalPrice -
                                (book.originalPrice * book.discount) / 100
                              ).toFixed(0)}
                            </span>
                            <span className="text-gray-500 line-through mx-2">
                              ₹ {book.originalPrice.toFixed(0)}
                            </span>
                            <span className="text-green-600">
                              ({book.discount}%)
                            </span>
                          </>
                        ) : (
                          <span className="font-bold">
                            ₹ {book.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default BookCarousel;
