package com.example.Heritage_Slabs.dto.request;

import jakarta.validation.constraints.*;

public class ReviewRequestDTO {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer rating;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be 3-200 characters")
    @Pattern(regexp = ".*[a-zA-Z].*", message = "Title must contain at least one letter")
    private String title;

    @NotBlank(message = "Comment is required")
    @Size(min = 10, max = 5000, message = "Comment must be 10-5000 characters")
    @Pattern(regexp = ".*[a-zA-Z].*", message = "Comment must contain at least one letter")
    private String comment;

    // Getters and Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
