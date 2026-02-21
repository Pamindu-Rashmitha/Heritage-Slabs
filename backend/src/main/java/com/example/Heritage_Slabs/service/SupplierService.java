package com.example.Heritage_Slabs.service;

import com.example.Heritage_Slabs.dto.request.MaterialIntakeRequestDTO;
import com.example.Heritage_Slabs.dto.request.PurchaseOrderRequestDTO;
import com.example.Heritage_Slabs.dto.request.SupplierRequestDTO;
import com.example.Heritage_Slabs.dto.response.MaterialIntakeResponseDTO;
import com.example.Heritage_Slabs.dto.response.PurchaseOrderResponseDTO;
import com.example.Heritage_Slabs.dto.response.SupplierResponseDTO;
import com.example.Heritage_Slabs.model.MaterialIntake;
import com.example.Heritage_Slabs.model.PurchaseOrder;
import com.example.Heritage_Slabs.model.PurchaseOrderStatus;
import com.example.Heritage_Slabs.model.Supplier;
import com.example.Heritage_Slabs.repository.MaterialIntakeRepository;
import com.example.Heritage_Slabs.repository.PurchaseOrderRepository;
import com.example.Heritage_Slabs.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private MaterialIntakeRepository materialIntakeRepository;

    // --- Supplier Methods ---

    public SupplierResponseDTO createSupplier(SupplierRequestDTO dto) {
        Supplier supplier = new Supplier(dto.getName(), dto.getContactInfo(), dto.getSuppliedMaterial(),
                dto.getRating());
        Supplier savedSupplier = supplierRepository.save(supplier);
        return mapToSupplierResponseDTO(savedSupplier);
    }

    public List<SupplierResponseDTO> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::mapToSupplierResponseDTO)
                .collect(Collectors.toList());
    }

    public SupplierResponseDTO getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        return mapToSupplierResponseDTO(supplier);
    }

    public SupplierResponseDTO updateSupplier(Long id, SupplierRequestDTO dto) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));

        supplier.setName(dto.getName());
        supplier.setContactInfo(dto.getContactInfo());
        supplier.setSuppliedMaterial(dto.getSuppliedMaterial());
        supplier.setRating(dto.getRating());

        Supplier updatedSupplier = supplierRepository.save(supplier);
        return mapToSupplierResponseDTO(updatedSupplier);
    }

    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new RuntimeException("Supplier not found with id: " + id);
        }
        supplierRepository.deleteById(id);
    }

    // --- Purchase Order Methods ---

    public PurchaseOrderResponseDTO createPurchaseOrder(PurchaseOrderRequestDTO dto) {
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + dto.getSupplierId()));

        PurchaseOrderStatus status = PurchaseOrderStatus.PENDING;
        if (dto.getStatus() != null) {
            try {
                status = PurchaseOrderStatus.valueOf(dto.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Keep PENDING if invalid status string
            }
        }

        PurchaseOrder order = new PurchaseOrder(
                supplier,
                LocalDate.now(),
                dto.getExpectedDelivery(),
                dto.getMaterialOrdered(),
                dto.getQuantity(),
                dto.getTotalCost(),
                status);

        PurchaseOrder savedOrder = purchaseOrderRepository.save(order);
        return mapToPurchaseOrderResponseDTO(savedOrder);
    }

    public List<PurchaseOrderResponseDTO> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll().stream()
                .map(this::mapToPurchaseOrderResponseDTO)
                .collect(Collectors.toList());
    }

    public List<PurchaseOrderResponseDTO> getPurchaseOrdersBySupplier(Long supplierId) {
        return purchaseOrderRepository.findBySupplierId(supplierId).stream()
                .map(this::mapToPurchaseOrderResponseDTO)
                .collect(Collectors.toList());
    }

    public PurchaseOrderResponseDTO updatePurchaseOrderStatus(Long id, String statusString) {
        PurchaseOrder order = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order not found with id: " + id));

        try {
            PurchaseOrderStatus status = PurchaseOrderStatus.valueOf(statusString.toUpperCase());
            order.setStatus(status);
            PurchaseOrder updatedOrder = purchaseOrderRepository.save(order);
            return mapToPurchaseOrderResponseDTO(updatedOrder);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + statusString);
        }
    }

    // --- Material Intake Methods ---

    @Transactional
    public MaterialIntakeResponseDTO logMaterialIntake(MaterialIntakeRequestDTO dto) {
        PurchaseOrder order = purchaseOrderRepository.findById(dto.getPurchaseOrderId())
                .orElseThrow(
                        () -> new RuntimeException("Purchase Order not found with id: " + dto.getPurchaseOrderId()));

        MaterialIntake intake = new MaterialIntake(
                order,
                LocalDate.now(),
                dto.getQuantityReceived(),
                dto.getConditionNotes());

        MaterialIntake savedIntake = materialIntakeRepository.save(intake);

        // Optional: Update purchase order status to partially or fully delivered based
        // on quantity
        // For simplicity, we just set it to DELIVERED here or leave to separate update
        // calls.
        order.setStatus(PurchaseOrderStatus.DELIVERED);
        purchaseOrderRepository.save(order);

        return mapToMaterialIntakeResponseDTO(savedIntake);
    }

    public List<MaterialIntakeResponseDTO> getIntakesByPurchaseOrder(Long purchaseOrderId) {
        return materialIntakeRepository.findByPurchaseOrderId(purchaseOrderId).stream()
                .map(this::mapToMaterialIntakeResponseDTO)
                .collect(Collectors.toList());
    }

    // --- Mapper Methods ---

    private SupplierResponseDTO mapToSupplierResponseDTO(Supplier supplier) {
        SupplierResponseDTO dto = new SupplierResponseDTO();
        dto.setId(supplier.getId());
        dto.setName(supplier.getName());
        dto.setContactInfo(supplier.getContactInfo());
        dto.setSuppliedMaterial(supplier.getSuppliedMaterial());
        dto.setRating(supplier.getRating());
        return dto;
    }

    private PurchaseOrderResponseDTO mapToPurchaseOrderResponseDTO(PurchaseOrder order) {
        PurchaseOrderResponseDTO dto = new PurchaseOrderResponseDTO();
        dto.setId(order.getId());
        dto.setSupplierId(order.getSupplier().getId());
        dto.setSupplierName(order.getSupplier().getName());
        dto.setOrderDate(order.getOrderDate());
        dto.setExpectedDelivery(order.getExpectedDelivery());
        dto.setMaterialOrdered(order.getMaterialOrdered());
        dto.setQuantity(order.getQuantity());
        dto.setTotalCost(order.getTotalCost());
        dto.setStatus(order.getStatus().name());
        return dto;
    }

    private MaterialIntakeResponseDTO mapToMaterialIntakeResponseDTO(MaterialIntake intake) {
        MaterialIntakeResponseDTO dto = new MaterialIntakeResponseDTO();
        dto.setId(intake.getId());
        dto.setPurchaseOrderId(intake.getPurchaseOrder().getId());
        dto.setArrivalDate(intake.getArrivalDate());
        dto.setQuantityReceived(intake.getQuantityReceived());
        dto.setConditionNotes(intake.getConditionNotes());
        return dto;
    }
}
