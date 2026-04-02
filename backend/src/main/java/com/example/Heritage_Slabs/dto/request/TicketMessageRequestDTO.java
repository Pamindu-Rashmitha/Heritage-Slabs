package com.example.Heritage_Slabs.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class TicketMessageRequestDTO {

    @NotBlank(message = "Message is required")
    @Size(min = 1, max = 5000, message = "Message must be under 5000 characters")
    private String message;
}