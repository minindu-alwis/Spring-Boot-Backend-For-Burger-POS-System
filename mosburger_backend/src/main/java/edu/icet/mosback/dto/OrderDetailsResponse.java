package edu.icet.mosback.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailsResponse {
    private String id;
    private String customerId;
    private Date date;
    private String itemCode;
    private int qty;
    private double unitPrice;
}