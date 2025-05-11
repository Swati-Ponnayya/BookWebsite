import { useEffect } from "react";
import { getSalesData, getTopsellingBook, getUserList } from "../../services/UserServices";

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
  const totalUsers = 1200;
  const totalSellers = 80;
  const totalBooksSold = 5400;
  const totalRevenue = "₹8.2L";

  const topSellingBooks = [
    {
      title: "Atomic Habits",
      author: "James Clear",
      sold: 1230,
      image: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg",
    },
    {
      title: "The Psychology of Money",
      author: "Morgan Housel",
      sold: 980,
      image: "https://m.media-amazon.com/images/I/71g2ednj0JL.jpg",
    },
    {
      title: "Rich Dad Poor Dad",
      author: "Robert T. Kiyosaki",
      sold: 860,
      image: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg",
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUserList();
        const salesData = await getSalesData();
        const topbooks = await getTopsellingBook();
        console.log(response, salesData);
        console.log(salesData);
        console.log(topbooks);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUsers();
  });

  return (
    <div className="p-8 bg-[#FCF9DC] min-h-screen">
      <h1 className="text-3xl font-bold text-[#8E6547] mb-8">
        Admin Dashboard
      </h1>

      {/* Info boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <InfoBox
          label="Total Users"
          value={totalUsers}
          onClick={() => console.log("Show user list")}
        />
        <InfoBox
          label="Total Sellers"
          value={totalSellers}
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
        <h2 className="text-2xl font-semibold text-[#8E6547] mb-4">
          Top Selling Books
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {topSellingBooks.map((book, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-md transition"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-16 h-20 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600">by {book.author}</p>
                <p className="text-sm text-[#8E6547] font-medium mt-1">
                  {book.sold} sold
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
