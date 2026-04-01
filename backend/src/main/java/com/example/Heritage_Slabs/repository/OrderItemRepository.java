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

    @Query("SELECT COUNT(oi) > 0 FROM OrderItem oi WHERE oi.order_id.user_id.id = :userId AND oi.product_id.id = :productId AND oi.order_id.status IN :statuses")
    boolean existsByUserAndProductAndStatus(@Param("userId") Long userId, @Param("productId") Long productId, @Param("statuses") List<com.example.Heritage_Slabs.model.Status> statuses);
}
