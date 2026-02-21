package com.example.Heritage_Slabs.model;

import jakarta.persistence.*;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String contactInfo;

    @Column(nullable = false)
    private String suppliedMaterial; // Material type supplied by this supplier

    private Double rating; // Supplier rating

    // --- Constructors ---
    public Supplier() {
    }

    public Supplier(String name, String contactInfo, String suppliedMaterial, Double rating) {
        this.name = name;
        this.contactInfo = contactInfo;
        this.suppliedMaterial = suppliedMaterial;
        this.rating = rating;
    }

    // --- Getters and Setters ---
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
