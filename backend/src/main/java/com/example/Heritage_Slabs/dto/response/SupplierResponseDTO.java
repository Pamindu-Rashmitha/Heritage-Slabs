package com.example.Heritage_Slabs.dto.response;

public class SupplierResponseDTO {
    private Long id;
    private String name;
    private String contactInfo;
    private String suppliedMaterial;
    private Double rating;

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
