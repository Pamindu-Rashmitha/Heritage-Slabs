package com.example.Heritage_Slabs.repository;

import com.example.Heritage_Slabs.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Custom query to find products running low on stock
    // Logic: Current Stock <= The threshold set for that specific product
    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.lowStockThreshold")
    List<Product> findProductsWithLowStock();

    // Search products by name (Useful for search bars)
    List<Product> findByNameContainingIgnoreCase(String name);
}