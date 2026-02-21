package com.example.Heritage_Slabs.repository;

import com.example.Heritage_Slabs.model.MaterialIntake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialIntakeRepository extends JpaRepository<MaterialIntake, Long> {
    List<MaterialIntake> findByPurchaseOrderId(Long purchaseOrderId);
}
