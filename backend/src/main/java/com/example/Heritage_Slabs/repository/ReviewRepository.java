package com.example.Heritage_Slabs.repository;

import com.example.Heritage_Slabs.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductId(Long productId);

    List<Review> findByUserId(Long userId);

    // Admin queary
    List<Review> findByIsFlaggedTrueOrderByReviewDateDesc();

    List<Review> findAllByOrderByReviewDateDesc();

    long countByIsFlaggedTrue();
}

