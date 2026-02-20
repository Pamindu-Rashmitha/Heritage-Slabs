package com.example.Heritage_Slabs.controller;

import com.example.Heritage_Slabs.dto.request.orderDTO;
import com.example.Heritage_Slabs.model.Order;
import com.example.Heritage_Slabs.model.Status;
import com.example.Heritage_Slabs.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/orders")
@RequiredArgsConstructor
public class orderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody orderDTO orderDto) {
        return ResponseEntity.ok(orderService.createOrder(orderDto));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestParam Status status) {
        try {
            return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
