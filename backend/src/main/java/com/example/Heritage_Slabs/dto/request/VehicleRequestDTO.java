package com.example.Heritage_Slabs.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class VehicleRequestDTO {

    @NotBlank(message = "License plate is required")
    @Pattern(regexp = "^[A-Za-z]{2,3}-\\d{4}$", message = "license plate format invalid")
    private String licensePlate;

    @NotBlank(message = "Vehicle type is required")
    private String type;

    @NotNull(message = "Capacity is required")
    @Min(value = 100, message = "Capacity must be at least 100")
    @Max(value = 3500, message = "Capacity must not exceed 3500")
    private Integer capacity;

    private String status;
}
