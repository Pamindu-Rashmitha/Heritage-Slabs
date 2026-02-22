package com.example.Heritage_Slabs.dto.response;

import java.util.List;

public class ProductResponseDTO {
    private Long id;
    private String name;
    private Double price;
    private String dimensions;
    private String grade;
    private Integer stockQuantity;
    private Integer lowStockThreshold;
    private String description;
    private String textureUrl;
    private boolean isLowStock;

    // NEW FOR REVIEWS
    private Double averageRating = 0.0;
    private List<ReviewResponseDTO> reviews;

    // Updated Constructor
    public ProductResponseDTO(Long id, String name, Double price, String dimensions, String grade,
                              Integer stockQuantity, Integer lowStockThreshold, String description,
                              String textureUrl, Double averageRating, List<ReviewResponseDTO> reviews) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.dimensions = dimensions;
        this.grade = grade;
        this.stockQuantity = stockQuantity;
        this.lowStockThreshold = lowStockThreshold;
        this.description = description;
        this.textureUrl = textureUrl;
        this.isLowStock = stockQuantity != null && lowStockThreshold != null && stockQuantity <= lowStockThreshold;
        this.averageRating = averageRating != null ? averageRating : 0.0;
        this.reviews = reviews != null ? reviews : List.of();
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getPrice() { return price; }
    public String getDimensions() { return dimensions; }
    public String getGrade() { return grade; }
    public Integer getStockQuantity() { return stockQuantity; }
    public Integer getLowStockThreshold() { return lowStockThreshold; }
    public String getDescription() { return description; }
    public String getTextureUrl() { return textureUrl; }
    public boolean isLowStock() { return isLowStock; }
    public Double getAverageRating() { return averageRating; }
    public List<ReviewResponseDTO> getReviews() { return reviews; }
}