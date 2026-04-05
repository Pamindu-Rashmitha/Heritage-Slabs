package com.example.Heritage_Slabs.controller;

import com.example.Heritage_Slabs.dto.request.orderDTO;
import com.example.Heritage_Slabs.model.Order;
import com.example.Heritage_Slabs.model.Status;
import com.example.Heritage_Slabs.service.OrderService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/orders")
@RequiredArgsConstructor
public class orderController {

    private final OrderService orderService;

    @Value("${frontend.url}")
    private String frontendUrl;

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
    public void paymentReturn(HttpServletResponse response) throws IOException {
        String baseUrl = frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
        response.sendRedirect(baseUrl + "/payment/success");
    }

    @GetMapping("/cancel")
    public void paymentCancel(HttpServletResponse response) throws IOException {
        String baseUrl = frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
        response.sendRedirect(baseUrl + "/cart");
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

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> getInvoice(@PathVariable Long id) {
        try {
            byte[] pdfBytes = orderService.generateInvoice(id);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Invoice_HS-" + id + ".pdf");
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}