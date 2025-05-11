package net.javaguides.springboot.dto;

import java.util.List;

public class OrderHistoryDTO {
    private Long orderId;
    private List<OrderItemDTO> items;

    public OrderHistoryDTO() {}

    public OrderHistoryDTO(Long orderId, List<OrderItemDTO> items) {
        this.orderId = orderId;
        this.items = items;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public static class OrderItemDTO {
        private long bookId;
        private String name;
        private String author;
        private String status;
        private Long quantity;
        private double price;

        public OrderItemDTO() {}

        public OrderItemDTO(long bookId, String name, String author, String status, Long quantity, double price) {
            this.bookId = bookId;
            this.name = name;
            this.author = author;
            this.status = status;
            this.quantity = quantity;
            this.price = price;
        }

        public long getBookId() { return bookId; }
        public void setBookId(long bookId) { this.bookId = bookId; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getAuthor() { return author; }
        public void setAuthor(String author) { this.author = author; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Long getQuantity() { return quantity; }
        public void setQuantity(Long quantity) { this.quantity = quantity; }

        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }
    }
}
