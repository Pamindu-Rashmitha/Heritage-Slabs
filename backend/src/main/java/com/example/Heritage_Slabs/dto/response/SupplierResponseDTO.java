package com.example.Heritage_Slabs.dto.response;

public class SupplierResponseDTO {
    private Long id;
    private String name;
    private String suppliedMaterial;
    private Double rating;
    private String email;
    private String phone;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
