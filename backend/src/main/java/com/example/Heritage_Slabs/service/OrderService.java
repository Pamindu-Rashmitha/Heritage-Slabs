package com.example.Heritage_Slabs.service;

import com.example.Heritage_Slabs.dto.request.orderDTO;
import com.example.Heritage_Slabs.model.Order;
import com.example.Heritage_Slabs.model.OrderItem;
import com.example.Heritage_Slabs.model.Status;
import com.example.Heritage_Slabs.repository.OrderItemRepository;
import com.example.Heritage_Slabs.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ModelMapper modelMapper;

    @Value("${payhere.merchant.id}")
    private String merchant_id;

    @Value("${payhere.merchant.secret}")
    private String merchant_secret;

    @Value("${backend_domain}")
    private String backendDomain;

    @Transactional
    public Order createOrder(orderDTO orderDto) {
        Order order = modelMapper.map(orderDto, Order.class);
        order.setId(null);
        Order savedOrder = orderRepository.save(order);

        if (orderDto.getItems() != null) {
            for (var itemDto : orderDto.getItems()) {
                OrderItem item = modelMapper.map(itemDto, OrderItem.class);
                item.setId(null);
                item.setOrder_id(savedOrder);
                orderItemRepository.save(item);
            }
        }
        return savedOrder;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByUserEmail(email);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Transactional
    public Order updateOrderStatus(Long id, Status status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    @Transactional
    public OrderItem addOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    public Map<String, String> initiatePayment(Order order) {
        // Making Sure the status --> PENDING
        if (order.getStatus() != Status.Pending) {
            throw new RuntimeException("Order status is not Pending");
        }

        // Prepare Payhere data
        String formattedAmount = String.format("%.2f", order.getTotalAmount());

        Map<String, String> result = new HashMap<>();
        result.put("merchant_id", merchant_id);
        result.put("notify_url", backendDomain + "/api/orders/notify");
        result.put("return_url", backendDomain + "/api/orders/return");
        result.put("cancel_url", backendDomain + "/api/orders/cancel");
        result.put("order_id", order.getId() + "");
        result.put("items", "Heritage Slabs Order #" + order.getId());
        result.put("currency", "LKR");
        result.put("amount", formattedAmount);

        // Customer details
        result.put("first_name", order.getUser_id().getName());
        result.put("last_name", "");
        result.put("email", order.getUser_id().getEmail());
        result.put("phone", "");
        result.put("address", order.getAddress());
        result.put("city", "");
        result.put("country", "Sri Lanka");

        // Generate hash using the same formatted amount
        String hash = generateHash(
                merchant_id,
                order.getId() + "",
                formattedAmount,
                "LKR");

        result.put("hash", hash);

        return result;
    }

    private String generateHash(String merchantId, String orderId, String amount, String currency) {
        try {
            String secretMd5 = md5(merchant_secret).toUpperCase();
            String raw = merchantId + orderId + amount + currency + secretMd5;
            return md5(raw).toUpperCase();
        } catch (Exception e) {
            throw new RuntimeException("Hash generation failed");
        }
    }

    private String md5(String input) throws Exception {
        java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
        byte[] hash = md.digest(input.getBytes());
        StringBuilder sb = new StringBuilder();
        for (byte b : hash) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    public Order handlePayHereNotification(String orderId, String payherePaymentId,
            String amount, String statusCode, String md5sig) {
        // 1. Get order
        Order order = orderRepository.findById(Long.parseLong(orderId))
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 2. Generate MD5 and verify
        try {
            String secretMd5 = md5(merchant_secret).toUpperCase();
            String raw = merchant_id + orderId + amount + "LKR" + statusCode + secretMd5;
            String generatedMd5 = md5(raw);

            if (!generatedMd5.equalsIgnoreCase(md5sig)) {
                throw new RuntimeException("Invalid payment signature!");
            }
        } catch (Exception e) {
            throw new RuntimeException("MD5 verification failed");
        }

        // 3. Update order status
        if (statusCode.equals("2")) { // 2 = SUCCESS in PayHere
            order.setStatus(Status.Paid);
        } else {
            order.setStatus(Status.Failed);
        }

        return orderRepository.save(order);
    }

}