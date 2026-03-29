package com.example.Heritage_Slabs.repository;

import com.example.Heritage_Slabs.model.AdminLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminLogRepository extends JpaRepository<AdminLog, Long> {
    List<AdminLog> findAllByOrderByLoginTimeDesc();
}
