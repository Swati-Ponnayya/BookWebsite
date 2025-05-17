package net.javaguides.springboot.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "book_cover_image", nullable = false)
    private String bookCoverImage;

    @Column(name = "original_price", nullable = false)
    private double originalPrice;

    @Column(name = "discount")
    private Double discount;

    @Column(name = "publish_date")
    private LocalDate publishDate;

    @Column(name = "author_name", nullable = false)
    private String authorName;

    @Column(name = "category")
    private String category;

    @Column(name = "rating")
    private Double rating = 0.0;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "modified_by")
    private Long modifiedBy;

    @Column(name = "modified_date")
    private LocalDateTime modifiedDate;
    
    @Column(name = "qty")
    private Long qty;

    public Book() {
    }

    public Book(String title, String bookCoverImage, double originalPrice, Double discount,
                LocalDate publishDate, String authorName, String category, String description,
                Double rating, Long createdBy, Long modifiedBy, Long qty) {
        this.title = title;
        this.bookCoverImage = bookCoverImage;
        this.originalPrice = originalPrice;
        this.discount = discount;
        this.publishDate = publishDate;
        this.authorName = authorName;
        this.category = category;
        this.description = description;
        this.rating = rating;
        this.createdBy = createdBy;
        this.modifiedBy = modifiedBy;
        this.qty = qty;
    }

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.modifiedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.modifiedDate = LocalDateTime.now();
    }

    // Getters and Setters

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBookCoverImage() {
        return bookCoverImage;
    }

    public void setBookCoverImage(String bookCoverImage) {
        this.bookCoverImage = bookCoverImage;
    }

    public double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public LocalDate getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(LocalDate publishDate) {
        this.publishDate = publishDate;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public Long getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(Long modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public LocalDateTime getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(LocalDateTime modifiedDate) {
        this.modifiedDate = modifiedDate;
    }
    
    
    public Long getQty() {
        return qty;
    }

    public void setQty(Long qty) {
        this.qty = qty;
    }
    
    @Transient
    private String createdByEmail;

    public String getCreatedByEmail() {
        return createdByEmail;
    }

    public void setCreatedByEmail(String createdByEmail) {
        this.createdByEmail = createdByEmail;
    }

    @Transient
    private String bookCoverImageUrl;

    public String getBookCoverImageUrl() {
        return bookCoverImageUrl;
    }

    public void setBookCoverImageUrl(String bookCoverImageUrl) {
        this.bookCoverImageUrl = bookCoverImageUrl;
    }

    @Transient
    private String createdByFullName;

    public String getCreatedByFullName() {
        return createdByFullName;
    }

    public void setCreatedByFullName(String createdByFullName) {
        this.createdByFullName = createdByFullName;
    }

}
