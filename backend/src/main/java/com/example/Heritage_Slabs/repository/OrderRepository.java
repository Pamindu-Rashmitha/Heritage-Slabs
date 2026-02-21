package com.example.Heritage_Slabs.repository;

import com.example.Heritage_Slabs.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM Order o WHERE o.user_id.email = ?1")
    List<Order> findByUserEmail(String email);
}
