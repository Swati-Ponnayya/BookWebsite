package net.javaguides.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.javaguides.springboot.model.Book;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
	 List<Book> findByCategoryIgnoreCase(String category);

	    @Query("SELECT b FROM Book b ORDER BY b.rating DESC") 
	    List<Book> findTopBooks(); // Fetch top books (Assuming 'rating' exists)

	    @Query("SELECT b FROM Book b WHERE b.publishDate >= CURRENT_DATE - 30") 
	    List<Book> findNewArrivals(); // Fetch books published in the last 30 days

	    @Query("SELECT b FROM Book b WHERE b.discount IS NOT NULL AND b.discount > 0 ORDER BY b.discount DESC")
	    List<Book> findBooksByDiscountDesc();
	    
	    List<Book> findByCreatedBy(Long createdBy);

}
