import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#764932] text-[#FCF9DC] pt-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Brand & Description */}
        <div>
          <h2 className="text-xl font-bold">Bookish</h2>
          <p className="text-sm mt-2">
            Your one-stop shop for books that inspire, entertain, and educate.
            Browse thousands of titles, anytime.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/books/bestsellers" className="hover:underline">
                Best Sellers
              </Link>
            </li>
            <li>
              <Link to="/books/new-arrivals" className="hover:underline">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/books/deals" className="hover:underline">
                Today's Deals
              </Link>
            </li>
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Help & Support</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:underline">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:underline">
                Return Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4 text-lg">
            <Link to="#" className="hover:text-gray-300">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link to="#" className="hover:text-gray-300">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link to="#" className="hover:text-gray-300">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link to="#" className="hover:text-gray-300">
              <Youtube className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-6 border-t border-[#FCF9DC]/40 pt-4">
        © {new Date().getFullYear()} Bookish. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
