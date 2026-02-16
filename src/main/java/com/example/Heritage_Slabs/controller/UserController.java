package com.example.Heritage_Slabs.controller;

import org.springframework.web.multipart.MultipartFile;
import com.example.Heritage_Slabs.dto.response.UserProfileDTO;
import java.util.List;
import com.example.Heritage_Slabs.dto.request.ChangePasswordRequest;
import com.example.Heritage_Slabs.model.User;
import com.example.Heritage_Slabs.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Endpoint to upload a profile avatar image
    @PostMapping("/{email}/avatar")
    public ResponseEntity<String> uploadAvatar(@PathVariable String email, @RequestParam("file") MultipartFile file) {
        try {
            String avatarUrl = userService.updateAvatar(email, file);
            return ResponseEntity.ok(avatarUrl);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint to change a user's role
    @PutMapping("/{email}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String email, @RequestBody java.util.Map<String, String> request) {
        try {
            userService.updateUserRole(email, request.get("role"));
            return ResponseEntity.ok("User role updated successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error updating role.");
        }
    }

    // Endpoint to get the current user's details
    @GetMapping("/{email}")
    public ResponseEntity<User> getUserProfile(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint to update the user's name
    @PutMapping("/{email}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable String email, @RequestBody java.util.Map<String, String> requestBody) {
        try {
            // Grab the "name" field from the JSON body sent by React
            String newName = requestBody.get("name");

            User updatedUser = userService.updateProfile(email, newName);
            return ResponseEntity.ok("Profile updated successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error updating profile.");
        }
    }

    // Endpoint to change the password
    @PutMapping("/{email}/password")
    public ResponseEntity<String> changePassword(@PathVariable String email, @RequestBody ChangePasswordRequest request) {
        try {
            String response = userService.changePassword(email, request);
            if (response.startsWith("Error")) {
                return ResponseEntity.badRequest().body(response);
            }
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("User not found");
        }
    }

    // Endpoint to get all users (Admin only)
    @GetMapping
    public ResponseEntity<List<UserProfileDTO>> getAllUsers() {
        List<UserProfileDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Endpoint to delete a user
    @DeleteMapping("/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email) {
        try {
            userService.deleteUser(email);
            return ResponseEntity.ok("User deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error deleting user.");
        }
    }
}