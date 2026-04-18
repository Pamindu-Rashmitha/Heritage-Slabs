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
    private String suppliedMaterial; // Material type supplied by this supplier

    private Double rating; // Supplier rating

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    // --- Constructors ---
    public Supplier() {
    }

    public Supplier(String name, String suppliedMaterial, Double rating, String email, String phone) {
        this.name = name;
        this.suppliedMaterial = suppliedMaterial;
        this.rating = rating;
        this.email = email;
        this.phone = phone;
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
