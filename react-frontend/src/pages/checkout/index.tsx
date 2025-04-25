import React, { useState } from "react";

const ProceedToBuy = () => {
  const cartItems = [
    {
      id: 1,
      title: "The Great Gatsby",
      price: 359,
      quantity: 1,
      image: "/assets/books/book1.jpg",
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      price: 299,
      quantity: 2,
      image: "/images/mockingbird.jpg",
    },
    {
        id: 1,
        title: "The Great Gatsby",
        price: 359,
        quantity: 1,
        image: "/assets/books/book1.jpg",
      },
      {
        id: 2,
        title: "To Kill a Mockingbird",
        price: 299,
        quantity: 2,
        image: "/images/mockingbird.jpg",
      },  {
        id: 1,
        title: "The Great Gatsby",
        price: 359,
        quantity: 1,
        image: "/assets/books/book1.jpg",
      },
      {
        id: 2,
        title: "To Kill a Mockingbird",
        price: 299,
        quantity: 2,
        image: "/images/mockingbird.jpg",
      },
  ];

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryCharge = 40;
  const taxes = 50;
  const finalTotal = totalPrice + taxes + deliveryCharge - discount;

  const applyPromo = () => {
    if (promoCode === "BOOKISH10") {
      setDiscount(50);
    } else {
      setDiscount(0);
      alert("Invalid promo code");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Order Placed Successfully!");
  };

  const [user, setUser] = useState({
    name: "Mitchel Hasan Parves",
    email: "mitchel@example.com",
    phone: "9876543210",
    address: "123, Book Street, Bangalore, India",
    city: "Bangalore",
    state: "Karnataka",
    zip: "560001",
  });

  return (
    <div className="w-full py-6 bg-[#FCF9DC]">
      <div className="max-w-6xl mx-auto my-10 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Section: Checkout Details */}
        <div className="bg-white p-6 rounded-lg shadow w-full">
          <h2 className="text-2xl font-bold text-[#764932] mb-4">
            Delivery Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg w-full"
              placeholder="Full Name"
            />
            <input
              type="text"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg w-full"
              placeholder="Mobile Number"
            />
          </div>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full mt-3 p-3 border border-gray-300 rounded-lg"
            placeholder="Email Address"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <input
              type="text"
              value={user.city}
              onChange={(e) => setUser({ ...user, city: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg w-full"
              placeholder="City"
            />
            <input
              type="text"
              value={user.state}
              onChange={(e) => setUser({ ...user, state: e.target.value })}
              className="p-3 border border-gray-300 rounded-lg w-full"
              placeholder="State"
            />
          </div>
          <input
            type="text"
            value={user.zip}
            onChange={(e) => setUser({ ...user, zip: e.target.value })}
            className="w-full mt-3 p-3 border border-gray-300 rounded-lg"
            placeholder="ZIP Code"
          />
          <input
            type="text"
            value={user.address}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            className="w-full mt-3 p-3 border border-gray-300 rounded-lg"
            placeholder="Address"
          />

          {/* Payment Method */}
          <h3 className="text-xl font-semibold text-[#764932] mt-4">
             Payment Method
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {["upi", "net_banking", "credit_card", "cod"].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`p-3 border rounded-lg ${
                  paymentMethod === method
                    ? "border-[#764932] font-bold"
                    : "border-gray-300"
                }`}
              >
                {method === "upi"
                  ? "UPI (Google Pay, PhonePe, Paytm)"
                  : method === "net_banking"
                  ? "Net Banking"
                  : method === "credit_card"
                  ? "Debit/Credit Card"
                  : "Cash on Delivery (COD)"}
              </button>
            ))}
          </div>
          {/* Card Details (if Debit/Credit Card is selected) */}
          {paymentMethod === "credit_card" && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Cardholder Name"
                className="w-full p-3 border border-gray-300 rounded-lg mb-2"
              />
              <input
                type="text"
                placeholder="Card Number"
                className="w-full p-3 border border-gray-300 rounded-lg mb-2"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-1/2 p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-1/2 p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}
          {/* Place Order Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-[#875332] text-white px-6 py-3 mt-6 rounded-lg text-lg font-semibold hover:bg-[#764932]"
          >
            Pay ₹{finalTotal}
          </button>
        </div>

        {/* Right Section: Shopping Cart & Price Summary */}
        <div className="bg-white p-6 rounded-lg shadow w-full h-full flex flex-col">
          <h2 className="text-2xl font-bold text-[#764932] mb-6">
             Shopping Cart
          </h2>
          <div className="">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center border-b py-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 rounded-lg"
                />
                <div className="ml-4 flex-1">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Promo Code */}
          <div className="mt-4 flex">
            <input
              type="text"
              placeholder="Promo Code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-l-lg"
            />
            <button
              onClick={applyPromo}
              className="bg-[#875332] text-white px-4 rounded-r-lg"
            >
              Apply
            </button>
          </div>

          {/* Price Summary (Added Back) */}
          <div className="mt-4 text-lg">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & GST:</span>
              <span>₹{taxes}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Discount:</span>
              <span>-₹{discount}</span>
            </div>
            <div className="flex justify-between font-bold text-xl mt-2">
              <span>Total:</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProceedToBuy;
