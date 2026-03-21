package com.example.Heritage_Slabs.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ProductRequestDTO {

    @NotBlank(message = "Product name is required")
    private String name;

    private Double price;

    /**
     * Regex ensures dimensions are strictly numbers separated by an asterisk.
     * Spaces around the asterisk are allowed and handled.
     */
    @NotBlank(message = "Dimensions cannot be blank")
    @Pattern(regexp = "^\\s*\\d+\\s*\\*\\s*\\d+\\s*$",
            message = "Dimensions must be in the format 'length * width' using numbers (e.g., '120 * 60')")
    private String dimensions;

    private String grade;
    private Integer stockQuantity;
    private Integer lowStockThreshold;
    private String description;
    private String textureUrl;

    // --- Getters and Setters ---

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