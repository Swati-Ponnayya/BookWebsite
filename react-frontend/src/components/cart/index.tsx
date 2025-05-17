import React, { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BookServices from "../../services/BookServices";

const Cart = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch cart items when the cart is open
    if (isOpen) {
      const fetchCartItems = async () => {
        try {
          const response = await BookServices.getCartItem();
          console.log(response);
          setCartItems(response); // Set the cart items state
          setLoading(false);
        } catch (error) {
          console.error("Error fetching cart items:", error);
          setLoading(false);
        }
      };

      fetchCartItems();
    }
  }, [isOpen]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Prevent scrolling when the cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  const handleQuantityChange = async (bookId: any, change: any) => {
    try {
      await BookServices.updateCartItemQuantity(bookId, change);
      const updatedCart = await BookServices.getCartItem(); // Refresh cart
      setCartItems(updatedCart);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-gray-900 z-40 transition-opacity ${
          isOpen ? "opacity-25 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 h-full m-0 bg-[#FCF9DC] shadow-lg z-50 p-6 flex flex-col transform transition-transform 
        w-full md:w-1/2 lg:w-1/3 ${
          isOpen ? "translate-x-0 right-0 " : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4">
          <X size={24} className="text-[#764932]" />
        </button>

        <h2 className="text-2xl font-bold text-[#875332] mb-6">
          Shopping Cart
        </h2>

        <div className="flex-1 overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 px-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center mb-4 bg-white p-4 rounded-lg shadow"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-28 rounded-md"
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-[#764932]">by {item.author}</p>
                  <p className="text-lg font-bold mt-1">₹{item.price}</p>
                  <div className="mt-2 flex items-center bg-[#764932] justify-between">
                    <button
                      className="bg-[#764932] text-white px-4 py-1 rounded-l"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-white border">
                      {item.quantity}
                    </span>
                    <button
                      className="bg-[#764932] text-white px-4 py-1 rounded-r"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="text-red-600 ml-4 hover:text-red-800"
                  onClick={() =>
                    handleQuantityChange(item.id, -item.quantity)
                  }
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Total & Checkout */}
        <div className="mt-6">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>₹{totalPrice.toFixed(0)}</span>
          </div>
          <button
            className="w-full bg-[#875332] text-white px-6 py-3 mt-4 rounded-lg text-lg font-semibold hover:bg-[#764932]"
            onClick={() => {
              navigate("/check-out");
              onClose();
            }}
          >
            Proceed to Buy
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
