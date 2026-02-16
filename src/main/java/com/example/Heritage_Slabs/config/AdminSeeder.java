package com.example.Heritage_Slabs.config;

import com.example.Heritage_Slabs.model.Role;
import com.example.Heritage_Slabs.model.User;
import com.example.Heritage_Slabs.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@heritageslabs.com";

            // Check if admin exists. If not, create it!
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User adminUser = new User();
                adminUser.setName("System Admin");
                adminUser.setEmail(adminEmail);
                adminUser.setPassword(passwordEncoder.encode("AdminPassword123"));
                adminUser.setRole(Role.ADMIN); // This sets the REAL database role!

                userRepository.save(adminUser);
                System.out.println("✅ Real Admin account created successfully!");
            }
        };
    }
}