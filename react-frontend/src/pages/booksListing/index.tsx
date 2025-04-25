import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookService, { Book } from "../../services/BookServices";
import Pagecover from "../../components/Pagecover";
import { Menu, X } from "lucide-react";
import { InputField, SelectField } from "../../components/formComponent";

const BookListing = () => {
  const { slug } = useParams(); // Get the dynamic slug from the URL
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minRating, setMinRating] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    BookService.getBooksBySlug(slug)
      .then((res) => {
        setBooks(res);
        setFilteredBooks(res);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [slug]); // Re-run when `slug` changes

  const formatSlug = (text) => {
    return text
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const applyFilters = () => {
    let updatedBooks = books.filter(
      (book) =>
        (category
          ? book.category.toLowerCase().includes(category.toLowerCase())
          : true) &&
        (author
          ? book.authorName.toLowerCase().includes(author.toLowerCase())
          : true) &&
        book.originalPrice >= minPrice &&
        book.originalPrice <= maxPrice
      // book.rating >= minRating
    );
    setFilteredBooks(updatedBooks);
  };

  const clearFilters = () => {
    setCategory("");
    setAuthor("");
    setMinPrice(0);
    setMaxPrice(10000);
    setMinRating(0);
    setFilteredBooks(books);
  };

  const categoryOptions = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "History",
    "Romance",
    "Mystery",
    "Biography",
    "Children",
    "Fantasy",
    "Self-Help",
  ];

  return (
    <div className="">
      <Pagecover title={formatSlug(slug)} />
      <button
        className="md:hidden flex items-center px-4 py-2 bg-[#764932] text-[#FCF9DC] rounded-lg my-6 mx-4"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        {isFilterOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}{" "}
        Filters
      </button>
      <div className="flex">
        {/* Filters */}
        <div
          className={`flex flex-col  text-[#764932] bg-[#FCF9DC] px-5 pt-4 sticky top-28  md:block w-3/12 ${
            isFilterOpen ? "block" : "hidden"
          }`}
          style={{ height: "100vh", maxHeight: "calc(100vh - 7rem)" }}
        >
          <div className="flex flex-col justify-center ">
            <label className="text-xl font-medium  mb-1 items-center">
              Filters
            </label>
          </div>
          {slug && slug === "all-books" ? (
            <SelectField
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categoryOptions}
            />
          ) : (
            ""
          )}
         
          <InputField
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <InputField
            label="Min Price"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
          <InputField
            label="Max Price"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
          {/* <InputField
            label="Min Rating"
            type="number"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          /> */}
          <div className="flex flex-col justify-between items-center md:my-4 lg:my-6 gap-6 lg:gap-5">
            <button
              onClick={applyFilters}
              className=" md:py-2 md:px-2 lg:py-3 lg:px-4 bg-[#764932] w-full text-[#FCF9DC] rounded-lg hover:shadow-md shadow-[#764932] transition font-semibold"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className=" md:py-2 md:px-2 lg:py-3 lg:px-4 border w-full border-[#764932]  text-[#764932] rounded-lg transition font-semibold hover:shadow-md shadow-[#764932]"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div
          className={`grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-9 w-full `}
        >
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                className="h-fit rounded-lg overflow-hidden transition-all duration-300 hover:translate-y-2 hover:shadow-2xl border border-[#CEA882]"
              >
                <div className="relative bg-[#D1D7E5] rounded-t-lg overflow-hidden">
                  <div className="aspect-square relative">
                    <img
                      src={book.bookCoverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-6  text-[#764932]">
                  <h3 className="text-lg font-semibold mt-2 truncate">
                    {book.title}
                  </h3>
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
                          <span className="text-green-600 text-sm">
                            ({book.discount}%)
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-lg">
                          ₹ {book.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm flex-nowrap">
                      ⭐{" "}
                      <span className="font-bold text-base ml-1">
                        {(book.rating ?? 0).toFixed(1)}
                      </span>{" "}
                      / 5
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 items-center text-center w-full">
              No books found for "{formatSlug(slug)}".
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookListing;
