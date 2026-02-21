package com.example.Heritage_Slabs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Heritage_Slabs.model.Vehicle;
import com.example.Heritage_Slabs.model.VehicleStatus;
import com.example.Heritage_Slabs.service.LogisticService;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Map<String, Object> request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setLicensePlate((String) request.get("licensePlate"));
        vehicle.setType((String) request.get("type"));
        vehicle.setCapacity(Integer.valueOf(request.get("capacity").toString()));
        return ResponseEntity.ok(logisticService.createVehicle(vehicle));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setLicensePlate((String) request.get("licensePlate"));
        vehicle.setType((String) request.get("type"));
        vehicle.setCapacity(Integer.valueOf(request.get("capacity").toString()));
        if (request.get("status") != null) {
            vehicle.setStatus(VehicleStatus.valueOf((String) request.get("status")));
        }
        return ResponseEntity.ok(logisticService.updateVehicle(id, vehicle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        logisticService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
