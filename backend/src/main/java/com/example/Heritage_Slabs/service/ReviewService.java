package com.example.Heritage_Slabs.service;

import com.example.Heritage_Slabs.dto.request.ReviewRequestDTO;
import com.example.Heritage_Slabs.dto.response.ReviewResponseDTO;
import com.example.Heritage_Slabs.model.Product;
import com.example.Heritage_Slabs.model.Review;
import com.example.Heritage_Slabs.model.User;
import com.example.Heritage_Slabs.repository.ProductRepository;
import com.example.Heritage_Slabs.repository.ReviewRepository;
import com.example.Heritage_Slabs.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // Customer side
    @Transactional
    public ReviewResponseDTO createReview(ReviewRequestDTO dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(dto.getRating());
        review.setTitle(dto.getTitle());
        review.setComment(dto.getComment());
        review.setReviewDate(LocalDateTime.now());

        // Auto reply
        if (dto.getRating() >= 4) {
            review.setAdminReply("Thank you for your fantastic feedback! We're so pleased to hear you had a great experience with our product. Your satisfaction means the world to us. Vijitha Granite Team");
        } else {
            review.setAdminReply("We're truly sorry to hear your experience was not satisfactory. This isn't our standard. Please contact us directly at your earliest convenience so we can understand and resolve this issue promptly for you. Vijitha Granite Team");
        }
        review.setReplyDate(LocalDateTime.now());

        Review saved = reviewRepository.save(review);

        product.getReviews().add(saved);
        product.calculateAverageRating();
        productRepository.save(product);

        return mapToResponseDTO(saved);
    }

    public List<ReviewResponseDTO> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Admin site
    public List<ReviewResponseDTO> getAllReviewsForAdmin() {
        return reviewRepository.findAllByOrderByReviewDateDesc().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewResponseDTO> getFlaggedReviews() {
        return reviewRepository.findByIsFlaggedTrueOrderByReviewDateDesc().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public long countFlaggedReviews() {
        return reviewRepository.countByIsFlaggedTrue();
    }

    @Transactional
    public ReviewResponseDTO updateAdminReply(Long reviewId, String newReply) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        review.setAdminReply(newReply);
        review.setReplyDate(LocalDateTime.now());
        return mapToResponseDTO(reviewRepository.save(review));
    }

    @Transactional
    public void toggleFlag(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setFlagged(!review.isFlagged());
        reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    private ReviewResponseDTO mapToResponseDTO(Review review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setId(review.getId());
        dto.setUserName(review.getUser().getName());
        dto.setUserEmail(review.getUser().getEmail());
        dto.setRating(review.getRating());
        dto.setTitle(review.getTitle());
        dto.setComment(review.getComment());
        dto.setReviewDate(review.getReviewDate());
        dto.setSentimentEmoji(review.getSentimentEmoji());
        dto.setAdminReply(review.getAdminReply());
        dto.setReplyDate(review.getReplyDate());
        dto.setRepliedBy(review.getRepliedBy());
        dto.setProductName(review.getProduct().getName());

        // This makes the Flag button turn red
        dto.setFlagged(review.isFlagged());

        return dto;
    }

    @Transactional
    public void deleteOwnReview(Long reviewId, String userEmail) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("You can only delete your own reviews!");
        }

        Product product = review.getProduct();
        product.getReviews().remove(review);
        product.calculateAverageRating();
        productRepository.save(product);

        reviewRepository.delete(review);
    }
}

