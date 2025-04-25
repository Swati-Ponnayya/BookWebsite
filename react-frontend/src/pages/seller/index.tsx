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

const BookManagement = () => {
  const useremail = localStorage.getItem("email");
  const emptyBook = {
    title: "",
    bookCoverImage: "",
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
    const { name, value } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: ["originalPrice", "discount", "qty"].includes(name)
        ? parseFloat(value)
        : value,
    }));
  };

  const validate = () => {
    const err = {};
    if (!newBook.title) err.title = "Title is required";
    if (!newBook.bookCoverImage) err.bookCoverImage = "Image URL is required";
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
    if (validate()) handleAddBook(e, newBook);
  };

  const handleModalClose = () => {
    setNewBook(emptyBook);
    setIsModalOpen(false);
  };

  const handleAddBook = async (e, data) => {
    e.preventDefault();
    try {
      await BookServices.addBook(data);
      setNewBook(emptyBook);
      setIsModalOpen(false);
      fetchBooks();
    } catch (err) {}
  };

  return (
    <div className="min-h-screen p-4">
         
      <div className="p-6">
             
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div className="flex gap-6 mt-2">
            <BookInfo
              icon={
                <svg
                  className="w-5 h-5 text-[#764932]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 9l-3 3m0 0l-3-3m3 3V3m9 9a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              }
              label="Books in Stock"
              value={109}
            />
            <div className="h-10 w-px bg-[#764932] mt-1 flex-shrink-0" />
            <BookInfo
              icon={
                <svg
                  className="w-5 h-5 text-[#764932]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m9-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              }
              label="Books Sold"
              value={137}
            />
          </div>
          <button
            className="mt-4 md:mt-0 bg-[#764932] w-1/6 hover:bg-[#8b5a3d] text-white px-4 py-2 rounded-md flex items-center transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} className="mr-2" /> Add Book
          </button>
        </div>
                {/* Search and Filters */}     
        <div className="flex flex-col md:flex-row gap-4 my-8 justify-between items-end">
          <h1 className="text-2xl font-bold text-[#764932]">Book Inventory</h1>
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
                    "Title",
                    "Author",
                    "Quantity",
                    "Discount Price",
                    "Price",
                    "Discount",
                  ].map((field) => (
                    <th
                      key={field}
                      className="pb-3 px-2 text-base cursor-pointer"
                      onClick={() => handleSort(field.toLowerCase())} // Handle sort based on field
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {sortField === field.toLowerCase() &&
                        (sortOrder === "asc" ? (
                          <ChevronUp size={14} className="inline ml-1" />
                        ) : sortOrder === "desc" ? (
                          <ChevronDown size={14} className="inline ml-1" />
                        ) : (
                          <span className="inline ml-1 text-[#CEA882]"></span> // Default state
                        ))}
                    </th>
                  ))}
                  <th className="pb-3 px-2 text-base">Actions</th>
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
                      <button className="text-[#8E6547] bg-white px-2 py-0 rounded flex items-center">
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
       
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-end bg-black/50 py-5 px-4 sm:px-6 md:px-8">
          <div className="bg-white rounded-md w-full md:max-w-xl max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white py-4 px-6 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-xl font-semibold">Add New Book</h2>
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
                <InputField
                  label="Book Cover Image URL"
                  name="bookCoverImage"
                  value={newBook.bookCoverImage}
                  onChange={handleChange}
                  error={errors.bookCoverImage}
                />
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
                    Save
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

const BookInfo = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 flex-col p-4 rounded-md">
    <div className="flex items-center gap-1">
      {icon}
      <div className="flex flex-col">
        <p className="text-base text-[#764932]">{label}</p>
        <span className="text-xl font-bold text-[#764932]">{value}</span>
      </div>
    </div>
  </div>
);

const BookCard = ({ book, viewMode }) => (
  <div
    className={`border border-[#CEA882] ${
      viewMode === "card"
        ? "rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:-translate-y-1"
        : ""
    }`}
  >
    <div className="relative h-48 bg-[#D1D7E5] flex items-center justify-center">
      <div className="aspect-square relative">
        <img
          src={book.bookCoverImage}
          alt={book.title}
          className="w-full h-full object-cover"
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
        <div className="flex items-center text-sm flex-nowrap">
          <span className="text-sm bg-[#FCF9DC] px-2 py-1 rounded">
            Qty: {book.qty}
          </span>
        </div>
      </div>
      <button className="mt-3 w-full bg-[#8E6547] text-white px-3 py-1 rounded flex items-center justify-center">
        <Edit size={16} className="mr-1" /> Edit
      </button>
    </div>
  </div>
);
