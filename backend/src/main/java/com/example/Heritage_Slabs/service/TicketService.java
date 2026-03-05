package com.example.Heritage_Slabs.service;

import com.example.Heritage_Slabs.dto.request.TicketMessageRequestDTO;
import com.example.Heritage_Slabs.dto.request.TicketRequestDTO;
import com.example.Heritage_Slabs.dto.response.TicketMessageResponseDTO;
import com.example.Heritage_Slabs.dto.response.TicketResponseDTO;
import com.example.Heritage_Slabs.model.*;
import com.example.Heritage_Slabs.repository.TicketMessageRepository;
import com.example.Heritage_Slabs.repository.TicketRepository;
import com.example.Heritage_Slabs.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketMessageRepository ticketMessageRepository;
    private final UserRepository userRepository;

    // CHANGED: userId is now Long
    public TicketResponseDTO createTicket(Long userId, TicketRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ticket ticket = new Ticket();
        ticket.setSubject(request.getSubject());
        ticket.setUser(user);
        ticket.setStatus(TicketStatus.PENDING);
        ticket = ticketRepository.save(ticket);

        TicketMessage initialMsg = new TicketMessage();
        initialMsg.setTicket(ticket);
        initialMsg.setSender(user);
        initialMsg.setMessage(request.getInitialMessage());
        ticketMessageRepository.save(initialMsg);

        return getTicketById(ticket.getId());
    }

    // CHANGED: senderId is now Long
    public TicketResponseDTO addMessage(String ticketId, Long senderId, TicketMessageRequestDTO request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (ticket.getStatus() == TicketStatus.RESOLVED) {
            throw new RuntimeException("Cannot reply to a resolved ticket.");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        TicketMessage message = new TicketMessage();
        message.setTicket(ticket);
        message.setSender(sender);
        message.setMessage(request.getMessage());
        ticketMessageRepository.save(message);

        if (sender.getRole() == Role.ADMIN && ticket.getStatus() == TicketStatus.PENDING) {
            ticket.setStatus(TicketStatus.ONGOING);
            ticketRepository.save(ticket);
        }

        return getTicketById(ticket.getId());
    }

    public TicketResponseDTO updateTicketStatus(String ticketId, TicketStatus newStatus) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(newStatus);
        ticketRepository.save(ticket);
        return getTicketById(ticket.getId());
    }

    // CHANGED: userId is now Long
    public List<TicketResponseDTO> getUserTickets(Long userId) {
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<TicketResponseDTO> getAllTickets() {
        return ticketRepository.findAll()
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public TicketResponseDTO getTicketById(String ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        return mapToDTO(ticket);
    }

    private TicketResponseDTO mapToDTO(Ticket ticket) {
        TicketResponseDTO dto = new TicketResponseDTO();
        dto.setId(ticket.getId());
        dto.setSubject(ticket.getSubject());
        dto.setStatus(ticket.getStatus());
        
        // CHANGED: Convert Long ID to String for the DTO
        dto.setUserId(String.valueOf(ticket.getUser().getId()));
        dto.setUserName(ticket.getUser().getName());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());

        List<TicketMessageResponseDTO> messageDTOs = ticket.getMessages().stream().map(msg -> {
            TicketMessageResponseDTO msgDto = new TicketMessageResponseDTO();
            msgDto.setId(msg.getId());
            
            // CHANGED: Convert Long ID to String for the DTO
            msgDto.setSenderId(String.valueOf(msg.getSender().getId()));
            msgDto.setSenderName(msg.getSender().getName());
            msgDto.setSenderRole(msg.getSender().getRole().name());
            msgDto.setMessage(msg.getMessage());
            msgDto.setSentAt(msg.getSentAt());
            return msgDto;
        }).collect(Collectors.toList());

        dto.setMessages(messageDTOs);
        return dto;
    }
}