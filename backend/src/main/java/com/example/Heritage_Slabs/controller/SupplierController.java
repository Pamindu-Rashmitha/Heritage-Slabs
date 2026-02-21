package com.example.Heritage_Slabs.controller;

import com.example.Heritage_Slabs.dto.request.MaterialIntakeRequestDTO;
import com.example.Heritage_Slabs.dto.request.PurchaseOrderRequestDTO;
import com.example.Heritage_Slabs.dto.request.SupplierRequestDTO;
import com.example.Heritage_Slabs.dto.response.MaterialIntakeResponseDTO;
import com.example.Heritage_Slabs.dto.response.PurchaseOrderResponseDTO;
import com.example.Heritage_Slabs.dto.response.SupplierResponseDTO;
import com.example.Heritage_Slabs.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    // --- Supplier Endpoints ---

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SupplierResponseDTO> createSupplier(@Valid @RequestBody SupplierRequestDTO dto) {
        SupplierResponseDTO response = supplierService.createSupplier(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<List<SupplierResponseDTO>> getAllSuppliers() {
        return ResponseEntity.ok(supplierService.getAllSuppliers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<SupplierResponseDTO> getSupplierById(@PathVariable Long id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SupplierResponseDTO> updateSupplier(@PathVariable Long id,
            @Valid @RequestBody SupplierRequestDTO dto) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }

    // --- Purchase Order Endpoints ---

    @PostMapping("/purchase-orders")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PurchaseOrderResponseDTO> createPurchaseOrder(
            @Valid @RequestBody PurchaseOrderRequestDTO dto) {
        PurchaseOrderResponseDTO response = supplierService.createPurchaseOrder(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/purchase-orders")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<PurchaseOrderResponseDTO>> getAllPurchaseOrders() {
        return ResponseEntity.ok(supplierService.getAllPurchaseOrders());
    }

    @GetMapping("/{supplierId}/purchase-orders")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<PurchaseOrderResponseDTO>> getPurchaseOrdersBySupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(supplierService.getPurchaseOrdersBySupplier(supplierId));
    }

    @PutMapping("/purchase-orders/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PurchaseOrderResponseDTO> updatePurchaseOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(supplierService.updatePurchaseOrderStatus(id, status));
    }

    // --- Material Intake Endpoints ---

    @PostMapping("/material-intakes")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<MaterialIntakeResponseDTO> logMaterialIntake(
            @Valid @RequestBody MaterialIntakeRequestDTO dto) {
        MaterialIntakeResponseDTO response = supplierService.logMaterialIntake(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/purchase-orders/{purchaseOrderId}/material-intakes")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<MaterialIntakeResponseDTO>> getIntakesByPurchaseOrder(
            @PathVariable Long purchaseOrderId) {
        return ResponseEntity.ok(supplierService.getIntakesByPurchaseOrder(purchaseOrderId));
    }
}
