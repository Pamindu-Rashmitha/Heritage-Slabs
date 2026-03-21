package com.example.Heritage_Slabs.service;

import com.example.Heritage_Slabs.dto.request.ProductRequestDTO;
import com.example.Heritage_Slabs.dto.response.ProductResponseDTO;
import com.example.Heritage_Slabs.dto.response.ReviewResponseDTO;
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

    // 5. Upload Product Image
    public ProductResponseDTO uploadProductImage(Long id, org.springframework.web.multipart.MultipartFile file) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        try {
            // 1. Create the directory if it doesn't exist
            String uploadDir = "uploads/products/";
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }

            // 2. Generate a unique file name to avoid overwriting (e.g., 123e4567-e89b...-moon-white.jpg)
            String fileName = java.util.UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            java.nio.file.Path filePath = uploadPath.resolve(fileName);

            // 3. Save the file to the local file system
            java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // 4. Save the accessible URL to the database
            String fileUrl = "/product-images/" + fileName;
            product.setTextureUrl(fileUrl);
            Product updatedProduct = productRepository.save(product);

            return mapToResponseDTO(updatedProduct);

        } catch (java.io.IOException e) {
            throw new RuntimeException("Could not store file. Error: " + e.getMessage());
        }
    }

    // 6. Delete a Product
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    // 7. Get Low Stock Alerts
    public List<ProductResponseDTO> getLowStockAlerts() {
        return productRepository.findProductsWithLowStock().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // --- Helper Methods ---

    private void updateProductFields(Product product, ProductRequestDTO dto) {
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setGrade(dto.getGrade());
        product.setStockQuantity(dto.getStockQuantity());
        product.setDescription(dto.getDescription());
        product.setTextureUrl(dto.getTextureUrl());

        if (dto.getLowStockThreshold() != null) {
            product.setLowStockThreshold(dto.getLowStockThreshold());
        }

        // --- NEW DIMENSION PARSING LOGIC ---
        if (dto.getDimensions() != null && dto.getDimensions().contains("*")) {
            // 1. Remove all spaces from the string (e.g., " 120 * 60 " becomes "120*60")
            String cleanDimensions = dto.getDimensions().replaceAll("\\s+", "");

            // 2. Split the string at the asterisk
            String[] parts = cleanDimensions.split("\\*");

            // 3. Convert string numbers to Integers and save to entity
            product.setLength(Integer.parseInt(parts[0]));
            product.setWidth(Integer.parseInt(parts[1]));
        }
        // -----------------------------------
    }

    private ProductResponseDTO mapToResponseDTO(Product product) {
        List<ReviewResponseDTO> reviewDTOs = product.getReviews().stream()
                .map(review -> {
                    ReviewResponseDTO dto = new ReviewResponseDTO();
                    dto.setId(review.getId());
                    dto.setUserName(review.getUser().getName());
                    dto.setRating(review.getRating());
                    dto.setTitle(review.getTitle());
                    dto.setComment(review.getComment());
                    dto.setReviewDate(review.getReviewDate());
                    dto.setSentimentEmoji(review.getSentimentEmoji());
                    dto.setAdminReply(review.getAdminReply());
                    dto.setRepliedBy(review.getRepliedBy());
                    return dto;
                })
                .collect(Collectors.toList());

        // --- NEW DIMENSION FORMATTING LOGIC ---
        // Combine length and width back into a string for the frontend response
        String formattedDimensions = product.getLength() + " * " + product.getWidth();
        // --------------------------------------

        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getPrice(),
                formattedDimensions, // Using the reconstructed string here
                product.getGrade(),
                product.getStockQuantity(),
                product.getLowStockThreshold(),
                product.getDescription(),
                product.getTextureUrl(),
                product.getAverageRating(),
                reviewDTOs
        );
    }
}