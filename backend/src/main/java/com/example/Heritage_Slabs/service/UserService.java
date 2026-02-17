package com.example.Heritage_Slabs.service;

import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import com.example.Heritage_Slabs.dto.response.UserProfileDTO;
import java.util.List;
import java.util.stream.Collectors;
import com.example.Heritage_Slabs.dto.request.ChangePasswordRequest;
import com.example.Heritage_Slabs.model.User;
import com.example.Heritage_Slabs.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Define where to save the images locally
    private final String UPLOAD_DIR = "uploads/avatars/";

    // Handle the avatar file upload
    public String updateAvatar(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            // 1. Create the directory if it doesn't exist yet
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 2. Generate a unique file name (so two users named "John" don't overwrite "profile.png")
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            // 3. Save the physical file to the folder
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 4. Create the URL link to access this image (assuming Spring Boot runs on 8080)
            String avatarUrl = "http://localhost:8080/avatars/" + fileName;

            // 5. Save that URL string to the MySQL database!
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);

            return avatarUrl;
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }

    // Fetch user by Email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Update basic profile details (Name)
    public User updateProfile(String email, String newName) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(newName);
        return userRepository.save(user);
    }

    // Securely change the password
    public String changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the current password provided matches the one in the database
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return "Error: Incorrect current password!";
        }

        // Encrypt the new password and save it
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password updated successfully!";
    }

    // Fetch all users for the Admin Dashboard
    public List<UserProfileDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserProfileDTO(
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getAvatarUrl())) // <-- CHANGE THIS FROM null!
                .collect(Collectors.toList());
    }

    // Delete a user from the database
    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    // Update a user's role (Admin only)
    public void updateUserRole(String email, String newRole) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Convert the plain String text into your official Role Enum!
        // We use .toUpperCase() just in case the frontend sends "admin" instead of "ADMIN"
        user.setRole(com.example.Heritage_Slabs.model.Role.valueOf(newRole.toUpperCase()));

        userRepository.save(user);
    }
}