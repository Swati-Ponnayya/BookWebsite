package net.javaguides.springboot.controller;
import net.javaguides.springboot.model.Book;
import net.javaguides.springboot.model.Cart;
import net.javaguides.springboot.model.CartItem;
import net.javaguides.springboot.model.User;
import net.javaguides.springboot.repository.BookRepository;
import net.javaguides.springboot.repository.CartItemRepository;
import net.javaguides.springboot.repository.CartRepository;
import net.javaguides.springboot.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class CartController {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add-cart/{bookId}")
    public ResponseEntity<?> updateCartItemQuantity(@PathVariable Long bookId,
                                                    @RequestBody Map<String, Integer> requestBody,
                                                    @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User not authenticated.");
        }

        String email = userDetails.getUsername();
        Optional<User> optionalUser = userRepository.findByEmail(email);  // Use your JPA repo to fetch actual User
        if (!optionalUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
        }

        User user = optionalUser.get();
        Integer quantityChange = requestBody.get("quantity");

        if (quantityChange == null || quantityChange == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid quantity change.");
        }

        Optional<Book> optionalBook = bookRepository.findById(bookId);
        if (!optionalBook.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found.");
        }

        Book book = optionalBook.get();
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> cartRepository.save(new Cart(user)));

        Optional<CartItem> existingItem = cartItemRepository.findByCartAndBook(cart, book);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantityChange;

            if (newQuantity <= 0) {
                cartItemRepository.delete(item);
                book.setQty(book.getQty() + item.getQuantity());
                bookRepository.save(book);
            } else {
                item.setQuantity(newQuantity);
                cartItemRepository.save(item);
                book.setQty(book.getQty() - quantityChange);
                bookRepository.save(book);
            }
        } else {
            if (quantityChange < 0) {
                return ResponseEntity.badRequest().body("Cannot reduce quantity for an item not in cart.");
            }

            if (book.getQty() < quantityChange) {
                return ResponseEntity.badRequest().body("Not enough stock.");
            }

            CartItem newItem = new CartItem(cart, book, quantityChange);
            cartItemRepository.save(newItem);
            book.setQty(book.getQty() - quantityChange);
            bookRepository.save(book);
        }

        return ResponseEntity.ok("Cart updated successfully.");
    }


    
    @GetMapping("/cart")
    public ResponseEntity<List<CartItemDTO>> getCartItems(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Now the rest of your logic can remain the same
        Cart cart = cartRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItemDTO> cartItemDTOs = new ArrayList<>();
        for (CartItem cartItem : cart.getCartItems()) {
            Book book = cartItem.getBook();

            String imageUrl = null;
            if (book.getBookCoverImage() != null && !book.getBookCoverImage().isEmpty()) {
                imageUrl = "http://localhost:8080/uploaded_images/" + book.getBookCoverImage();
            }

            cartItemDTOs.add(new CartItemDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthorName(),
                book.getOriginalPrice(),
                cartItem.getQuantity(),
                imageUrl
            ));
        }

        return ResponseEntity.ok(cartItemDTOs);
    }


    // Data Transfer Object (DTO) for cart item response
    public static class CartItemDTO {
        private Long id;
        private String title;
        private String author;
        private double price;
        private int quantity;
        private String image;

        // Constructor, Getters, and Setters
        public CartItemDTO(Long id, String title, String author, double price, int quantity, String image) {
            this.id = id;
            this.title = title;
            this.author = author;
            this.price = price;
            this.quantity = quantity;
            this.image = image;
        }

        // Getters and Setters...
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getAuthor() {
            return author;
        }

        public void setAuthor(String author) {
            this.author = author;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }
    }
}
