package com.example.Heritage_Slabs.repository;

import com.example.Heritage_Slabs.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This custom method is crucial for finding a user during login
    Optional<User> findByEmail(String email);
}
