package com.example.Heritage_Slabs.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class PurchaseOrderRequestDTO {

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    @NotNull(message = "Expected delivery date is required")
    @FutureOrPresent(message = "Expected delivery must be today or in the future")
    private LocalDate expectedDelivery;

    @NotBlank(message = "Material ordered is required")
    private String materialOrdered;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than zero")
    private Integer quantity;

    @NotNull(message = "Total cost is required")
    @Positive(message = "Total cost must be greater than zero")
    private Double totalCost;

    private String status; // PENDING, DELIVERED, CANCELLED

    // Getters and Setters
    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public LocalDate getExpectedDelivery() {
        return expectedDelivery;
    }

    public void setExpectedDelivery(LocalDate expectedDelivery) {
        this.expectedDelivery = expectedDelivery;
    }

    public String getMaterialOrdered() {
        return materialOrdered;
    }

    public void setMaterialOrdered(String materialOrdered) {
        this.materialOrdered = materialOrdered;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
