package edu.icet.mosback.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class OrderDetail {
    private String orderId;
    private String itemCode;
    private int qty;
    private double unitPrice;

}
