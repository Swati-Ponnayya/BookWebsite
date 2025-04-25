const Footer = () => {
    return (
      <footer className="bg-[#764932] text-[#FCF9DC] pt-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Brand & Description */}
          <div>
            <h2 className="text-xl font-bold">Bookish</h2>
            <p className="text-sm mt-2">
              Your one-stop shop for books that inspire, entertain, and educate. Browse thousands of titles, anytime.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/categories" className="hover:underline">Categories</a></li>
              <li><a href="/bestsellers" className="hover:underline">Best Sellers</a></li>
              <li><a href="/new-arrivals" className="hover:underline">New Arrivals</a></li>
              <li><a href="/deals" className="hover:underline">Today's Deals</a></li>
            </ul>
          </div>
  
          {/* Help & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Help & Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:underline">About Us</a></li>
              <li><a href="/contact" className="hover:underline">Contact Us</a></li>
              <li><a href="/faq" className="hover:underline">FAQs</a></li>
              <li><a href="/returns" className="hover:underline">Return Policy</a></li>
            </ul>
          </div>
  
          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex space-x-4 text-lg">
              <a href="#" className="hover:text-gray-300">📘</a> {/* Facebook */}
              <a href="#" className="hover:text-gray-300">🐦</a> {/* Twitter */}
              <a href="#" className="hover:text-gray-300">📸</a> {/* Instagram */}
              <a href="#" className="hover:text-gray-300">🎥</a> {/* YouTube */}
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
  