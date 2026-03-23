package com.example.Heritage_Slabs.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VehicleRequestDTO {

    @NotBlank(message = "License plate is required")
    private String licensePlate;

    @NotBlank(message = "Vehicle type is required")
    private String type;

    @NotNull(message = "Capacity is required")
    @Min(value = 100, message = "Capacity must be at least 100")
    private Integer capacity;

    private String status;
}
