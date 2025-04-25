import { ShoppingCart, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cart from "../cart";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef();
  const location = useLocation();
  // Check login status on mount
  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setShowProfileMenu(false);
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
  const commonButtonStyles =
    "px-4 py-1 text-sm bg-[#FCF9DC] rounded-md text-[#764932] hover:shadow-md shadow-[#8E6547] hover:-translate-y-0.5 transition-all duration-200";

  return (
    <header className="sticky top-0 z-20">
      <div className="bg-[#F8DAAB] text-[#764932] py-2">
        <div className="mx-auto px-4 flex justify-end items-center text-sm">
          <div className="flex gap-5 justify-between">
            <Link to="/about" className="hover:opacity-60 transition text-xs">
              About Us
            </Link>
            <div className="h-4 w-[1px] bg-[#764932]"></div>
            <Link to="/contact" className="hover:opacity-60 transition text-xs">
              Contact Us
            </Link>
            <div className="h-4 w-[1px] bg-[#764932]"></div>
            <Link to="/faq" className="hover:opacity-60 transition text-xs">
              FAQ
            </Link>
            <div className="h-4 w-[1px] bg-[#764932]"></div>
            <Link
              to="/return-policy"
              className="hover:opacity-60 transition text-xs"
            >
              Return Policy
            </Link>
          </div>
        </div>
      </div>

      <nav className="flex justify-between items-center p-4 shadow-md bg-[#764932]">
        {/* Logo and Navigation */}
        <div className="flex justify-between gap-5 text-[#FCF9DC]">
          <div className="text-xl font-bold">
            <Link to="/" className="flex items-center gap-5">
              <img src="/assets/logo4.png" alt="" className="h-10" />
            </Link>
          </div>

          <div className="hidden md:flex gap-5 items-center">
            <div className="relative group">
              <p className="hover:text-[#CEA882]">Books</p>
              <div className="absolute left-0 hidden w-40 bg-[#764932] shadow-md group-hover:block">
                {categoryOptions.map((category) => (
                  <Link
                    key={category}
                    to={`/books/${category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block px-4 py-2 hover:text-[#CEA882]"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/books/bestsellers" className="hover:text-[#CEA882]">
              Best Sellers
            </Link>
            <Link to="/books/new-arrivals" className="hover:text-[#CEA882]">
              New Arrivals
            </Link>
            <Link to="/books/todays-deal" className="hover:text-[#CEA882]">
              Today's Deals
            </Link>
            {role === "SELLER" ? (
              <Link to="/seller" className="hover:text-[#CEA882]">
                My Inventory
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3" ref={profileRef}>
          {isLoggedIn ? (
            <>
              <button onClick={() => setIsCartOpen(true)}>
                <ShoppingCart size={24} color="#F8DAAB" />
              </button>
              <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

              <div className="relative">
                <button onClick={() => setShowProfileMenu((prev) => !prev)}>
                  <User size={24} color="#F8DAAB" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                    <Link to={"/settings"}>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100  rounded-md "
                        onClick={() => {
                          setShowProfileMenu(false);
                        }}
                      >
                        Settings
                      </button>
                    </Link>
                    <Link to={"/order"}>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100  rounded-md "
                        onClick={() => {
                          setShowProfileMenu(false);
                        }}
                      >
                        Order History
                      </button>
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100  rounded-md "
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                className={commonButtonStyles}
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className={commonButtonStyles}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
