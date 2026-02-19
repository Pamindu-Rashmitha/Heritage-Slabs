package com.example.Heritage_Slabs.controller;

import com.example.Heritage_Slabs.dto.request.ProductRequestDTO;
import com.example.Heritage_Slabs.dto.response.ProductResponseDTO;
import com.example.Heritage_Slabs.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // --- PUBLIC ENDPOINTS (Customers & Admins) ---

    // Get all products for the catalog
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Get a specific product by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // --- ADMIN ONLY ENDPOINTS ---

    // Get Low Stock Alerts for the Admin Dashboard
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductResponseDTO>> getLowStockAlerts() {
        return ResponseEntity.ok(productService.getLowStockAlerts());
    }

    // Add a new Granite Slab/Product
    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@RequestBody ProductRequestDTO requestDTO) {
        ProductResponseDTO createdProduct = productService.createProduct(requestDTO);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    // Update an existing product (e.g., updating stock after a physical count)
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequestDTO requestDTO) {
        return ResponseEntity.ok(productService.updateProduct(id, requestDTO));
    }

    // Delete a product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}