package com.example.Heritage_Slabs.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Column(nullable = false)
    private LocalDate orderDate;

    @Column(nullable = false)
    private LocalDate expectedDelivery;

    @Column(nullable = false)
    private String materialOrdered;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double totalCost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PurchaseOrderStatus status; // PENDING, DELIVERED, CANCELLED

    // --- Constructors ---
    public PurchaseOrder() {
    }

    public PurchaseOrder(Supplier supplier, LocalDate orderDate, LocalDate expectedDelivery, String materialOrdered,
            Integer quantity, Double totalCost, PurchaseOrderStatus status) {
        this.supplier = supplier;
        this.orderDate = orderDate;
        this.expectedDelivery = expectedDelivery;
        this.materialOrdered = materialOrdered;
        this.quantity = quantity;
        this.totalCost = totalCost;
        this.status = status;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
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

    public PurchaseOrderStatus getStatus() {
        return status;
    }

    public void setStatus(PurchaseOrderStatus status) {
        this.status = status;
    }
}
