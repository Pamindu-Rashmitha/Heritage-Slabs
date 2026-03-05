package com.example.Heritage_Slabs.dto.response;

public class AuthResponseDTO {
    private String token;
    private String role;
    private String name;
    private Long id;

    // Constructor
    public AuthResponseDTO(String token, String role, String name, Long id) {
        this.token = token;
        this.role = role;
        this.name = name;
        this.id = id;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
}