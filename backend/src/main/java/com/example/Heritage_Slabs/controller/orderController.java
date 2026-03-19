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
import java.util.Map;

@RestController
@RequestMapping("api/orders")
@RequiredArgsConstructor
public class orderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@Valid @RequestBody orderDTO orderDto) {
        return ResponseEntity.ok(orderService.createOrder(orderDto));
    }

    @PostMapping("/notify")
    public ResponseEntity<Order> handleNotification(
            @RequestParam String order_id,
            @RequestParam String payment_id,
            @RequestParam String payhere_amount,
            @RequestParam String status_code,
            @RequestParam String md5sig) {
        Order order = orderService.handlePayHereNotification(
                order_id, payment_id, payhere_amount, status_code, md5sig);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/initiate/{orderId}")
    public ResponseEntity<Map<String, String>> initiatePayment(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return ResponseEntity.ok(orderService.initiatePayment(order));
    }

    @GetMapping("/return")
    public ResponseEntity<String> paymentReturn() {
        return ResponseEntity.ok("Payment Successful!");
    }

    @GetMapping("/cancel")
    public ResponseEntity<String> paymentCancel() {
        return ResponseEntity.ok("Payment Cancelled!");
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders(@RequestParam(required = false) String email) {
        if (email != null) {
            return ResponseEntity.ok(orderService.getOrdersByEmail(email));
        }
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
