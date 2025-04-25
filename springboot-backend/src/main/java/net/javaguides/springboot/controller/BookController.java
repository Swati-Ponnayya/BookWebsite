package net.javaguides.springboot.controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import net.javaguides.springboot.model.Book;
import net.javaguides.springboot.model.User;

import net.javaguides.springboot.repository.BookRepository;
import net.javaguides.springboot.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1")
public class BookController {

    private final BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;
    
    // Constructor-based dependency injection
    public BookController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Get all books
    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
    
    @PostMapping("/add-books")
    public ResponseEntity<?> createBook(@RequestBody Book book) {
        Optional<User> userOpt = userRepository.findByEmail(book.getCreatedByEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid user email: " + book.getCreatedByEmail());
        }

        User user = userOpt.get();

        book.setCreatedBy(user.getId());
        book.setModifiedBy(user.getId());

        Book savedBook = bookRepository.save(book);

        return ResponseEntity.ok(savedBook);
    }





    @GetMapping("/books/{slug}")
    public List<Book> getBooksBySlug(@PathVariable String slug, @RequestParam(required = false) String category) {
        switch (slug.toLowerCase()) {
            case "top-books":
                return bookRepository.findTopBooks(); // Fetch top-rated books
            case "category":
                if (category != null && !category.isEmpty()) {
                    return bookRepository.findByCategoryIgnoreCase(category); // Fetch books by category
                }
                break;
            case "new-arrivals":
                return bookRepository.findNewArrivals(); // Fetch new arrival books
            case "todays-deal":
                return bookRepository.findBooksByDiscountDesc(); // Fetch books with discounts
            case "all-books":
                return bookRepository.findAll();
            default:
                // Assume any unknown slug is a category slug (e.g., /books/fiction, /books/self-help)
                return bookRepository.findByCategoryIgnoreCase(slug);
        }
        return bookRepository.findAll();
    }

    
    @GetMapping("/created-by")
    public ResponseEntity<?> getBooksByCreatedByEmail(@RequestParam String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with email: " + email);
        }

        Long userId = userOptional.get().getId();
        List<Book> books = bookRepository.findByCreatedBy(userId);

        if (books.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No books found for this user.");
        }

        return ResponseEntity.ok(books);
    }
}
