package net.javaguides.springboot.controller;

import net.javaguides.springboot.dto.OrderHistoryDTO;
import net.javaguides.springboot.dto.OrderHistoryDTO.OrderItemDTO;
import net.javaguides.springboot.dto.OrderRequestDTO;
import net.javaguides.springboot.model.*;
import net.javaguides.springboot.repository.BookRepository;
import net.javaguides.springboot.repository.CartItemRepository;
import net.javaguides.springboot.repository.CartRepository;
import net.javaguides.springboot.repository.OrderRepository;
import net.javaguides.springboot.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;


    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@AuthenticationPrincipal Object principal,
                                             @RequestBody OrderRequestDTO orderRequest) {
        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            email = (String) principal;
        } else {
            throw new RuntimeException("Invalid user");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order(user, "PENDING");

        for (OrderRequestDTO.OrderItemDTO itemDTO : orderRequest.getItems()) {
            Book book = bookRepository.findById(itemDTO.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));

            OrderItem item = new OrderItem(order, book, itemDTO.getQuantity(), itemDTO.getPrice());
            order.addOrderItem(item);
        }

        Order savedOrder = orderRepository.save(order);

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(new Cart(user)));
        
        List<Long> orderedBookIds = orderRequest.getItems()
                .stream()
                .map(OrderRequestDTO.OrderItemDTO::getBookId)
                .collect(Collectors.toList());

        List<CartItem> cartItems = cartItemRepository.findByCart(cart); 


        for (CartItem item : cartItems) {
            if (orderedBookIds.contains(item.getBook().getId())) {
                cartItemRepository.delete(item);
            }
        }

        return ResponseEntity.ok(savedOrder);
    }


    @GetMapping("/history")
    public ResponseEntity<List<OrderHistoryDTO>> getOrderHistory(@AuthenticationPrincipal Object principal) {
        // Extract email
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            email = (String) principal;
        } else {
            throw new RuntimeException("Invalid user");
        }

        // Get user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch all orders (without filtering by status)
        List<Order> orders = orderRepository.findByUserId(user.getId());

        // Map orders to DTOs
        List<OrderHistoryDTO> orderHistory = orders.stream()
            .map(order -> {
                List<OrderItemDTO> items = order.getOrderItems().stream().map(item -> {
                    Book book = item.getBook();
                    return new OrderItemDTO(
                        book.getId(),
                        book.getTitle(),
                        book.getAuthorName(),
                        order.getStatus(), // Pass order status here
                        Long.valueOf(item.getQuantity()),
                        book.getOriginalPrice()
                    );
                }).collect(Collectors.toList());

                return new OrderHistoryDTO(order.getId(), items);
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(orderHistory);
    }
    
    @GetMapping("/top-selling-books")
    public ResponseEntity<List<Book>> getTopSellingBooks() {
        List<Order> completedOrders = orderRepository.findByStatus("COMPLETED");

        Map<Book, Long> bookSalesMap = new HashMap<>();

        for (Order order : completedOrders) {
            for (OrderItem item : order.getOrderItems()) {
                Book book = item.getBook();
                bookSalesMap.put(book, bookSalesMap.getOrDefault(book, 0L) + item.getQuantity());
            }
        }

        List<Book> topSellingBooks = bookSalesMap.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // Set createdByEmail and createdByFullName
        for (Book book : topSellingBooks) {
            if (book.getCreatedBy() != null) {
                Optional<User> userOpt = userRepository.findById(book.getCreatedBy());
                userOpt.ifPresent(user -> {
                    book.setCreatedByEmail(user.getEmail());
                    book.setCreatedByFullName(user.getFullName());
                });
            }
        }

        return ResponseEntity.ok(topSellingBooks);
    }

    
    @GetMapping("/sales-stats")
    public ResponseEntity<SalesStatsDTO> getSalesStats() {
        List<Order> completedOrders = orderRepository.findByStatus("COMPLETED");

        long totalBooksSold = 0;
        double totalRevenue = 0.0;

        for (Order order : completedOrders) {
            for (OrderItem item : order.getOrderItems()) {
                totalBooksSold += item.getQuantity();
                totalRevenue += item.getQuantity() * item.getPrice();
            }
        }

        SalesStatsDTO stats = new SalesStatsDTO(totalBooksSold, totalRevenue);
        return ResponseEntity.ok(stats);
    }

    private static class SalesStatsDTO {
        private long totalBooksSold;
        private double totalRevenue;

        public SalesStatsDTO(long totalBooksSold, double totalRevenue) {
            this.totalBooksSold = totalBooksSold;
            this.totalRevenue = totalRevenue;
        }

        public long getTotalBooksSold() {
            return totalBooksSold;
        }

        public double getTotalRevenue() {
            return totalRevenue;
        }
    }


  
}
