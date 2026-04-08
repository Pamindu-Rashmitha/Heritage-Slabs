package com.example.Heritage_Slabs.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class PurchaseOrderRequestDTO {

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Expected delivery date is required")
    @FutureOrPresent(message = "Expected delivery must be today or in the future")
    private LocalDate expectedDelivery;

    @NotNull(message = "Quantity is required")
    @jakarta.validation.constraints.Min(value = 10, message = "Quantity must be at least 10")
    private Integer quantity;

    private String status; // PENDING, DELIVERED, CANCELLED

    @FutureOrPresent(message = "Order date must be today or in the future")
    private LocalDate orderDate;

    // Getters and Setters
    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }
    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public LocalDate getExpectedDelivery() {
        return expectedDelivery;
    }

    public void setExpectedDelivery(LocalDate expectedDelivery) {
        this.expectedDelivery = expectedDelivery;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
