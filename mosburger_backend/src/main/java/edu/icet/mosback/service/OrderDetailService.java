package edu.icet.mosback.service;

import edu.icet.mosback.dto.OrderDetail;
import edu.icet.mosback.dto.OrderDetailsResponse;
import edu.icet.mosback.entity.OrderDetailEntity;

import java.util.List;

public interface OrderDetailService {
    void addOrderDetails(OrderDetail orderDetail);

    List<OrderDetailsResponse> getAllOrderDetails();
    OrderDetailsResponse getOrderDetailById(String orderId, String itemCode);

    void deleteOrderDetail(String orderId, String itemCode);

    void updateOrderDetail(String orderId, String itemCode, int qty, double unitPrice);

}
