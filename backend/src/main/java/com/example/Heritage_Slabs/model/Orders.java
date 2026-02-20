package com.example.Heritage_Slabs.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.Heritage_Slabs.model.User;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "Orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user_id;

    @Column(nullable = false)
    private double totalAmount;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private Date date;

    @Column(nullable = false)
    private String address;

}
