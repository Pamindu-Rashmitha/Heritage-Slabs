package com.example.Heritage_Slabs.dto.response;

import java.time.LocalDateTime;

public class ReviewResponseDTO {

    private Long id;
    private String userName;
    private String userEmail;
    private Integer rating;
    private String title;
    private String comment;
    private LocalDateTime reviewDate;
    private String sentimentEmoji;

    // Admin reply fields
    private String adminReply;
    private LocalDateTime replyDate;
    private String repliedBy;

    // For frontend display
    private String productName;

    // Flag status for Admin
    private boolean isFlagged = false;

    // Constructors
    public ReviewResponseDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDateTime reviewDate) { this.reviewDate = reviewDate; }

    public String getSentimentEmoji() { return sentimentEmoji; }
    public void setSentimentEmoji(String sentimentEmoji) { this.sentimentEmoji = sentimentEmoji; }

    public String getAdminReply() { return adminReply; }
    public void setAdminReply(String adminReply) { this.adminReply = adminReply; }

    public LocalDateTime getReplyDate() { return replyDate; }
    public void setReplyDate(LocalDateTime replyDate) { this.replyDate = replyDate; }

    public String getRepliedBy() { return repliedBy; }
    public void setRepliedBy(String repliedBy) { this.repliedBy = repliedBy; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public boolean isFlagged() { return isFlagged; }
    public void setFlagged(boolean isFlagged) { this.isFlagged = isFlagged; }
}


