package com.example.Heritage_Slabs.dto.response;

import com.example.Heritage_Slabs.model.Order;
import com.example.Heritage_Slabs.model.Product;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class orderItemDTO {

    @NotNull
    private Long id;

    @NotNull
    private Order order_id;

    @NotNull
    private Product product_id;

    @NotNull
    private int quantity;

    @NotNull
    private double priceAtOrder;
}
