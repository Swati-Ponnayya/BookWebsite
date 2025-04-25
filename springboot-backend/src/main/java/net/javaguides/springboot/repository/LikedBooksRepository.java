package net.javaguides.springboot.repository;

import net.javaguides.springboot.model.User;
import net.javaguides.springboot.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface LikedBooksRepository extends JpaRepository<User, Long> {
    Set<Book> findLikedBooksById(Long userId);
}
