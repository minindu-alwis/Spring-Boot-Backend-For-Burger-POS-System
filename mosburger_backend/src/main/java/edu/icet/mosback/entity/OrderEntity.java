package edu.icet.mosback.entity;

import edu.icet.mosback.dto.OrderDetail;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name="orders")
public class OrderEntity {
    @Id
    @Column(name = "id", length = 6)
    private String id; // Order ID

    @Column(name = "customer_id", length = 6)
    private String customerId; // Customer ID

    @Column(name = "date")
    private Date date; // Order Date

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderDetailEntity> orderDetails; // Relationship to OrderDetailEntity
}
