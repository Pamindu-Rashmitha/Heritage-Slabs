package com.example.Heritage_Slabs.dto.request;

import com.example.Heritage_Slabs.model.Status;
import com.example.Heritage_Slabs.model.User;
import com.example.Heritage_Slabs.dto.response.orderItemDTO;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class orderDTO {

    private Long id;

    @NotNull(message = "User is required")
    private User user_id;

    private double totalAmount;

    @NotNull(message = "Order status is required")
    private Status status;

    @NotNull(message = "Order date is required")
    private Date date;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(0|\\+94)\\d{9}$", message = "Phone number must be a valid Sri Lankan number (e.g. 0771234567 or +94771234567)")
    private String phoneNumber;

    private List<orderItemDTO> items;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "\\d{5}", message = "Postal code must be exactly 5 digits")
    private String postalCode;

    @NotBlank(message = "Province is required")
    private String province;

    @NotNull(message = "Preferred delivery date is required")
    @FutureOrPresent(message = "Preferred delivery date must be today or a future date")
    private LocalDate preferredDeliveryDate;

    // Optional field — no @NotBlank
    private String orderNote;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Please enter a valid email address")
    private String contactEmail;

    /**
     * Custom cross-field validation: preferred delivery date must be
     * within 1 month (30 days) of the order date for Sri Lankan logistics.
     */
    @AssertTrue(message = "Preferred delivery date must be within 30 days of the order date")
    public boolean isPreferredDeliveryDateWithinOneMonth() {
        if (date == null || preferredDeliveryDate == null) return true; // let @NotNull handle nulls
        LocalDate orderLocalDate = date.toInstant()
                .atZone(java.time.ZoneId.of("Asia/Colombo"))
                .toLocalDate();
        LocalDate maxAllowedDate = orderLocalDate.plusDays(30);
        return !preferredDeliveryDate.isAfter(maxAllowedDate);
    }
}
