package com.example.Heritage_Slabs.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class TicketRequestDTO {

    @NotBlank(message = "Subject is required")
    @Size(min = 5, max = 200, message = "Subject must be 5-200 characters")
    @Pattern(regexp = ".*[a-zA-Z].*", message = "Subject must contain at least one letter")
    private String subject;

    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 5000, message = "Message must be 10-5000 characters")
    @Pattern(regexp = ".*[a-zA-Z].*", message = "Message must contain at least one letter")
    private String initialMessage;
}