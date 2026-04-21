package com.example.Heritage_Slabs.service;

import com.example.Heritage_Slabs.model.Delivery;
import com.example.Heritage_Slabs.model.DeliveryStatus;
import com.example.Heritage_Slabs.model.Order;
import com.example.Heritage_Slabs.model.OrderItem;
import com.example.Heritage_Slabs.repository.OrderItemRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final OrderItemRepository orderItemRepository;

    @Async
    public void sendOrderConfirmationEmail(Order order) {
        try {
            String toEmail = order.getContactEmail();
            String customerName = order.getUser_id().getName();

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("✅ Order Confirmed – Heritage Slabs #HS-" + String.format("%05d", order.getId()));

            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

            // Build items table rows
            StringBuilder itemRows = new StringBuilder();
            for (OrderItem item : items) {
                String productName = item.getProduct_id() != null ? item.getProduct_id().getName() : "Product";
                double lineTotal = item.getQuantity() * item.getPriceAtOrder();
                itemRows.append(String.format("""
                    <tr>
                        <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6; color:#111827; font-weight:600;">%s</td>
                        <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6; text-align:center; color:#6b7280;">%d</td>
                        <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6; text-align:right; color:#6b7280;">LKR %,.2f</td>
                        <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6; text-align:right; color:#2563eb; font-weight:700;">LKR %,.2f</td>
                    </tr>
                """, productName, item.getQuantity(), item.getPriceAtOrder(), lineTotal));
            }

            // Delivery date formatting
            String deliveryDate = order.getPreferredDeliveryDate() != null
                    ? order.getPreferredDeliveryDate().format(DateTimeFormatter.ofPattern("dd MMMM yyyy"))
                    : "To be confirmed";

            String orderNote = (order.getOrderNote() != null && !order.getOrderNote().isBlank())
                    ? order.getOrderNote()
                    : "<em style='color:#9ca3af;'>No special notes</em>";

            String html = String.format("""
                <!DOCTYPE html>
                <html>
                <head><meta charset="UTF-8"></head>
                <body style="margin:0; padding:0; background:#f9fafb; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
                  <div style="max-width:640px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <div style="background:linear-gradient(135deg, #1e3a8a 0%%, #2563eb 100%%); padding:40px 40px 32px; text-align:center;">
                      <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:800; letter-spacing:-0.5px;">Heritage Slabs</h1>
                      <p style="margin:8px 0 0; color:#bfdbfe; font-size:14px; font-weight:500; letter-spacing:2px; text-transform:uppercase;">Premium Natural Stone</p>
                    </div>
                    
                    <!-- Success Banner -->
                    <div style="background:#ecfdf5; border-bottom:2px solid #6ee7b7; padding:20px 40px; text-align:center;">
                      <p style="margin:0; color:#065f46; font-size:18px; font-weight:700;">✅ Payment Confirmed – Your order is placed!</p>
                    </div>
                    
                    <!-- Greeting -->
                    <div style="padding:32px 40px 0;">
                      <p style="margin:0; color:#374151; font-size:16px;">Dear <strong>%s</strong>,</p>
                      <p style="color:#6b7280; font-size:14px; line-height:1.6; margin:12px 0 0;">
                        Thank you for choosing Heritage Slabs. We've received your payment and your order is now confirmed.
                        Our team will reach out to coordinate delivery.
                      </p>
                    </div>
                    
                    <!-- Order ID + Date -->
                    <div style="margin:24px 40px; background:#eff6ff; border-radius:12px; padding:20px 24px; display:flex; justify-content:space-between;">
                      <div>
                        <p style="margin:0; font-size:11px; color:#6b7280; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Order Reference</p>
                        <p style="margin:4px 0 0; font-size:20px; font-weight:800; color:#1e3a8a; font-family:monospace;">#HS-%s</p>
                      </div>
                      <div style="text-align:right;">
                        <p style="margin:0; font-size:11px; color:#6b7280; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Order Date</p>
                        <p style="margin:4px 0 0; font-size:14px; font-weight:600; color:#374151;">%s</p>
                      </div>
                    </div>
                    
                    <!-- Items Table -->
                    <div style="margin:0 40px;">
                      <p style="font-size:13px; font-weight:800; color:#374151; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">Order Items</p>
                      <table width="100%%" style="border-collapse:collapse; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden;">
                        <thead>
                          <tr style="background:#f8faff;">
                            <th style="padding:12px 16px; text-align:left; font-size:11px; color:#6b7280; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Product</th>
                            <th style="padding:12px 16px; text-align:center; font-size:11px; color:#6b7280; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Qty (sqft)</th>
                            <th style="padding:12px 16px; text-align:right; font-size:11px; color:#6b7280; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Unit Price</th>
                            <th style="padding:12px 16px; text-align:right; font-size:11px; color:#6b7280; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          %s
                        </tbody>
                      </table>
                    </div>
                    
                    <!-- Total -->
                    <div style="margin:16px 40px; text-align:right;">
                      <p style="margin:0; font-size:13px; color:#6b7280; font-weight:600;">Grand Total</p>
                      <p style="margin:4px 0 0; font-size:28px; font-weight:900; color:#2563eb;">LKR %,.2f</p>
                    </div>
                    
                    <!-- Delivery Info -->
                    <div style="margin:0 40px 24px; background:#f8faff; border:1px solid #dbeafe; border-radius:12px; padding:20px 24px;">
                      <p style="margin:0 0 14px; font-size:13px; font-weight:800; color:#374151; text-transform:uppercase; letter-spacing:1px;">Delivery Details</p>
                      <table width="100%%">
                        <tr>
                          <td style="width:140px; padding:4px 0; font-size:12px; color:#9ca3af; font-weight:600;">Address</td>
                          <td style="padding:4px 0; font-size:13px; color:#374151; font-weight:600;">%s</td>
                        </tr>
                        <tr>
                          <td style="padding:4px 0; font-size:12px; color:#9ca3af; font-weight:600;">City / Province</td>
                          <td style="padding:4px 0; font-size:13px; color:#374151; font-weight:600;">%s, %s %s</td>
                        </tr>
                        <tr>
                          <td style="padding:4px 0; font-size:12px; color:#9ca3af; font-weight:600;">Preferred Delivery</td>
                          <td style="padding:4px 0; font-size:13px; color:#374151; font-weight:600;">%s</td>
                        </tr>
                        <tr>
                          <td style="padding:4px 0; font-size:12px; color:#9ca3af; font-weight:600; vertical-align:top;">Order Note</td>
                          <td style="padding:4px 0; font-size:13px; color:#374151;">%s</td>
                        </tr>
                      </table>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background:#f3f4f6; padding:24px 40px; text-align:center; border-top:1px solid #e5e7eb;">
                      <p style="margin:0; font-size:12px; color:#9ca3af;">Questions? Contact us at <a href="mailto:support@heritageslabs.lk" style="color:#2563eb;">support@heritageslabs.lk</a></p>
                      <p style="margin:8px 0 0; font-size:11px; color:#d1d5db;">© 2026 Heritage Slabs · Sri Lanka's Premium Natural Stone</p>
                    </div>
                    
                  </div>
                </body>
                </html>
                """,
                    customerName,
                    String.format("%05d", order.getId()),
                    new java.text.SimpleDateFormat("dd MMMM yyyy").format(order.getDate()),
                    itemRows.toString(),
                    order.getTotalAmount(),
                    order.getAddress(),
                    order.getCity(), order.getProvince(), order.getPostalCode(),
                    deliveryDate,
                    orderNote
            );

            helper.setText(html, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            // Log but don't crash — email failure shouldn't block the order flow
            System.err.println("[EmailService] Failed to send order confirmation email: " + e.getMessage());
        }
    }

    /**
     * Notifies the customer when a delivery status changes (shipped, delivered, etc.).
     */
    @Async
    public void sendDeliveryStatusUpdateEmail(Order order, Delivery delivery, DeliveryStatus status) {
        try {
            String toEmail = order.getContactEmail();
            String customerName = order.getUser_id() != null ? order.getUser_id().getName() : "Customer";

            String headline;
            String leadParagraph;
            String accentColor;
            String bannerBg;
            String subjectSuffix;

            switch (status) {
                case PENDING -> {
                    headline = "Your delivery is being prepared";
                    leadParagraph = "We've scheduled your shipment and will notify you again when it's on the way.";
                    accentColor = "#92400e";
                    bannerBg = "#fffbeb";
                    subjectSuffix = "Delivery update – preparing your order";
                }
                case SHIPPED -> {
                    headline = "Your order is on the way";
                    leadParagraph = "Your Heritage Slabs delivery has been shipped and is heading to you.";
                    accentColor = "#1e40af";
                    bannerBg = "#eff6ff";
                    subjectSuffix = "Your delivery is being shipped";
                }
                case DELIVERED -> {
                    headline = "Your order has been delivered";
                    leadParagraph = "Your delivery has been completed. We hope you enjoy your stone from Heritage Slabs.";
                    accentColor = "#065f46";
                    bannerBg = "#ecfdf5";
                    subjectSuffix = "Delivery complete";
                }
                default -> {
                    headline = "Delivery update";
                    leadParagraph = "There is an update to your delivery.";
                    accentColor = "#374151";
                    bannerBg = "#f3f4f6";
                    subjectSuffix = "Delivery update";
                }
            }

            String driverLine = (delivery.getDriverName() != null && !delivery.getDriverName().isBlank())
                    ? delivery.getDriverName()
                    : "Assigned driver";
            String etaLine = (delivery.getEstimatedTime() != null && !delivery.getEstimatedTime().isBlank())
                    ? delivery.getEstimatedTime()
                    : "We'll share timing as soon as possible";
            String vehicleLine = "";
            if (delivery.getVehicle() != null) {
                String plate = delivery.getVehicle().getLicensePlate() != null
                        ? delivery.getVehicle().getLicensePlate()
                        : "";
                String vType = delivery.getVehicle().getType() != null
                        ? delivery.getVehicle().getType()
                        : "";
                if (!plate.isEmpty() || !vType.isEmpty()) {
                    vehicleLine = String.format(
                            "<tr><td style=\"padding:4px 0;font-size:12px;color:#9ca3af;font-weight:600;\">Vehicle</td>"
                                    + "<td style=\"padding:4px 0;font-size:13px;color:#374151;font-weight:600;\">%s %s</td></tr>",
                            vType.isEmpty() ? "" : vType + " · ",
                            plate);
                }
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Heritage Slabs — " + subjectSuffix + " · #HS-" + String.format("%05d", order.getId()));

            String html = String.format("""
                <!DOCTYPE html>
                <html>
                <head><meta charset="UTF-8"></head>
                <body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
                  <div style="max-width:640px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    <div style="background:linear-gradient(135deg,#1e3a8a 0%%,#2563eb 100%%);padding:40px 40px 32px;text-align:center;">
                      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;">Heritage Slabs</h1>
                      <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;font-weight:500;letter-spacing:2px;text-transform:uppercase;">Delivery</p>
                    </div>
                    <div style="background:%s;border-bottom:2px solid %s;padding:20px 40px;text-align:center;">
                      <p style="margin:0;color:%s;font-size:18px;font-weight:700;">%s</p>
                    </div>
                    <div style="padding:32px 40px 0;">
                      <p style="margin:0;color:#374151;font-size:16px;">Dear <strong>%s</strong>,</p>
                      <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:12px 0 0;">%s</p>
                    </div>
                    <div style="margin:24px 40px;background:#f8faff;border:1px solid #dbeafe;border-radius:12px;padding:20px 24px;">
                      <p style="margin:0 0 14px;font-size:13px;font-weight:800;color:#374151;text-transform:uppercase;letter-spacing:1px;">Shipment details</p>
                      <table width="100%%">
                        <tr>
                          <td style="width:140px;padding:4px 0;font-size:12px;color:#9ca3af;font-weight:600;">Order</td>
                          <td style="padding:4px 0;font-size:13px;color:#374151;font-weight:700;font-family:monospace;">#HS-%s</td>
                        </tr>
                        <tr>
                          <td style="padding:4px 0;font-size:12px;color:#9ca3af;font-weight:600;">Status</td>
                          <td style="padding:4px 0;font-size:13px;color:#374151;font-weight:700;">%s</td>
                        </tr>
                        <tr>
                          <td style="padding:4px 0;font-size:12px;color:#9ca3af;font-weight:600;">Driver</td>
                          <td style="padding:4px 0;font-size:13px;color:#374151;font-weight:600;">%s</td>
                        </tr>
                        <tr>
                          <td style="padding:4px 0;font-size:12px;color:#9ca3af;font-weight:600;vertical-align:top;">Est. timing</td>
                          <td style="padding:4px 0;font-size:13px;color:#374151;">%s</td>
                        </tr>
                        %s
                      </table>
                    </div>
                    <div style="background:#f3f4f6;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;">Questions? <a href="mailto:vijithagranite@gmail.com" style="color:#2563eb;">support@heritageslabs.lk</a></p>
                      <p style="margin:8px 0 0;font-size:11px;color:#d1d5db;">© 2026 Heritage Slabs</p>
                    </div>
                  </div>
                </body>
                </html>
                """,
                    bannerBg,
                    accentColor,
                    accentColor,
                    headline,
                    customerName,
                    leadParagraph,
                    String.format("%05d", order.getId()),
                    status.name(),
                    driverLine,
                    etaLine,
                    vehicleLine
            );

            helper.setText(html, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("[EmailService] Failed to send delivery status email: " + e.getMessage());
        }
    }
}
