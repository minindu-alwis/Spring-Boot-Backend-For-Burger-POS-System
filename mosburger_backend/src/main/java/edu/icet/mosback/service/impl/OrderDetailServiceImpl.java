package edu.icet.mosback.service.impl;

import edu.icet.mosback.dto.OrderDetail;
import edu.icet.mosback.dto.OrderDetailsResponse;
import edu.icet.mosback.entity.OrderDetailEntity;
import edu.icet.mosback.entity.OrderDetailId;
import edu.icet.mosback.repository.OrderDetailsRepository;
import edu.icet.mosback.service.ItemService;
import edu.icet.mosback.service.OrderDetailService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderDetailServiceImpl implements OrderDetailService {

    private final OrderDetailsRepository orderDetailsRepository;
    private final ModelMapper modelMapper;

    @Override
    public void addOrderDetails(OrderDetail orderDetail) {
        OrderDetailEntity orderDetailsEntity = modelMapper.map(orderDetail, OrderDetailEntity.class);
        orderDetailsRepository.save(orderDetailsEntity);
    }

    public List<OrderDetailsResponse> getAllOrderDetails() {
        return orderDetailsRepository.findAllOrderDetails();
    }

    @Override
    public OrderDetailsResponse getOrderDetailById(String orderId, String itemCode) {
        return orderDetailsRepository.findOrderDetailById(orderId, itemCode)
                .orElseThrow(() -> new RuntimeException("Order detail not found"));
    }

    @Override
    @Transactional
    public void deleteOrderDetail(String orderId, String itemCode) {
        orderDetailsRepository.deleteByOrderIdAndItemCode(orderId, itemCode);
    }

    @Override
    @Transactional
    public void updateOrderDetail(String orderId, String itemCode, int qty, double unitPrice) {
        orderDetailsRepository.updateOrderDetail(orderId, itemCode, qty, unitPrice);
    }

}
