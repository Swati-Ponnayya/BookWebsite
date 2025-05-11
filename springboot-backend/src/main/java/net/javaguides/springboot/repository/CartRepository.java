package net.javaguides.springboot.repository;
import net.javaguides.springboot.model.Cart;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import net.javaguides.springboot.model.User;

public interface CartRepository extends JpaRepository<Cart, Long> {
	Optional<Cart> findByUser(User user);
}
