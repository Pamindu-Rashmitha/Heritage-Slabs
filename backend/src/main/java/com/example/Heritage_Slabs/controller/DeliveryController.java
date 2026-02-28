package com.example.Heritage_Slabs.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Heritage_Slabs.model.Delivery;
import com.example.Heritage_Slabs.model.DeliveryStatus;
import com.example.Heritage_Slabs.model.Vehicle;
import com.example.Heritage_Slabs.service.LogisticService;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    @Autowired
    private LogisticService logisticService;

    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(logisticService.getAllDeliveries());
    }

    @GetMapping("/orders/ready")
    public ResponseEntity<List<Map<String, Object>>> getOrdersReadyForDispatch() {
        return ResponseEntity.ok(logisticService.getOrdersReadyForDispatch());
    }

    @GetMapping("/vehicles/available")
    public ResponseEntity<List<Vehicle>> getAvailableVehicles() {
        return ResponseEntity.ok(logisticService.getAvailableVehicles());
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignVehicle(@RequestBody Map<String, Object> request) {
        try {
            Long orderId = Long.valueOf(request.get("orderId").toString());
            Long vehicleId = Long.valueOf(request.get("vehicleId").toString());
            String driverName = (String) request.get("driverName");

            Delivery delivery = logisticService.assignVehicle(orderId, vehicleId, driverName);
            return ResponseEntity.ok(delivery);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateDeliveryStatus(
            @PathVariable Long id,
            @RequestParam DeliveryStatus status) {
        try {
            Delivery delivery = logisticService.updateDeliveryStatus(id, status);
            return ResponseEntity.ok(delivery);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
