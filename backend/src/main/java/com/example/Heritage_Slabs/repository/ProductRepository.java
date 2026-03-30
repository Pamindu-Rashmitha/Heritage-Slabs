package com.example.Heritage_Slabs.repository;

import com.example.Heritage_Slabs.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Fetch all products that are NOT deleted
    List<Product> findAllByIsDeletedFalse();

    // Updated: Only check low stock for active products
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.lowStockThreshold AND p.isDeleted = false")
    List<Product> findProductsWithLowStock();

    // Updated: Search products by name, ignoring deleted ones
    List<Product> findByNameContainingIgnoreCaseAndIsDeletedFalse(String name);
}