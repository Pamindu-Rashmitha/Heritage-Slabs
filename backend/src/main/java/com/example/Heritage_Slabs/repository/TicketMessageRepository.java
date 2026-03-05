package com.example.Heritage_Slabs.repository;

import com.example.Heritage_Slabs.model.TicketMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketMessageRepository extends JpaRepository<TicketMessage, String> {
    List<TicketMessage> findByTicketIdOrderBySentAtAsc(String ticketId);
}