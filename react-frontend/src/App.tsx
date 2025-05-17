import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import HomePage from "./pages/homepage";
import BookListing from "./pages/booksListing";
import BookManagement from "./pages/seller";
import Orders from "./pages/order";
import Login from "./pages/login";
import SignUp from "./pages/SignUp";
import SettingPage from "./pages/userProfile";
import ProceedToBuy from "./pages/checkout";
import { useState } from "react";
import { BookDetailsPage } from "./pages/bookDetailsPage";
import LikedBooksPage from "./pages/likedBooksPage";
import AdminDashboard from "./pages/adminPanel";
import { ToastContainer } from "react-toastify";

function App() {
  const [authChanged, setAuthChanged] = useState(false); // triggers re-render

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:slug" element={<BookListing />} />
          <Route path="/book-details/:bookSlug" element={<BookDetailsPage />} />

          {/* Protected Route: Seller Only */}
          <Route
            path="/seller"
            element={
              token && role === "SELLER" ? (
                <BookManagement />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/admin-panel"
            element={
              token && role === "ADMIN" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Protected Route: Any Logged-in User */}
          <Route
            path="/order"
            element={token ? <Orders /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={token ? <SettingPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/check-out"
            element={token ? <ProceedToBuy /> : <Navigate to="/login" />}
          />

          <Route
            path="/liked-books"
            element={token ? <LikedBooksPage /> : <Navigate to="/login" />}
          />

          {/* Public Routes */}
          <Route
            path="/login"
            element={<Login onLogin={() => setAuthChanged((prev) => !prev)} />}
          />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <Footer />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
