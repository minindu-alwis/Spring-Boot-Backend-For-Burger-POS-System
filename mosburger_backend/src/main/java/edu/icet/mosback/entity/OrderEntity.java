package edu.icet.mosback.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name="orders")
public class OrderEntity {
    @Id
    @Column(name = "id", length = 6)
    private String id;

    @Column(name = "date")
    private Date date;

    @Column(name = "customerId", length = 6)
    private String customerId;

}
