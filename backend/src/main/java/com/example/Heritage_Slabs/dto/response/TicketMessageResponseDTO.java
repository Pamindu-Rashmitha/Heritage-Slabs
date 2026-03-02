package com.example.Heritage_Slabs.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TicketMessageResponseDTO {
    private String id;
    private String senderId;
    private String senderName;
    private String senderRole;
    private String message;
    private LocalDateTime sentAt;
}