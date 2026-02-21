package com.example.Heritage_Slabs.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class MaterialIntakeRequestDTO {

    @NotNull(message = "Purchase Order ID is required")
    private Long purchaseOrderId;

    @NotNull(message = "Quantity received is required")
    @Positive(message = "Quantity received must be greater than zero")
    private Integer quantityReceived;

    private String conditionNotes;

    // Getters and Setters
    public Long getPurchaseOrderId() {
        return purchaseOrderId;
    }

    public void setPurchaseOrderId(Long purchaseOrderId) {
        this.purchaseOrderId = purchaseOrderId;
    }

    public Integer getQuantityReceived() {
        return quantityReceived;
    }

    public void setQuantityReceived(Integer quantityReceived) {
        this.quantityReceived = quantityReceived;
    }

    public String getConditionNotes() {
        return conditionNotes;
    }

    public void setConditionNotes(String conditionNotes) {
        this.conditionNotes = conditionNotes;
    }
}
