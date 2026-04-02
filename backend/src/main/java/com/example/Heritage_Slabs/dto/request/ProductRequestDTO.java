package com.example.Heritage_Slabs.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Min;

public class ProductRequestDTO {

    @NotBlank(message = "Product name is required")
    private String name;

    // --> NEW: Prevent negative prices and ensure it's not null
    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private Double price;

    /**
     * Regex ensures dimensions are strictly non-zero numbers separated by an asterisk.
     * It prevents 0 * 0, 0 * n, and n * 0.
     * Spaces around the asterisk are allowed and handled.
     */
    @NotBlank(message = "Dimensions cannot be blank")
    @Pattern(regexp = "^\\s*0*[1-9]\\d*\\s*\\*\\s*0*[1-9]\\d*\\s*$",
            message = "Dimensions must be in the format 'length * width' using numbers greater than 0 (e.g., '120 * 60')")
    private String dimensions;

    private String grade;

    // --> NEW: Prevent negative stock quantities and ensure it's not null
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    // --> NEW: Prevent negative thresholds
    @Min(value = 0, message = "Low stock threshold cannot be negative")
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