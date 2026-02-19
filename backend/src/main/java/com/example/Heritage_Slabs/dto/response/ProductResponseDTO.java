package com.example.Heritage_Slabs.dto.response;

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
    private boolean isLowStock; // Computed field for the frontend!

    // Constructor to easily map from Product Entity to DTO
    public ProductResponseDTO(Long id, String name, Double price, String dimensions, String grade,
                              Integer stockQuantity, Integer lowStockThreshold, String description, String textureUrl) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.dimensions = dimensions;
        this.grade = grade;
        this.stockQuantity = stockQuantity;
        this.lowStockThreshold = lowStockThreshold;
        this.description = description;
        this.textureUrl = textureUrl;

        // Automatically determine if stock is low for the frontend to show a warning badge
        this.isLowStock = stockQuantity != null && lowStockThreshold != null && stockQuantity <= lowStockThreshold;
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

    // Setters omitted for brevity, add them if you need to mutate the DTO later
}