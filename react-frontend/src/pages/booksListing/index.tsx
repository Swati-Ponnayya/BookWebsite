import { Link, useParams } from "react-router-dom";
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
  const [isFilterOpen, setIsFilterOpen] = useState(true);

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
      <div className="flex flex-col">
        {/* Filters */}
        <div
          className={`flex flex-wrap items-center justify-start md:justify-evenly gap-4 text-[#764932] bg-[#FCF9DC] p-4 w-full ${
            isFilterOpen ? "flex" : "hidden"
          }`}
        >
          <div className="w-full sm:w-auto">
            <label className="text-lg font-medium block pb-4 ">Filters</label>
          </div>

          {slug === "all-books" && (
            <div className="w-full sm:w-[48%] md:w-72">
              <SelectField
                labelPosition="left"
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={categoryOptions}
              />
            </div>
          )}

          <div className="w-full sm:w-[48%] md:w-72">
            <InputField
              labelPosition="left"
              label="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="w-[48%] md:w-72">
            <InputField
              labelPosition="left"
              label="Min Price"
              type="number"
              value={minPrice}
              min={0}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
          </div>

          <div className="w-[48%] md:w-72">
            <InputField
              labelPosition="left"
              label="Max Price"
              type="number"
              value={maxPrice}
              min={0}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto  mb-4 ">
            <button
              onClick={applyFilters}
              className="py-2 px-4 bg-[#764932] text-[#FCF9DC] rounded-lg hover:shadow-md font-semibold"
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              className="py-2 px-4 border border-[#764932] text-[#764932] rounded-lg hover:shadow-md font-semibold"
            >
              Clear
            </button>
          </div>
        </div>

        <div
          className={`grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-28 py-6 `}
        >
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Link
                to={`/book-details/${book.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                state={book}
              >
                <div
                  key={book.id}
                  className="bg-white rounded-lg overflow-hidden transition-all duration-300 hover:translate-y-2 hover:shadow-lg border border-[#CEA882]"
                >
                  <div className="relative bg-[#D1D7E5] rounded-t-lg overflow-hidden">
                    <div className="aspect-square relative py-4">
                      <img
                        src={book.bookCoverImageUrl}
                        alt={book.title}
                        className="w-full h-full object-contain bg-[#D1D7E5]"
                      />
                    </div>
                  </div>
                  <div className="p-6  text-[#764932]">
                    <h3 className="text-lg font-semibold mt-2 truncate">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      by {book.authorName}
                    </p>
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
              </Link>
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
