package com.example.Heritage_Slabs.dto.response;

import com.example.Heritage_Slabs.model.TicketStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TicketResponseDTO {
    private String id;
    private String subject;
    private TicketStatus status;
    private String userId;
    private String userName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TicketMessageResponseDTO> messages;
}