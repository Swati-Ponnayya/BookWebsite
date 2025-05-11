import React, { useEffect, useState } from "react";
import BookServices, { Book } from "../../services/BookServices";
import { BookCard } from "../../components/Card";
import Pagecover from "../../components/Pagecover";

const LikedBooksPage = () => {
  const [likedBooks, setLikedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BookServices.getLikedBooks()
      .then((books) => setLikedBooks(books))
      .catch(() => alert("Failed to load liked books"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full">
      <Pagecover title={"Books You Have Liked"} />
      <div className="p-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : likedBooks.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven't liked any books yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {likedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                viewMode={"card"}
                user={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedBooksPage;
