package com.example.Heritage_Slabs.dto.request;

import com.example.Heritage_Slabs.model.Status;
import com.example.Heritage_Slabs.model.User;
import com.example.Heritage_Slabs.dto.response.orderItemDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class orderDTO {

    private Long id;

    @NotNull
    private User user_id;

    @NotNull
    private double totalAmount;

    @NotNull
    private Status status;

    @NotNull
    private Date date;

    @NotBlank
    private String address;

    private List<orderItemDTO> items;
}
