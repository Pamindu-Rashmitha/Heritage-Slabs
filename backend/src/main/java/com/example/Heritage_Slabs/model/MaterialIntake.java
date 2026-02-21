package com.example.Heritage_Slabs.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "material_intakes")
public class MaterialIntake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @Column(nullable = false)
    private LocalDate arrivalDate;

    @Column(nullable = false)
    private Integer quantityReceived;

    @Column(columnDefinition = "TEXT")
    private String conditionNotes; // e.g., "Good", "Damaged", etc.

    // --- Constructors ---
    public MaterialIntake() {
    }

    public MaterialIntake(PurchaseOrder purchaseOrder, LocalDate arrivalDate, Integer quantityReceived,
            String conditionNotes) {
        this.purchaseOrder = purchaseOrder;
        this.arrivalDate = arrivalDate;
        this.quantityReceived = quantityReceived;
        this.conditionNotes = conditionNotes;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PurchaseOrder getPurchaseOrder() {
        return purchaseOrder;
    }

    public void setPurchaseOrder(PurchaseOrder purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
    }

    public LocalDate getArrivalDate() {
        return arrivalDate;
    }

    public void setArrivalDate(LocalDate arrivalDate) {
        this.arrivalDate = arrivalDate;
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
