package com.example.Heritage_Slabs.dto.request;

import com.example.Heritage_Slabs.model.Status;
import com.example.Heritage_Slabs.model.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class orderDTO {

    @NotNull
    private Long id;

    @NotNull
    private User user_id;

    @NotNull
    private double totalAmount;

    @NotBlank
    private Status status;

    @NotNull
    private Date date;

    @NotBlank
    private String address;
}
