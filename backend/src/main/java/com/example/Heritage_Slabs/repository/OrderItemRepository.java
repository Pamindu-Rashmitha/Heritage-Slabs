package com.example.Heritage_Slabs.repository;

import com.example.Heritage_Slabs.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT o FROM OrderItem o WHERE o.order_id.id = :orderId")
    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);
}
