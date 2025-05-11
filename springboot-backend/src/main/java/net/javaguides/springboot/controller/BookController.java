package net.javaguides.springboot.controller;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import net.javaguides.springboot.model.Book;
import net.javaguides.springboot.model.BookResponseDTO;
import net.javaguides.springboot.model.User;

import net.javaguides.springboot.repository.BookRepository;
import net.javaguides.springboot.repository.UserRepository;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.util.StringUtils;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1")
public class BookController {
	@Autowired
    private final BookRepository bookRepository;
    @Autowired
    private UserRepository userRepository;

    
    // Constructor-based dependency injection
    public BookController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }
    
    
    @Value("${file.upload-dir}")
    private String uploadDir;

    
    // Upload the file
    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Clean the filename to avoid security issues
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());

            // Define the upload path
            Path uploadPath = Paths.get(uploadDir);

            // Create directory if it does not exist
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Define the file path and save the file
            Path filePath = uploadPath.resolve(fileName);
            file.transferTo(filePath);

            return "File uploaded successfully: " + fileName;
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to upload file.";
        }
    }
    
    
    
    
    @GetMapping("/books")
    public List<BookResponseDTO> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        List<BookResponseDTO> responseList = new ArrayList<>();

        for (Book book : books) {
            BookResponseDTO dto = new BookResponseDTO();
            dto.setId(book.getId());
            dto.setTitle(book.getTitle());
            dto.setBookCoverImage(book.getBookCoverImage());

            if (book.getBookCoverImage() != null && !book.getBookCoverImage().isEmpty()) {
                String imageUrl = "http://localhost:8080/uploaded_images/" + book.getBookCoverImage();
                dto.setBookCoverImageUrl(imageUrl);
                System.out.println("Image URL: " + imageUrl);  // Log the URL for debugging
            } else {
                dto.setBookCoverImageUrl(null);
                System.out.println("No image found for book: " + book.getTitle());  // Log if no image is found
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
            responseList.add(dto);
        }

        return responseList;
    }





    @PostMapping("/add-books")
    public ResponseEntity<?> createBook(@RequestParam("book") String bookJson,
                                        @RequestParam("bookCoverImage") MultipartFile bookCoverImage) {
        // Parse the book object from the JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        Book book;
        try {
        	book = objectMapper.readValue(bookJson, Book.class);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to parse book JSON: " + e.getMessage());
        }

        // Fetch user by email
        Optional<User> userOpt = userRepository.findByEmail(book.getCreatedByEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid user email: " + book.getCreatedByEmail());
        }

        User user = userOpt.get();
        book.setCreatedBy(user.getId());
        book.setModifiedBy(user.getId());

        // Handle file upload and store the file
        if (bookCoverImage.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file uploaded for book cover.");
        }

        String fileName = bookCoverImage.getOriginalFilename();
	     // Ensure the upload directory exists
	     Path uploadPath = Paths.get(uploadDir);

        try {
        	 if (!Files.exists(uploadPath)) {
        	        Files.createDirectories(uploadPath);  
        	    }

        	    // Save the file
        	    Path targetLocation = uploadPath.resolve(fileName);
        	    Files.copy(bookCoverImage.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        	    book.setBookCoverImage(fileName);  
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        }

        // Save the book entity
        Book savedBook = bookRepository.save(book);

        return ResponseEntity.ok(savedBook);
    }


    @PostMapping("/update-book")
    public ResponseEntity<?> updateBook(@RequestParam("bookId") Long bookId,
                                        @RequestParam("book") String bookJson,
                                        @RequestParam(value = "bookCoverImage", required = false) MultipartFile bookCoverImage)
{
        // Parse the book object from the JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        Book book;
        try {
            book = objectMapper.readValue(bookJson, Book.class);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to parse book JSON: " + e.getMessage());
        }

        // Fetch existing book by ID
        Optional<Book> existingBookOpt = bookRepository.findById(bookId);
        if (existingBookOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found with ID: " + bookId);
        }

        Book existingBook = existingBookOpt.get();

        // Update fields
        existingBook.setTitle(book.getTitle());
        existingBook.setAuthorName(book.getAuthorName());
        existingBook.setOriginalPrice(book.getOriginalPrice());
        existingBook.setDiscount(book.getDiscount());
        existingBook.setQty(book.getQty());
        existingBook.setPublishDate(book.getPublishDate());
        existingBook.setDescription(book.getDescription());
        existingBook.setCategory(book.getCategory());
        existingBook.setModifiedBy(book.getModifiedBy());  // Assuming this field is passed in JSON

        // Handle file upload if new book cover is provided
        if (bookCoverImage != null && !bookCoverImage.isEmpty()) {
            String fileName = bookCoverImage.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);

            try {
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // Delete the old file (if it exists) and save the new one
                Path oldFilePath = uploadPath.resolve(existingBook.getBookCoverImage());
                if (Files.exists(oldFilePath)) {
                    Files.delete(oldFilePath);
                }

                // Save the new file
                Path targetLocation = uploadPath.resolve(fileName);
                Files.copy(bookCoverImage.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                existingBook.setBookCoverImage(fileName);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
            }
        }

        // Save the updated book entity
        Book updatedBook = bookRepository.save(existingBook);

        return ResponseEntity.ok(updatedBook);
    }

    
    
    
    @GetMapping("/books/{slug}")
    public List<BookResponseDTO> getBooksBySlug(@PathVariable String slug, @RequestParam(required = false) String category) {
        List<Book> books;

        switch (slug.toLowerCase()) {
            case "top-books":
                books = bookRepository.findTopBooks();
                break;
            case "category":
                if (category != null && !category.isEmpty()) {
                    books = bookRepository.findByCategoryIgnoreCase(category);
                    break;
                }
                books = bookRepository.findAll();
                break;
            case "new-arrivals":
                books = bookRepository.findNewArrivals();
                break;
            case "todays-deal":
                books = bookRepository.findBooksByDiscountDesc();
                break;
            case "all-books":
                books = bookRepository.findAll();
                break;
            default:
                books = bookRepository.findByCategoryIgnoreCase(slug);
                break;
        }

        return books.stream().map(book -> {
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

        List<BookResponseDTO> responseList = new ArrayList<>();
        for (Book book : books) {
            BookResponseDTO dto = new BookResponseDTO();
            dto.setId(book.getId());
            dto.setTitle(book.getTitle());
            dto.setBookCoverImage(book.getBookCoverImage());

            // Dynamically create the image URL for the book
            if (book.getBookCoverImage() != null && !book.getBookCoverImage().isEmpty()) {
                String imageUrl = "http://localhost:8080/uploaded_images/" + book.getBookCoverImage();
                dto.setBookCoverImageUrl(imageUrl);
                System.out.println("Image URL: " + imageUrl); 
            } else {
                dto.setBookCoverImageUrl(null); // No image if no file uploaded
                System.out.println("No image found for book: " + book.getTitle());
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

            responseList.add(dto);
        }

        return ResponseEntity.ok(responseList);
    }

}
