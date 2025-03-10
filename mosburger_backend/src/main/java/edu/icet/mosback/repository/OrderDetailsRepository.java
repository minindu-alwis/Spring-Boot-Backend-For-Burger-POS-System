package edu.icet.mosback.repository;

import edu.icet.mosback.dto.OrderDetailsResponse;
import edu.icet.mosback.entity.OrderDetailEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDetailsRepository extends JpaRepository<OrderDetailEntity, String> {
    @Query("SELECT new edu.icet.mosback.dto.OrderDetailsResponse(o.id, o.customerId, o.date, od.itemCode, od.qty, od.unitPrice) " +
            "FROM OrderEntity o JOIN o.orderDetails od")
    List<OrderDetailsResponse> findAllOrderDetails();

    @Query("SELECT new edu.icet.mosback.dto.OrderDetailsResponse(o.id, o.customerId, o.date, od.itemCode, od.qty, od.unitPrice) " +
            "FROM OrderEntity o JOIN o.orderDetails od " +
            "WHERE od.orderId = :orderId AND od.itemCode = :itemCode")
    Optional<OrderDetailsResponse> findOrderDetailById(@Param("orderId") String orderId, @Param("itemCode") String itemCode);


    @Modifying
    @Query("DELETE FROM OrderDetailEntity od WHERE od.orderId = :orderId AND od.itemCode = :itemCode")
    void deleteByOrderIdAndItemCode(@Param("orderId") String orderId, @Param("itemCode") String itemCode);

    @Modifying
    @Query("UPDATE OrderDetailEntity od SET od.qty = :qty, od.unitPrice = :unitPrice " +
            "WHERE od.orderId = :orderId AND od.itemCode = :itemCode")
    void updateOrderDetail(@Param("orderId") String orderId,
                           @Param("itemCode") String itemCode,
                           @Param("qty") int qty,
                           @Param("unitPrice") double unitPrice);

}
