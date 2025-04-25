import React, { useEffect, useState } from "react";
import BookServices, { Book } from "../../services/BookServices";
import BookOrganizerHero from "../../components/homecover";
import BookCarousel from "../../components/bookslide";

function HomePage() {
  const [allbooks, setallBooks] = useState<Book[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [allRes, dealsRes] = await Promise.all([
          BookServices.getBooks(),
          BookServices.getBooksBySlug("todays-deal"),
        ]);
        setallBooks(allRes);
        setBooks(dealsRes);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <BookOrganizerHero data={allbooks} />
      <div className="px-10">
        <BookCarousel
          data={allbooks}
          title={"All Books"}
          link={"/books/all-books"}
        />
        {/* <hr className="text-[#D1D7E5] m-8" /> */}
        <BookCarousel
          data={books}
          title={"Today's Deal"}
          link={"/books/todays-deal"}
        />
      </div>
    </>
  );
}

export default HomePage;
