package com.example.Heritage_Slabs.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String dimensions; // e.g., "10x5 ft"

    @Column(nullable = false)
    private String grade; // e.g., "Premium", "Standard"

    @Column(nullable = false)
    private Integer stockQuantity;

    // Default is 10, but Admin can change it per product
    @Column(nullable = false)
    private Integer lowStockThreshold = 10;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Stores the file path or URL to the image (Required for AI Visualizer)
    @Column(name = "texture_url")
    private String textureUrl;

    // --- Constructors ---

    public Product() {
    }

    public Product(String name, Double price, String dimensions, String grade, Integer stockQuantity, String textureUrl) {
        this.name = name;
        this.price = price;
        this.dimensions = dimensions;
        this.grade = grade;
        this.stockQuantity = stockQuantity;
        this.textureUrl = textureUrl;
    }

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getDimensions() { return dimensions; }
    public void setDimensions(String dimensions) { this.dimensions = dimensions; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Integer getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(Integer lowStockThreshold) { this.lowStockThreshold = lowStockThreshold; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTextureUrl() { return textureUrl; }
    public void setTextureUrl(String textureUrl) { this.textureUrl = textureUrl; }
}