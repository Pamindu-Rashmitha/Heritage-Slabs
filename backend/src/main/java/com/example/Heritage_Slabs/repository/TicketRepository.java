package com.example.Heritage_Slabs.repository;

import com.example.Heritage_Slabs.model.Ticket;
import com.example.Heritage_Slabs.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, String> {
    List<Ticket> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Ticket> findByStatusOrderByCreatedAtDesc(TicketStatus status);
}