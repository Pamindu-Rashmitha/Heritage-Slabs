package com.example.Heritage_Slabs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Heritage_Slabs.model.Vehicle;
import com.example.Heritage_Slabs.model.VehicleStatus;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByStatus(VehicleStatus status);

    boolean existsByLicensePlate(String licensePlate);
}
