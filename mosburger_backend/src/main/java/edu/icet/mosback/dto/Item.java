package edu.icet.mosback.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Item {
    private Integer id;
    private String name;
    private Double price;
    private String category; // burger, submarine, drinks, desserts
    private Integer qty;
    private String imageUrl;
}
