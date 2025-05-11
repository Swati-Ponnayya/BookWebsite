import { Heart, HeartIcon, Star, StarHalf } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import BookServices, { Book } from "../../services/BookServices";

export const BookDetailsPage = () => {
  const { bookSlug } = useParams();
  const [book, setBook] = useState<Book>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const location = useLocation();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
    if (!showFullDescription && descriptionRef.current) {
      // scroll to description on expand
      descriptionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const fetchBook = async () => {
    try {
      const matchedBook = location?.state;
      setBook(matchedBook);
      BookServices.getLikedBooks().then((res) => {
        console.log(res);
        setIsLiked(res.filter((data) => data.id == matchedBook.id));
      });
    } catch (error) {
      console.error("Failed to fetch book:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (book.qty <= 0) {
      alert("Sorry, this book is out of stock.");
      return;
    }

    try {
      // Send request to the backend to add the book to the user's cart
      const response = await BookServices.updateCartItemQuantity(book.id, 1);
    } catch (error) {
      alert("An error occurred while adding the book to the cart.");
      console.error(error);
    }
  };

  const toggleLike = () => {
    setIsLiked((prev) => !prev);
    console.log(book.id);
    BookServices.toggleLikeBook(book.id)
      .then((message) => {
        console.log(message); // "Book liked" or "Book unliked"
        // optionally refresh state
      })
      .catch((err) => {
        alert("Failed to like/unlike book.");
      });

    // You can also call your backend like API.toggleLike(book.id)
  };

  useEffect(() => {
    fetchBook();
  }, [bookSlug]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} fill="#FFD700" stroke="#FFD700" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} fill="#FFD700" stroke="#FFD700" />);
      } else {
        stars.push(<Star key={i} stroke="#FFD700" />);
      }
    }
    return stars;
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!book) return <p className="p-4 text-red-600">Book not found.</p>;

  return (
    <div className="bg-[#FCF9DC] text-[#764932] p-6 md:p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 md:flex gap-6">
        <div className="w-full md:w-1/3">
          <img
            src={book.bookCoverImageUrl}
            alt={book.title}
            className="rounded-lg w-full object-cover"
          />
        </div>

        <div className="w-full md:w-2/3 space-y-2 mt-6 md:mt-0">
          <div className="w-full flex justify-between">
            {" "}
            <div className="flex items-center gap-5">
              <h1 className="text-3xl font-bold">{book.title}</h1>|
              <p className="text-base">
                <span className="font-semibold">Published:</span>{" "}
                {new Date(book.publishDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>{" "}
            <button onClick={toggleLike}>
              {isLiked ? (
                <Heart fill="#ff3e3e" stroke="#ff3e3e" />
              ) : (
                <HeartIcon stroke="#764932" />
              )}
            </button>
          </div>

          <p className="text-base font-semibold">by {book.authorName}</p>

          <div className="flex items-center text-2xl flex-nowrap gap-2">
            <div className="flex">{renderStars(book.rating)}</div>
            <span className="font-bold text-xl">
              {book?.rating?.toFixed(1)} / 5
            </span>
          </div>

          <div className="text-lg font-semibold my-4 flex items-center gap-3">
            {book.discount ? (
              <>
                <span className="font-bold text-4xl">
                  ₹
                  {(
                    book.originalPrice -
                    (book.originalPrice * book.discount) / 100
                  ).toFixed(0)}
                </span>
                <span className="text-gray-500 line-through text-sm">
                  ₹ {book.originalPrice.toFixed(0)}
                </span>
                <span className="text-green-600 text-sm">
                  ({book.discount}%)
                </span>
              </>
            ) : (
              <span className="font-bold text-lg">₹ {book.originalPrice}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-[#764932] text-[#FCF9DC] px-6 py-2 rounded-lg font-semibold hover:shadow-md transition"
          >
            Add to Cart
          </button>

          <p
            ref={descriptionRef}
            className={`text-base leading-relaxed mt-4 transition-all duration-300 ${
              showFullDescription ? "" : "line-clamp-8"
            }`}
          >
            {book.description}
          </p>

          <button
            onClick={toggleDescription}
            className="mt-2 text-sm text-[#764932] font-semibold underline hover:text-[#5b331a]"
          >
            {showFullDescription ? "Show less" : "Show more"}
          </button>
        </div>
      </div>
    </div>
  );
};
