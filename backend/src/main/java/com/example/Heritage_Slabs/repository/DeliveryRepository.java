package com.example.Heritage_Slabs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Heritage_Slabs.model.Delivery;
import com.example.Heritage_Slabs.model.DeliveryStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    Optional<Delivery> findByOrderId(Long orderId);

    List<Delivery> findByStatus(DeliveryStatus status);

    List<Delivery> findAllByOrderByCreatedAtDesc();
}
