package com.example.Heritage_Slabs.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public class SupplierRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Contact info is required")
    private String contactInfo;

    @NotBlank(message = "Supplied material is required")
    private String suppliedMaterial;

    @PositiveOrZero(message = "Rating must be zero or positive")
    private Double rating;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public String getSuppliedMaterial() {
        return suppliedMaterial;
    }

    public void setSuppliedMaterial(String suppliedMaterial) {
        this.suppliedMaterial = suppliedMaterial;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }
}
