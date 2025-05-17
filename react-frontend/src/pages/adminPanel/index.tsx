import { useEffect, useState } from "react";
import {
  getSalesData,
  getTopsellingBook,
  getUserList,
} from "../../services/UserServices";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";

// Reusable InfoBox component
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
    className="flex-1 bg-white hover:bg-[#F8DAAB]/40 cursor-pointer transition-all duration-200 p-6 rounded-2xl shadow-md"
  >
    <h3 className="text-xl font-semibold text-[#8E6547]">{label}</h3>
    <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
  </div>
);

const AdminDashboard = () => {
  // Dummy data (replace with API data)
  const [totalUsers, settotalUsers] = useState(0);
  const [totalSellers, settotalSellers] = useState(0);
  const [totalBooksSold, settotalBooksSold] = useState(0);
  const [totalRevenue, settotalRevenue] = useState(0);
  const [TopSellingBook, setTopSellingBook] = useState([]);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const userlist = await getUserList();
      const salesData = await getSalesData();
      const topbooks = await getTopsellingBook();
      console.log(topbooks.data);
      userlist.data.map((res) => {
        if (res.role == "SELLER") {
          settotalSellers(res.list);
        } else if (res.role == "CUSTOMER") {
          settotalUsers(res.list);
        }
      });
      settotalBooksSold(salesData.data.totalBooksSold);
      settotalRevenue(salesData.data.totalRevenue);
      setTopSellingBook(topbooks.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const booksPerPage = 10;
  const totalPages = Math.ceil(TopSellingBook.length / booksPerPage);
  const filteredBooks = TopSellingBook.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="p-8 bg-[#FCF9DC] min-h-screen">
      <h1 className="text-3xl font-bold text-[#8E6547] mb-8">
        Admin Dashboard
      </h1>

      {/* Info boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <InfoBox
          label="Total Users"
          value={totalUsers?.length}
          onClick={() => console.log("Show user list")}
        />
        <InfoBox
          label="Total Sellers"
          value={totalSellers?.length}
          onClick={() => console.log("Show seller list")}
        />
        <InfoBox
          label="Books Sold"
          value={totalBooksSold}
          onClick={() => console.log("Show sold books")}
        />
        <InfoBox label="Revenue" value={totalRevenue} />
      </div>

      {/* Top Selling Books */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 mt-5 mb-8 justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#8E6547] ">
            Top Selling Books
          </h2>
          <div className="relative w-full md:w-2/12">
            <input
              type="text"
              placeholder="Search By Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#8E6547] rounded-md w-full"
            />
            <div className="absolute left-3 top-3 text-[#8E6547]">
              <BookOpen size={16} />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-[#8E6547] border-b border-[#CEA882]">
                {[
                  { label: "Title", key: "title" },
                  { label: "Author", key: "authorName" },
                  { label: "Quantity", key: "qty" },
                  { label: "Price", key: "discountedPrice" }, // you'll need to calculate this
                  // { label: "Price", key: "originalPrice" },
                  // { label: "Discount", key: "discount" },
                  { label: "Seller", key: "createdByFullName" },
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
                          {sortOrder === "desc" && <ChevronDown size={14} />}
                        </>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentBooks?.map((book) => (
                <tr key={book.id} className="border-b border-[#CEA882]">
                  <td className="py-3 px-2">{book.title}</td>
                  <td className="py-3 px-2">{book.authorName}</td>
                  <td className="py-3 px-2">{book.qty}</td>
                  <td className="py-3 px-2 ">
                    <>
                      <span className="text-base">
                        ₹
                        {(
                          book.originalPrice -
                          (book.originalPrice * book.discount) / 100
                        ).toFixed(0)}
                      </span>
                      <span className="text-gray-500 line-through mx-1 text-xs">
                        ₹ {book.originalPrice.toFixed(0)}
                      </span>
                      <span className="text-green-600 text-xs">
                        ({book.discount}%)
                      </span>
                    </>
                  </td>
                  {/* <td className="py-3 px-2">{book.originalPrice.toFixed(0)}</td>
                  <td className="py-3 px-2">{book.discount?.toFixed(0)}</td> */}
                  <td className="py-3 px-2">{book.createdByFullName}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
