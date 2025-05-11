package net.javaguides.springboot.controller;

import net.javaguides.springboot.model.Book;
import net.javaguides.springboot.model.User;
import net.javaguides.springboot.model.BookResponseDTO;
import net.javaguides.springboot.repository.BookRepository;
import net.javaguides.springboot.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1")
public class LikedBooksController {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public LikedBooksController(UserRepository userRepository, BookRepository bookRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @PostMapping("/like-book/{bookId}")
    public ResponseEntity<?> toggleLikeBook(@PathVariable Long bookId,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (user.getLikedBooks() == null) {
            user.setLikedBooks(new HashSet<>());
        }

        if (user.getLikedBooks().contains(book)) {
            user.getLikedBooks().remove(book);
        } else {
            user.getLikedBooks().add(book);
        }

        userRepository.save(user);

        return ResponseEntity.ok("Book like status updated");
    }

    
    @GetMapping("/liked-books")
    public ResponseEntity<List<BookResponseDTO>> getLikedBooks(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<Book> books = user.getLikedBooks();

        List<BookResponseDTO> dtos = books.stream().map(book -> {
            BookResponseDTO dto = new BookResponseDTO();
            dto.setId(book.getId());
            dto.setTitle(book.getTitle());
            dto.setBookCoverImage(book.getBookCoverImage());

            if (book.getBookCoverImage() != null && !book.getBookCoverImage().isEmpty()) {
                String imageUrl = "http://localhost:8080/uploaded_images/" + book.getBookCoverImage();
                dto.setBookCoverImageUrl(imageUrl);
            } else {
                dto.setBookCoverImageUrl(null);
            }

            dto.setOriginalPrice(book.getOriginalPrice());
            dto.setDiscount(book.getDiscount());
            dto.setPublishDate(book.getPublishDate());
            dto.setAuthorName(book.getAuthorName());
            dto.setCategory(book.getCategory());
            dto.setRating(book.getRating());
            dto.setDescription(book.getDescription());
            dto.setCreatedBy(book.getCreatedBy());
            dto.setCreatedDate(book.getCreatedDate());
            dto.setModifiedBy(book.getModifiedBy());
            dto.setModifiedDate(book.getModifiedDate());
            dto.setQty(book.getQty());
            dto.setCreatedByEmail(book.getCreatedByEmail());
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }


    
}
