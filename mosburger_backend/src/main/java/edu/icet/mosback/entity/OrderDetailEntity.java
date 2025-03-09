package edu.icet.mosback.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name="orderdetails")
@IdClass(OrderDetailId.class)

public class OrderDetailEntity {
    @Id
    @Column(name = "orderId", length = 6)
    private String orderId;

    @Id
    @Column(name = "itemCode", length = 6)
    private String itemCode;

    @Column(name = "qty")
    private int qty;

    @Column(name = "unitPrice")
    private double unitPrice;
}
