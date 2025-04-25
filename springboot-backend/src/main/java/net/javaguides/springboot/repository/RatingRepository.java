package net.javaguides.springboot.repository;

import net.javaguides.springboot.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByBookId(Long bookId);
    List<Rating> findByUserId(Long userId);
}
