import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react"; // Importing the 'Eye' icon from Lucide React
import BookServices from "../../services/BookServices";

interface OrderItem {
  bookId: number;
  name: string;
  author: string;
  status: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: number;
  items: OrderItem[];
}

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");
  const [orderHistory, setOrderHistory] = useState<Order[]>([]); // Renamed to orderList
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // To store selected order for modal

  // Fetch the order history using the BookServices.getOrderHistory
  useEffect(() => {
    BookServices.getOrderHistory().then((res) => {
      console.log(res);
      setOrderHistory(res); // Assuming the response structure is correct
      setIsLoading(false);
    }).catch((error) => {
      console.error("Error fetching order history:", error);
      setIsLoading(false);
    });
  }, []);

  // Function to calculate total quantity and total price for an order
  const calculateOrderTotals = (items: OrderItem[]) => {
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
    return { totalQuantity, totalPrice };
  };

  // Filter orders based on status (for Current Orders and Order History)
  const filterOrdersByStatus = (status: string) => {
    return orderHistory.filter((order) =>
      order.items.some((item) => item.status === status)
    );
  };

  const renderOrders = (orders: Order[]) => {
    return (
      <table className="min-w-full">
        <thead>
          <tr className="text-left text-[#8E6547] border-b border-[#CEA882]">
            <th className="pb-3 px-2 text-base">Order ID</th>
            <th className="pb-3 px-2 text-base">Total Quantity</th>
            <th className="pb-3 px-2 text-base">Total Price</th>
            <th className="pb-3 px-2 text-base">Status</th>
            <th className="pb-3 px-2 text-base">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => {
              // Calculate total quantity and total price for the current order
              const { totalQuantity, totalPrice } = calculateOrderTotals(order.items);

              return (
                <tr key={order.orderId} className="border-b border-[#CEA882]">
                  <td className="py-3 px-2">{order.orderId}</td>
                  <td className="py-3 px-2">{totalQuantity}</td>
                  <td className="py-3 px-2">${totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-2">{order.items[0].status}</td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#8E6547]  border-[#8E6547] bg-white px-2 py-0 rounded"
                    >
                      <Eye size={18} /> {/* Eye icon from Lucide React */}
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-3">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  // Modal to show the order details
  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null;
  
    return (
      <div
        className="fixed inset-0 bg-gray-800/50 flex justify-center items-center"
        onClick={() => setSelectedOrder(null)}
      >
        <div
          className="bg-white p-6 w-3/4 max-w-4xl h-96 overflow-y-auto rounded-md relative"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <button
            onClick={() => setSelectedOrder(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            <X size={24} /> {/* Close button with "X" icon */}
          </button>
  
          <h2 className="text-xl font-semibold text-[#875332] mb-4">Order Details</h2>
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-[#8E6547] border-b border-[#CEA882]">
                <th className="pb-3 px-2 text-base">Book Name</th>
                <th className="pb-3 px-2 text-base">Author</th>
                <th className="pb-3 px-2 text-base">Quantity</th>
                <th className="pb-3 px-2 text-base">Price</th>
                {/* <th className="pb-3 px-2 text-base">Status</th> */}
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-2">{item.name}</td>
                  <td className="py-3 px-2">{item.author}</td>
                  <td className="py-3 px-2">{item.quantity}</td>
                  <td className="py-3 px-2">${item.price.toFixed(2)}</td>
                  {/* <td className="py-3 px-2">{item.status}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "current", label: "Current Orders", count: filterOrdersByStatus("PENDING").length + filterOrdersByStatus("SHIPPED").length },
    { id: "history", label: "Order History", count: filterOrdersByStatus("COMPLETED").length + filterOrdersByStatus("CANCELLED").length },
  ];

  return (
    <div className="min-h-screen flex flex-col px-10 py-10">
      <h1 className="text-2xl font-semibold mb-4 text-[#875332]">Orders</h1>

      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "current" | "history")}
            className={`relative py-3 px-6 ${
              activeTab === tab.id
                ? "text-[#875332] border-b-2 border-[#875332] font-medium"
                : "text-gray-600 hover:text-[#875332]"
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 px-2 py-1 text-xs font-bold rounded-full ${
                activeTab === tab.id ? "bg-[#F8DAAB] text-[#875332]" : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto w-full">
        {activeTab === "current"
          ? renderOrders(filterOrdersByStatus("PENDING").concat(filterOrdersByStatus("SHIPPED")))
          : renderOrders(filterOrdersByStatus("COMPLETED").concat(filterOrdersByStatus("CANCELLED")))}
      </div>

      {renderOrderDetailsModal()}
    </div>
  );
};

export default Orders;
