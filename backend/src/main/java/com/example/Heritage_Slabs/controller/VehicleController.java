package com.example.Heritage_Slabs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Heritage_Slabs.model.Vehicle;
import com.example.Heritage_Slabs.model.VehicleStatus;
import com.example.Heritage_Slabs.service.LogisticService;
import com.example.Heritage_Slabs.dto.request.VehicleRequestDTO;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private LogisticService logisticService;

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(logisticService.getAllVehicles());
    }

    @GetMapping("/available")
    public ResponseEntity<List<Vehicle>> getAvailableVehicles() {
        return ResponseEntity.ok(logisticService.getAvailableVehicles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(logisticService.getVehicleById(id));
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@Valid @RequestBody VehicleRequestDTO request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setLicensePlate(request.getLicensePlate());
        vehicle.setType(request.getType());
        vehicle.setCapacity(request.getCapacity());
        if (request.getStatus() != null) {
            vehicle.setStatus(VehicleStatus.valueOf(request.getStatus()));
        }
        return ResponseEntity.ok(logisticService.createVehicle(vehicle));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequestDTO request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setLicensePlate(request.getLicensePlate());
        vehicle.setType(request.getType());
        vehicle.setCapacity(request.getCapacity());
        if (request.getStatus() != null) {
            vehicle.setStatus(VehicleStatus.valueOf(request.getStatus()));
        }
        return ResponseEntity.ok(logisticService.updateVehicle(id, vehicle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        logisticService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
