package com.example.Heritage_Slabs.repository;

import com.example.Heritage_Slabs.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long>
{
}
