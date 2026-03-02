package com.example.Heritage_Slabs.controller;

import com.example.Heritage_Slabs.dto.request.TicketMessageRequestDTO;
import com.example.Heritage_Slabs.dto.request.TicketRequestDTO;
import com.example.Heritage_Slabs.dto.response.TicketResponseDTO;
import com.example.Heritage_Slabs.model.TicketStatus;
import com.example.Heritage_Slabs.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") 
public class TicketController {

    private final TicketService ticketService;

    // Create a new ticket (User)
    @PostMapping("/user/{userId}")
    public ResponseEntity<TicketResponseDTO> createTicket(
            @PathVariable Long userId, // Changed to Long
            @RequestBody TicketRequestDTO request) {
        return ResponseEntity.ok(ticketService.createTicket(userId, request));
    }

    // Add a message to an existing ticket (User or Admin)
    @PostMapping("/{ticketId}/messages/sender/{senderId}")
    public ResponseEntity<TicketResponseDTO> addMessage(
            @PathVariable String ticketId,
            @PathVariable Long senderId, // Changed to Long
            @RequestBody TicketMessageRequestDTO request) {
        return ResponseEntity.ok(ticketService.addMessage(ticketId, senderId, request));
    }

    // Update ticket status (Admin)
    @PatchMapping("/{ticketId}/status")
    public ResponseEntity<TicketResponseDTO> updateStatus(
            @PathVariable String ticketId,
            @RequestParam TicketStatus status) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(ticketId, status));
    }

    // Get all tickets for a specific user (User)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketResponseDTO>> getUserTickets(
            @PathVariable Long userId) { // Changed to Long
        return ResponseEntity.ok(ticketService.getUserTickets(userId));
    }

    // Get a specific ticket's details (User or Admin)
    @GetMapping("/{ticketId}")
    public ResponseEntity<TicketResponseDTO> getTicketById(@PathVariable String ticketId) {
        return ResponseEntity.ok(ticketService.getTicketById(ticketId));
    }

    // Get all tickets (Admin)
    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }
}