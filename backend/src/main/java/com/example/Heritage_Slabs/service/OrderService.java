package com.example.Heritage_Slabs.service;

import com.example.Heritage_Slabs.dto.request.orderDTO;
import com.example.Heritage_Slabs.model.Order;
import com.example.Heritage_Slabs.model.OrderItem;
import com.example.Heritage_Slabs.model.Status;
import com.example.Heritage_Slabs.repository.OrderItemRepository;
import com.example.Heritage_Slabs.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ModelMapper modelMapper;

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

    //yyy
}
