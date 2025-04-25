import React, { useState } from "react";
import { Search } from "lucide-react";
import Slider from "react-slick";

const BookOrganizerHero = () => {
  const [books, setBooks] = useState([
    {
      id: 64,
      title: "Blind Book Date_64",
      image: "/assets/books/book1.jpg",
      currentPrice: 359,
      originalPrice: 399,
      discount: 10,
    },
    {
      id: 63,
      title: "Blind Book Date_63",
      image: "/assets/books/book2.jpg",
      currentPrice: 359,
      originalPrice: 399,
      discount: 10,
    },
    {
      id: 62,
      title: "Blind Book Date_62",
      image: "/assets/books/book3.jpg",
      currentPrice: 359,
      originalPrice: 399,
      discount: 10,
    },
  ]);

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
        breakpoint: 768, // Mobile devices (<= 768px)
        settings: {
          slidesToShow: 2, // Show 1 slide
        },
      },
    ],
  };
  

  return (
    <div
      className="w-full h-full bg-right-bottom md:bg-cover"
      style={{ backgroundImage: "url('/assets/herobg5.png')" }}
    >
      {/* Main Content */}
      <div className="flex flex-col md:flex-row ml-16 px-4  py-10">
        {/* Left Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center text-[#764932]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl leading-snug md:leading-[1.2] font-bold my-4">
            Inspiring Stories, Endless <br />
            Adventures, <br />
            Delivered to You!
          </h1>

          <p className="mb-4 text-sm sm:text-base md:text-lg">
            "Your Digital Library, Always Within Reach"
          </p>

          {/* Search Box */}
          <div className="relative w-full sm:w-3/4 md:w-2/3 mb-6">
            <input
              type="text"
              placeholder="Search for books, authors, or genres..."
              className="w-full py-3 px-4 pr-12 border border-[#8E6547]/80 rounded-md focus:outline-none focus:ring-1"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search size={20} className="text-[#8E6547]" />
            </div>
          </div>
        </div>

        {/* Right Content - Bookshelf Illustration */}
        <div className="w-full md:w-1/2 flex justify-center  md:mt-0">
          <div className="w-full sm:w-2/4 md:w-4/5">
            <Slider {...settings}>
              {books.map((book) => (
                <div key={book.id} className="px-2 lg:px-6">
                  <div className="rounded-lg overflow-hidden group">
                    {/* Book Cover */}
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-[200px] sm:h-[220px] md:h-[300px]  object-contain rounded-lg"
                      />

                      {/* Hover Effect */}
                      <div className="absolute bottom-0 left-0 w-full bg-[#CEA882]/70 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3">
                        <h3 className="text-sm font-semibold text-white text-center">
                          {book.title}
                        </h3>
                        <div className="flex items-center justify-center mt-2 text-xs">
                          <span className="font-bold text-white">
                            ₹ {book.currentPrice}
                          </span>
                          <span className="text-gray-300 line-through mx-2">
                            ₹ {book.originalPrice}
                          </span>
                          <span className="text-green-400">
                            ({book.discount}% off)
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
