package net.javaguides.springboot.repository;

import net.javaguides.springboot.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import net.javaguides.springboot.model.Cart;
import net.javaguides.springboot.model.User;
import net.javaguides.springboot.model.Book;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	  Optional<CartItem> findByCartAndBook(Cart cart, Book book);
	  
	  List<CartItem> findByCart(Cart cart);

}
