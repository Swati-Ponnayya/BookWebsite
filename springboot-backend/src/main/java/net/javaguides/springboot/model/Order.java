package net.javaguides.springboot.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private Set<OrderItem> orderItems = new HashSet<>();

    @Column(nullable = false)
    private String status; // PENDING, SHIPPED, DELIVERED, CANCELLED

    public Order() {
    }

    public Order(User user, String status) {
        this.user = user;
        this.status = status;
    }

    // Getters and Setters
}
