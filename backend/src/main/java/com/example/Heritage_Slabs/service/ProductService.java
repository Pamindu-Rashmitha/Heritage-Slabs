package com.example.Heritage_Slabs.service;

import com.example.Heritage_Slabs.dto.request.ProductRequestDTO;
import com.example.Heritage_Slabs.dto.response.ProductResponseDTO;
import com.example.Heritage_Slabs.model.Product;
import com.example.Heritage_Slabs.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // 1. Create a new Product
    public ProductResponseDTO createProduct(ProductRequestDTO requestDTO) {
        Product product = new Product();
        updateProductFields(product, requestDTO);

        Product savedProduct = productRepository.save(product);
        return mapToResponseDTO(savedProduct);
    }

    // 2. Get all Products (For the Catalog)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // 3. Get a single Product by ID
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return mapToResponseDTO(product);
    }

    // 4. Update an existing Product
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO requestDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        updateProductFields(product, requestDTO);
        Product updatedProduct = productRepository.save(product);
        return mapToResponseDTO(updatedProduct);
    }

    // 5. Delete a Product
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    // 6. Get Low Stock Alerts (Requirement specified in the proposal)
    public List<ProductResponseDTO> getLowStockAlerts() {
        return productRepository.findProductsWithLowStock().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // --- Helper Methods ---

    private void updateProductFields(Product product, ProductRequestDTO dto) {
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setDimensions(dto.getDimensions());
        product.setGrade(dto.getGrade());
        product.setStockQuantity(dto.getStockQuantity());
        product.setDescription(dto.getDescription());
        product.setTextureUrl(dto.getTextureUrl());

        if (dto.getLowStockThreshold() != null) {
            product.setLowStockThreshold(dto.getLowStockThreshold());
        }
    }

    private ProductResponseDTO mapToResponseDTO(Product product) {
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getDimensions(),
                product.getGrade(),
                product.getStockQuantity(),
                product.getLowStockThreshold(),
                product.getDescription(),
                product.getTextureUrl()
        );
    }
}