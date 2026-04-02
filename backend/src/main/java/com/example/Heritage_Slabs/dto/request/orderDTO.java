package com.example.Heritage_Slabs.dto.request;

import com.example.Heritage_Slabs.model.Status;
import com.example.Heritage_Slabs.model.User;
import com.example.Heritage_Slabs.dto.response.orderItemDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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

    @NotBlank
    @Pattern(regexp = "^\\d{5}$", message = "Postal code must be 5 digits")
    private String postalCode;

    @NotBlank
    private String city;

    @NotBlank
    private String province;

    @NotBlank
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number")
    private String phoneNumber;

    private String Order_note;
}
