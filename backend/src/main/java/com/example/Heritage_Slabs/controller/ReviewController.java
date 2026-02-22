package com.example.Heritage_Slabs.controller;

import com.example.Heritage_Slabs.dto.request.ReviewRequestDTO;
import com.example.Heritage_Slabs.dto.response.ReviewResponseDTO;
import com.example.Heritage_Slabs.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Customer
    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponseDTO> createReview(
            @RequestBody ReviewRequestDTO dto,
            Authentication auth) {
        String email = auth.getName();
        return ResponseEntity.ok(reviewService.createReview(dto, email));
    }

    // Admin
    @GetMapping("/admin/reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviewsForAdmin());
    }

    @GetMapping("/admin/reviews/flagged")
    public ResponseEntity<List<ReviewResponseDTO>> getFlaggedReviews() {
        return ResponseEntity.ok(reviewService.getFlaggedReviews());
    }

    @PutMapping("/admin/reviews/{id}/reply")
    public ResponseEntity<ReviewResponseDTO> updateReply(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> request) {

        String newReply = request.get("reply");
        if (newReply == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(reviewService.updateAdminReply(id, newReply));
    }

    @PatchMapping("/admin/reviews/{id}/flag")
    public ResponseEntity<Void> toggleFlag(@PathVariable Long id) {
        reviewService.toggleFlag(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/admin/reviews/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Void> deleteOwnReview(
            @PathVariable Long id,
            Authentication authentication) {

        String userEmail = authentication.getName();
        reviewService.deleteOwnReview(id, userEmail);
        return ResponseEntity.noContent().build();
    }
}

