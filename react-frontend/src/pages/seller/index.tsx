import React, { useEffect, useState } from "react";
import {
  Plus,
  BookOpen,
  Edit,
  ChevronUp,
  ChevronDown,
  Filter,
  Grid,
  List as ListIcon,
  Ellipsis,
  EllipsisIcon,
} from "lucide-react";
import BookServices, { Book } from "../../services/BookServices";
import { InputField, SelectField } from "../../components/formComponent";
import axios from "axios";
import { BookCard } from "../../components/Card";

const BookManagement = () => {
  const useremail = localStorage.getItem("email");
  const emptyBook = {
    title: "",
    bookCoverImage: null,
    originalPrice: 0,
    discount: 0,
    publishDate: "",
    authorName: "",
    category: "",
    description: "",
    rating: 0,
    createdByEmail: useremail,
    qty: 0,
  };

  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStock, setTotalStock] = useState(0);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [newBook, setNewBook] = useState(emptyBook);

  useEffect(() => {
    if (useremail) fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await BookServices.getBooksByCreatorEmail(useremail);
      setBooks(res);
      let totl = 0;
      res.map((data) => {
        totl += Number(data.qty); // ensures qty is treated as a number
      });
      console.log(totl);

      setTotalStock(totl);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const booksPerPage = viewMode === "list" ? 10 : 8;
  const totalPages = Math.ceil(books.length / booksPerPage);
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (authorFilter ? book.authorName === authorFilter : true)
  );

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (!sortField) return 0;
    if (sortOrder === "asc") return a[sortField] > b[sortField] ? 1 : -1;
    if (sortOrder === "desc") return a[sortField] < b[sortField] ? 1 : -1;
    return 0;
  });

  const currentBooks = sortedBooks.slice(
    currentPage * booksPerPage - booksPerPage,
    currentPage * booksPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "default" : "asc"
      );
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setAuthorFilter("");
  };

  const renderPagination = () => (
    <div className="flex justify-center mt-6">
      <nav>
        <ul className="flex items-center gap-3">
          <li>
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#8E6547] text-white hover:bg-[#6D4C41]"
              }`}
            >
              Prev
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <li key={number}>
              <button
                onClick={() => setCurrentPage(number)}
                className={`px-4 py-2 rounded-md text-sm font-semibold ${
                  currentPage === number
                    ? "bg-[#8E6547] text-white"
                    : "bg-white border border-[#8E6547] text-[#8E6547] hover:bg-[#FCF9DC]"
                }`}
              >
                {number}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#8E6547] text-white hover:bg-[#6D4C41]"
              }`}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );

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

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setNewBook((prev) => ({
      ...prev,
      [name]:
        type === "file"
          ? files[0]
          : ["originalPrice", "discount", "qty"].includes(name)
          ? parseFloat(value)
          : value,
    }));
  };

  const validate = () => {
    const err = {};
    if (!newBook.title) err.title = "Title is required";
    if (!newBook.bookCoverImage) err.bookCoverImage = "Image is required";
    if (newBook.originalPrice <= 0 || newBook.originalPrice > 100000)
      err.originalPrice = "Price must be between 0 and 100000";
    if (newBook.discount < 0 || newBook.discount > 100)
      err.discount = "Discount must be between 0 and 100";
    if (newBook.qty < 1 || newBook.qty > 10000)
      err.qty = "Quantity must be between 1 and 10000";
    if (!newBook.publishDate) err.publishDate = "Publish date is required";
    if (!newBook.authorName) err.authorName = "Author name is required";
    if (!newBook.category) err.category = "Category is required";
    if (!newBook.description) err.description = "Description is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const onSave = (e) => {
    e.preventDefault();
    console.log(newBook);
    if (validate()) {
      if (newBook.id) {
        // Update existing book if an id exists
        handleUpdateBook(e, newBook);
      } else {
        // Add a new book if no id exists
        handleAddBook(e, newBook);
      }
    }
  };

  const handleModalClose = () => {
    setNewBook(emptyBook);
    setIsModalOpen(false);
  };

  const handleAddBook = async (e, data) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        console.error("No token found");
        throw new Error("Authorization token not found.");
      }

      const { bookCoverImage, ...bookData } = data;
      if (!bookCoverImage || !(bookCoverImage instanceof File)) {
        alert("Please upload a valid book cover image.");
        return;
      }

      const formData = new FormData();
      formData.append("book", JSON.stringify(bookData)); // book JSON
      formData.append("bookCoverImage", bookCoverImage);

      const response = await axios.post(
        "http://localhost:8080/api/v1/add-books",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Book submitted successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload book.");
    }
  };

  const handleUpdateBook = async (e, data) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        console.error("No token found");
        throw new Error("Authorization token not found.");
      }

      console.log(data);
      const { bookCoverImage, ...bookData } = data;
      if (
        !bookCoverImage ||
        (typeof bookCoverImage !== "string" &&
          !(bookCoverImage instanceof File))
      ) {
        alert("Please upload a valid book cover image.");
        return;
      }

      let formData = new FormData();
      formData.append("bookId", data.id.toString());
      formData.append("book", JSON.stringify(bookData));
      if (bookCoverImage) {
        formData.append("bookCoverImage", bookCoverImage);
      }

      // Correct way to inspect:
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(
        "http://localhost:8080/api/v1/update-book",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBooks();
      handleModalClose();
      alert("Book Updated successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload book.");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-[#FCF9DC] ">
         
      <div className="p-6">
             
        <div className="flex flex-col-reverse md:flex-row justify-between items-start mb-6">
          <div className="w-full md:w-1/3 gap-6 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <InfoBox label="Books in Stock" value={totalStock} />
              <InfoBox label="Books Sold" value={137} />
            </div>
          </div>
          <button
            className="my-4 md:mt-0 bg-[#764932] w-full md:w-1/6 hover:bg-[#8b5a3d] text-white px-4 py-2 rounded-md flex items-center transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} className="mr-2" /> Add New Book
          </button>
        </div>
         {" "}
        <div className="bg-white px-4 py-2 rounded-2xl">
          {" "}
              {/* Search and Filters */}     
          <div className="flex flex-col md:flex-row gap-4 mt-5 mb-8 justify-between items-end">
            <h1 className="text-2xl font-bold text-[#764932]">
              Book Inventory
            </h1>
            <div className="w-full md:w-6/12 flex flex-col md:flex-row gap-5 md:justify-end">
              <div className="relative w-full md:w-4/12">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-[#8E6547] rounded-md w-full"
                />
                <div className="absolute left-3 top-2.5 text-[#8E6547]">
                  <BookOpen size={16} />
                </div>
              </div>
              <div className="flex border border-[#8E6547] rounded-md overflow-hidden w-auto">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 flex items-center gap-1 ${
                    viewMode === "list"
                      ? "bg-[#8E6547] text-white"
                      : "bg-white text-[#8E6547]"
                  }`}
                >
                  <ListIcon size={16} />
                </button>
                <button
                  onClick={() => setViewMode("card")}
                  className={`px-3 py-2 flex items-center gap-1 ${
                    viewMode === "card"
                      ? "bg-[#8E6547] text-white"
                      : "bg-white text-[#8E6547]"
                  }`}
                >
                  <Grid size={16} />
                </button>
              </div>
            </div>
          </div>
             
          {viewMode === "list" ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-[#8E6547] border-b border-[#CEA882]">
                    {[
                      { label: "Title", key: "title" },
                      { label: "Author", key: "authorName" },
                      { label: "Quantity", key: "qty" },
                      { label: "Discount Price", key: "discountedPrice" }, // you'll need to calculate this
                      { label: "Price", key: "originalPrice" },
                      { label: "Discount", key: "discount" },
                    ].map(({ label, key }) => (
                      <th
                        key={label}
                        className="pb-3 px-2 text-base cursor-pointer select-none"
                        onClick={() => handleSort(key)}
                      >
                        <div className="flex items-center gap-1">
                          {label}
                          {sortField === key && (
                            <>
                              {sortOrder === "asc" && <ChevronUp size={14} />}
                              {sortOrder === "desc" && (
                                <ChevronDown size={14} />
                              )}
                            </>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {currentBooks.map((book) => (
                    <tr key={book.id} className="border-b border-[#CEA882]">
                      <td className="py-3 px-2">{book.title}</td>
                      <td className="py-3 px-2">{book.authorName}</td>
                      <td className="py-3 px-2">{book.qty}</td>
                      <td className="py-3 px-2 ">
                        {(
                          book.originalPrice -
                          (book.originalPrice * book.discount) / 100
                        ).toFixed(0)}
                      </td>
                      <td className="py-3 px-2">
                        {book.originalPrice.toFixed(0)}
                      </td>
                      <td className="py-3 px-2">{book.discount?.toFixed(0)}</td>
                      <td className="py-3 px-2">
                        <button
                          className="text-[#8E6547] bg-white px-2 py-0 rounded flex items-center"
                          onClick={() => {
                            setNewBook(book);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentBooks.map((book) => (
                <BookCard key={book.id} book={book} viewMode={viewMode} />
              ))}
            </div>
          )}
          {totalPages > 1 && renderPagination()}
        </div>
      </div>
         
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-end bg-black/50 py-5 px-4 sm:px-6 md:px-8">
          <div className="bg-white rounded-md w-full md:max-w-xl max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white py-4 px-6 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-xl font-semibold text-[#8E6547]">
                {newBook.id ? "Edit Book" : "Add New Book"}
              </h2>

              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={onSave}>
                <InputField
                  label="Title"
                  name="title"
                  value={newBook.title}
                  onChange={handleChange}
                  error={errors.title}
                />
                {/* <input type="file" name="bookCoverImage" required></input> */}
                <div className="block my-4">
                  {" "}
                  <label className="block">
                    Book Cover Image:{" "}
                    <a
                      href={newBook.bookCoverImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm"
                    >
                      {newBook.bookCoverImageUrl}
                    </a>
                  </label>
                  <div className="text-sm w-full px-3 py-2 border border-[#8E6547] rounded-md">
                    <input
                      type="file"
                      name="bookCoverImage"
                      accept="image/*"
                      onChange={handleChange}
                      required={!newBook?.id}
                    />
                  </div>
                </div>

                <InputField
                  label="Original Price"
                  type="number"
                  name="originalPrice"
                  min={0}
                  max={100000}
                  value={newBook.originalPrice}
                  onChange={handleChange}
                  error={errors.originalPrice}
                />
                <InputField
                  label="Discount (%)"
                  type="number"
                  name="discount"
                  min={0}
                  max={100}
                  value={newBook.discount}
                  onChange={handleChange}
                  error={errors.discount}
                />
                <InputField
                  label="Quantity"
                  type="number"
                  name="qty"
                  min={1}
                  max={10000}
                  value={newBook.qty}
                  onChange={handleChange}
                  error={errors.qty}
                />
                <InputField
                  label="Publish Date"
                  type="date"
                  name="publishDate"
                  value={newBook.publishDate}
                  onChange={handleChange}
                  error={errors.publishDate}
                />
                <InputField
                  label="Author Name"
                  name="authorName"
                  value={newBook.authorName}
                  onChange={handleChange}
                  error={errors.authorName}
                />
                <SelectField
                  label="Category"
                  name="category"
                  value={newBook.category}
                  onChange={handleChange}
                  options={categoryOptions}
                  error={errors.category}
                />
                <InputField
                  label="Description"
                  name="description"
                  type="textarea"
                  value={newBook.description}
                  onChange={handleChange}
                  error={errors.description}
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#8E6547] text-white rounded-md"
                  >
                    {newBook?.id ? "Update" : "Save"}{" "}
                    {/* Change button text based on the mode */}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;

const InfoBox = ({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number | string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex-1 bg-white transition-all duration-200 p-6 rounded-2xl shadow-md"
  >
    <h3 className="text-xl font-semibold text-[#8E6547]">{label}</h3>
    <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
  </div>
);
