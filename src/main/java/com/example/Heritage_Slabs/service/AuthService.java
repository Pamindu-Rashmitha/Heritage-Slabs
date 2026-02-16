package com.example.Heritage_Slabs.service;

import com.example.Heritage_Slabs.dto.response.AuthResponseDTO;
import com.example.Heritage_Slabs.dto.request.LoginRequest;
import com.example.Heritage_Slabs.dto.request.RegisterRequest;
import com.example.Heritage_Slabs.model.Role;
import com.example.Heritage_Slabs.model.User;
import com.example.Heritage_Slabs.repository.UserRepository;
import com.example.Heritage_Slabs.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; // Add JwtService

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            return "Error: Email is already taken!";
        }

        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(Role.USER);

        userRepository.save(newUser);
        return "User registered successfully!";
    }

    // NEW: Login method
    public AuthResponseDTO login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Error: Invalid password!");
        }

        String token = jwtService.generateToken(user);

        // Return the Token AND the Role from the database
        return new AuthResponseDTO(token, user.getRole().name());
    }


}