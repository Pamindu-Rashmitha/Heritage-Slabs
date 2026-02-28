package com.example.Heritage_Slabs.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Heritage_Slabs.model.Delivery;
import com.example.Heritage_Slabs.model.Order;
import com.example.Heritage_Slabs.model.DeliveryStatus;
import com.example.Heritage_Slabs.model.Status;
import com.example.Heritage_Slabs.model.Vehicle;
import com.example.Heritage_Slabs.model.VehicleStatus;
import com.example.Heritage_Slabs.repository.DeliveryRepository;
import com.example.Heritage_Slabs.repository.OrderRepository;
import com.example.Heritage_Slabs.repository.VehicleRepository;

@Service
public class LogisticService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByStatus(VehicleStatus.AVAILABLE);
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
    }

    @Transactional
    public Vehicle createVehicle(Vehicle vehicle) {
        if (vehicleRepository.existsByLicensePlate(vehicle.getLicensePlate())) {
            throw new RuntimeException("Vehicle with license plate " + vehicle.getLicensePlate() + " already exists");
        }
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setLicensePlate(vehicleDetails.getLicensePlate());
        vehicle.setType(vehicleDetails.getType());
        vehicle.setCapacity(vehicleDetails.getCapacity());
        vehicle.setStatus(vehicleDetails.getStatus());
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new RuntimeException("Vehicle not found with id: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Map<String, Object>> getOrdersReadyForDispatch() {
        List<Order> orders = orderRepository.findByStatus(Status.PAID);

        // Map to simple response format for frontend
        return orders.stream().map(order -> {
            Map<String, Object> response = new HashMap<>();
            response.put("id", order.getId());
            response.put("userId", order.getUser_id().getId());
            response.put("userName", order.getUser_id().getName());
            response.put("totalAmount", order.getTotalAmount());
            response.put("status", order.getStatus().name());
            response.put("orderDate", order.getDate());
            response.put("address", order.getAddress());
            return response;
        }).collect(Collectors.toList());
    }

    @Transactional
    public Delivery assignVehicle(Long orderId, Long vehicleId, String driverName) {
        // 1. Validate and get the order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        if (order.getStatus() != Status.PAID) {
            throw new RuntimeException("Order is not in PAID status. Current status: " + order.getStatus());
        }

        // 2. Validate and get the vehicle
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + vehicleId));

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new RuntimeException("Vehicle is not available. Current status: " + vehicle.getStatus());
        }

        // 3. Create Delivery record
        Delivery delivery = new Delivery();
        delivery.setOrderId(orderId);
        delivery.setVehicle(vehicle);
        delivery.setDriverName(driverName);
        delivery.setEstimatedTime("2-4 business days");
        delivery.setStatus(DeliveryStatus.SHIPPED);
        delivery.setCreatedAt(LocalDateTime.now());

        // 4. Update Vehicle status to IN_TRANSIT
        vehicle.setStatus(VehicleStatus.IN_TRANSIT);
        vehicleRepository.save(vehicle);

        // 5. Update Order status to SHIPPED
        order.setStatus(Status.SHIPPED);
        orderRepository.save(order);

        // 6. Save and return the delivery
        return deliveryRepository.save(delivery);
    }

    @Transactional
    public Delivery updateDeliveryStatus(Long deliveryId, DeliveryStatus status) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found with id: " + deliveryId));

        delivery.setStatus(status);

        // If delivered, mark vehicle as available again
        if (status == DeliveryStatus.DELIVERED) {
            Vehicle vehicle = delivery.getVehicle();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(vehicle);

            // Also update order status to DELIVERED
            Order order = orderRepository.findById(delivery.getOrderId())
                    .orElseThrow(() -> new RuntimeException("Order not found"));
            order.setStatus(Status.DELIVERED);
            orderRepository.save(order);
        }

        return deliveryRepository.save(delivery);
    }
}
