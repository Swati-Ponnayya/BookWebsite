import React, { useState, useEffect } from "react";
import ordersData from "./ordersData.json"; // Adjust to the path of your JSON data
interface Order {
  id: number;
  name: string;
  author: string;
  quantity: number;
  price: number;
  status: string;
}
const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "current" | "history" | "fulfillment"
  >("current");
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [fulfillmentStatus, setFulfillmentStatus] = useState<Order[]>([]);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  useEffect(() => {
    setCurrentOrders(ordersData.currentOrders);
    setOrderHistory(ordersData.orderHistory);
    setFulfillmentStatus(ordersData.fulfillmentStatus);
  }, []);
  const sortOrders = (data: Order[]) => {
    if (!sortField) return data; // Return unsorted if no field selected
    return [...data].sort((a, b) => {
      const aValue = a[sortField as keyof Order];
      const bValue = b[sortField as keyof Order];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Cycle between: Default → Ascending → Descending → Default
      setSortOrder(
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? null : "asc"
      );
      if (sortOrder === "desc") setSortField(null); // Reset to default
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  const renderOrders = () => {
    let orders: Order[] = [];
    switch (activeTab) {
      case "current":
        orders = currentOrders;
        break;
      case "history":
        orders = orderHistory;
        break;
      case "fulfillment":
        orders = fulfillmentStatus;
        break;
    }
    const sortedOrders = sortOrders(orders);
    return (
      <div className="overflow-x-auto">
               {" "}
        <table className="min-w-full">
                   {" "}
          <thead>
                       {" "}
            <tr className="text-left text-[#8E6547] border-b border-[#CEA882]">
                           {" "}
              {["name", "author", "quantity", "price", "status"].map(
                (field) => (
                  <th
                    key={field}
                    className="pb-3 px-2 text-base cursor-pointer"
                    onClick={() => handleSort(field)}
                  >
                                     {" "}
                    {field.charAt(0).toUpperCase() + field.slice(1)}           
                         {" "}
                    {sortField === field
                      ? sortOrder === "asc"
                        ? " ▲"
                        : " ▼"
                      : ""}
                                   {" "}
                  </th>
                )
              )}
                            <th className="pb-3 px-2 text-base">Actions</th>   
                     {" "}
            </tr>
                     {" "}
          </thead>
                   {" "}
          <tbody>
                       {" "}
            {sortedOrders.map((order) => (
              <tr key={order.id} className="border-b border-[#CEA882]">
                                <td className="py-3 px-2">{order.name}</td>     
                          <td className="py-3 px-2">{order.author}</td>         
                      <td className="py-3 px-2">{order.quantity}</td>           
                    <td className="py-3 px-2">${order.price.toFixed(2)}</td>   
                           {" "}
                <td className="py-3 px-2">
                                   {" "}
                  {/* <p className="w-1/2 px-2 my-auto py-1 rounded-md text-xs text-center font-medium"> */}
                                      {order.status}                 {" "}
                  {/* </p> */}               {" "}
                </td>
                               {" "}
                <td className="py-3 px-2">
                                   {" "}
                  <button className="text-[#8E6547] border border-[#8E6547] bg-white px-2 py-0 rounded flex items-center">
                                        {/* Placeholder for action icon */} ^   
                                 {" "}
                  </button>
                                 {" "}
                </td>
                             {" "}
              </tr>
            ))}
                     {" "}
          </tbody>
                 {" "}
        </table>
             {" "}
      </div>
    );
  };
  const getTabDescription = (tab: string) => {
    switch (tab) {
      case "current":
        return "Here you can view your current orders.";
      case "history":
        return "View past orders and their details here.";
      case "fulfillment":
        return "Monitor the current fulfillment status of your orders.";
      default:
        return "";
    }
  };
  const tabs = [
    { id: "current", label: "Current Orders", count: currentOrders.length },
    { id: "history", label: "Order History", count: orderHistory.length },
    {
      id: "fulfillment",
      label: "Fulfillment Status",
      count: fulfillmentStatus.length,
    },
  ];
  return (
    <div className="min-h-screen flex flex-col px-10 py-10">
           {" "}
      <h1 className="text-2xl font-semibold mb-4 text-[#875332]">Orders</h1>   
       {" "}
      <div className="rounded mb-6">
               {" "}
        <div className="flex border-b border-gray-200">
                   {" "}
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as "current" | "history" | "fulfillment")
              }
              className={`relative py-3 px-6 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "text-[#875332] border-b-2 border-[#875332] font-medium"
                  : "text-gray-600 hover:text-[#875332]"
              } transition-colors duration-200`}
            >
                            <span>{tab.label}</span>             {" "}
              <span
                className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                  activeTab === tab.id
                    ? "bg-[#F8DAAB] text-[#875332]"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                                {tab.count}             {" "}
              </span>
                         {" "}
            </button>
          ))}
                 {" "}
        </div>
               {" "}
        {/* <div className="text-[#8E6547] mt-3 mb-4 text-sm">{getTabDescription(activeTab)}</div> */}
             {" "}
      </div>
            <div className="overflow-x-auto w-full">{renderOrders()}</div>   {" "}
    </div>
  );
};
export default Orders;
