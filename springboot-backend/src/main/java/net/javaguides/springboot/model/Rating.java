package net.javaguides.springboot.model;

import jakarta.persistence.*;


@Entity
@Table(name = "ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(nullable = false)
    private int rating; // Rating out of 5

    public Rating() {
    }

    public Rating(User user, Book book, int rating) {
        this.user = user;
        this.book = book;
        this.rating = rating;
    }

    // Getters and Setters
}
