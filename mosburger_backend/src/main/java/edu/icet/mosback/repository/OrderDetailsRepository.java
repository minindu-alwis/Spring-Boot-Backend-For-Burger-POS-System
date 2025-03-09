package edu.icet.mosback.repository;

import edu.icet.mosback.entity.OrderDetailEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderDetailsRepository extends JpaRepository<OrderDetailEntity, String> {
}
