package com.example.Heritage_Slabs.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DeliveryAssignRequestDTO {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    @NotBlank(message = "Driver name is required")
    private String driverName;
}
