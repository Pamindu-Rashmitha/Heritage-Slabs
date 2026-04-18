package com.example.Heritage_Slabs.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public class SupplierRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Supplied material is required")
    private String suppliedMaterial;

    @PositiveOrZero(message = "Rating must be zero or positive")
    private Double rating;

    @NotBlank(message = "Email is required")
    @jakarta.validation.constraints.Email(message = "Invalid email format")
    @jakarta.validation.constraints.Pattern(regexp = "^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Email must start with a letter and have a valid domain format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @jakarta.validation.constraints.Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
