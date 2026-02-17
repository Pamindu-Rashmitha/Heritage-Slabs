package com.example.Heritage_Slabs.dto.response;

import com.example.Heritage_Slabs.model.Role;

public class UserProfileDTO {
    private String name;
    private String email;
    private Role role;
    private String avatarUrl;

    public UserProfileDTO(String name, String email, Role role, String avatarUrl) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.avatarUrl = avatarUrl;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}