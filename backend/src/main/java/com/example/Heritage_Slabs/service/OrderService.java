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

import java.io.ByteArrayOutputStream;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ModelMapper modelMapper;
    private final EmailService emailService;

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
        result.put("phone", order.getPhoneNumber());
        result.put("address", order.getAddress());
        result.put("city", order.getCity());
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
            Order savedOrder = orderRepository.save(order);
            // Send confirmation email asynchronously
            emailService.sendOrderConfirmationEmail(savedOrder);
            return savedOrder;
        } else {
            order.setStatus(Status.Failed);
        }

        return orderRepository.save(order);
    }

    public byte[] generateInvoice(Long orderId) {
        Order order = getOrderById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Font configurations
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

            // Invoice Title
            Paragraph title = new Paragraph("PAYMENT INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Order Details
            document.add(new Paragraph("Order ID: #HS-" + String.format("%05d", order.getId()), headerFont));
            document.add(new Paragraph("Date: " + order.getDate().toString(), normalFont));
            document.add(new Paragraph("Status: " + order.getStatus().name(), normalFont));
            document.add(new Paragraph("Customer Email: " + (order.getUser_id() != null ? order.getUser_id().getEmail() : "N/A"), normalFont));
            document.add(new Paragraph("Shipping Address: " + order.getAddress(), normalFont));
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            // Items Table
            if (!items.isEmpty()) {
                PdfPTable table = new PdfPTable(4);
                table.setWidthPercentage(100);
                table.setSpacingBefore(10f);
                table.setSpacingAfter(10f);

                // Table Header
                String[] headers = {"Product", "Quantity", "Unit Price (LKR)", "Total (LKR)"};
                for (String headerTitle : headers) {
                    PdfPCell header = new PdfPCell(new Paragraph(headerTitle, headerFont));
                    header.setHorizontalAlignment(Element.ALIGN_CENTER);
                    header.setPadding(8);
                    table.addCell(header);
                }

                // Table Rows
                for (OrderItem item : items) {
                    String productName = item.getProduct_id() != null ? item.getProduct_id().getName() : "Product";
                    table.addCell(new PdfPCell(new Paragraph(productName, normalFont)));
                    
                    PdfPCell qtyCell = new PdfPCell(new Paragraph(String.valueOf(item.getQuantity()), normalFont));
                    qtyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    table.addCell(qtyCell);
                    
                    PdfPCell priceCell = new PdfPCell(new Paragraph(String.format("%.2f", item.getPriceAtOrder()), normalFont));
                    priceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    table.addCell(priceCell);
                    
                    PdfPCell totalCell = new PdfPCell(new Paragraph(String.format("%.2f", item.getQuantity() * item.getPriceAtOrder()), normalFont));
                    totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    table.addCell(totalCell);
                }
                document.add(table);
            } else {
                document.add(new Paragraph("No items found for this order.", normalFont));
            }

            // Total Amount
            Paragraph total = new Paragraph("Grand Total: LKR " + String.format("%.2f", order.getTotalAmount()), headerFont);
            total.setAlignment(Element.ALIGN_RIGHT);
            total.setSpacingBefore(20);
            document.add(total);

            // Footer note
            Paragraph footer = new Paragraph("Thank you for choosing Heritage Slabs!", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10));
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(30);
            document.add(footer);

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating invoice PDF", e);
        }
    }

}