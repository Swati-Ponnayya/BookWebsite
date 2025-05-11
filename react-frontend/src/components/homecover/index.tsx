import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Slider from "react-slick";
import { Book } from "../../services/BookServices";
import { Link } from "react-router-dom"; // Import Link for navigation

const BookOrganizerHero = ({ data }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // Track the search input
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]); // Filtered books list

  // Update books state whenever `data` changes
  useEffect(() => {
    setBooks(data);
  }, [data]);

  // Update filtered books based on search query
  useEffect(() => {
    if (searchQuery) {
      const results = books.filter((book) =>
        book.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      setFilteredBooks(results);
    } else {
      setFilteredBooks([]);
    }
  }, [searchQuery, books]);

  // Handle input change for search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const regex = /^[a-zA-Z0-9\s]*$/;
    // Check if the value matches the regex and is within the maxLength
    if (value.length <= 50 && regex.test(value)) {
      setSearchQuery(value); // Set the search query if valid
    }
  };

  // Custom arrow components for Slick
  const NextArrow: React.FC<{
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }> = (props) => {
    const { onClick } = props;
    return (
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg"
        onClick={onClick}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
  };

  const PrevArrow: React.FC<{
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }> = (props) => {
    const { onClick } = props;
    return (
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg"
        onClick={onClick}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
  };

  // Slick settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2, // Default: Show 2 slides
    slidesToScroll: 1,
    autoplay: true, // Enables auto-scroll
    autoplaySpeed: 3000, // Adjust scroll speed (in milliseconds)
    arrows: false, // Hides navigation arrows
    responsive: [
      {
        breakpoint: 1024, // Tablets & below (<= 1024px)
        settings: {
          slidesToShow: 1, // Show 1 slide
        },
      },
      {
        breakpoint: 767, // Mobile devices (<= 768px)
        settings: {
          slidesToShow: 2, // Show 1 slide
        },
      },
    ],
  };

  return (
    <div
      className="w-full h-full md:bg-cover md:bg-bottom bg-right-bottom "
      style={{ backgroundImage: "url('/assets/herobg5.png')" }}
    >
      {/* Main Content */}
      <div className="flex flex-col md:flex-row ml-4 md:ml-16  md:px-4 py-5 md:py-10">
        {/* Left Content */}
        <div className="w-full md:w-1/2 pr-8 flex justify-center flex-col text-[#764932]">
          <h1 className="text-2xl sm:text-4xl md:text-4xl leading-snug md:leading-[1.2] font-bold my-4">
            Inspiring Stories, Endless <br />
            Adventures, <br />
            Delivered to You!
          </h1>
          <div className="">
            <p className="mb-1">"Your Digital Library, Always Within Reach"</p>
          </div>

          {/* Search Box */}
          <div className="my-4 md:my-6 relative w-3/4 md:w-full lg:w-3/4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for books, authors, or genres..."
                value={searchQuery}
                onChange={handleSearchChange}
                maxLength={50} // Limits input to 50 characters
                className="w-full py-3 px-4 pr-12 border border-[#8E6547]/80 rounded-md focus:outline-none focus:ring-1"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search size={20} className="text-[#8E6547]" />
              </div>
            </div>

            {/* Search Suggestions */}
            {filteredBooks.length > 0 && (
              <div
                className="absolute w-full bg-white shadow-md max-h-60 overflow-y-auto z-10 mt-1 rounded-md border"
                style={{ top: "100%" }}
              >
                {filteredBooks.map((book) => (
                  <Link
                    key={book.id}
                    to={`/book-details/${book.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    state={book}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    {book.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Bookshelf Illustration */}
        <div className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[470px] rounded-lg  w-full md:w-1/2 flex justify-center  md:mt-0">
          <div className="w-[300px] sm:w-[400px]  md:w-5/6 pt-8">
            <Slider {...settings}>
              {books.map((book) => (
                <div key={book.id} className="px-3">
                  <div className="rounded-lg overflow-hidden transition-all duration-300  group">
                    {/* Book Cover with Hover Effect */}
                    <div className="relative bg-[#FCF9DC] rounded-t-lg overflow-hidden">
                      <div className="w-full h-1/2 relative">
                        <img
                          src={book.bookCoverImage}
                          alt={book.title}
                          className=" w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] "
                        />
                      </div>

                      {/* Details on Hover (Bottom Half) */}
                      <div className="absolute bottom-0 left-0 w-full h-1/4 text-[#FCF9DC] flex flex-col justify-center bg-[#8E6547] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
                        <h3 className="text-sm font-semibold">{book.title}</h3>
                        <p className="text-sm text-gray-300">
                          by {book.authorName}
                        </p>
                        <div className="flex items-center mt-2 text-xs">
                          <span className="font-bold">
                            ₹{" "}
                            {(
                              book.originalPrice -
                              (book.originalPrice * book.discount) / 100
                            ).toFixed(0)}
                          </span>
                          <span className="text-gray-400 line-through mx-2">
                            ₹ {book.originalPrice}
                          </span>
                          <span className="text-green-400">
                            ({book.discount}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookOrganizerHero;
