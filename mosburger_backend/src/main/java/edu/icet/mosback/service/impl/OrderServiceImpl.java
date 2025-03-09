package edu.icet.mosback.service.impl;

import edu.icet.mosback.dto.Order;
import edu.icet.mosback.entity.CustomerEntity;
import edu.icet.mosback.entity.OrderEntity;
import edu.icet.mosback.repository.OrderRepository;
import edu.icet.mosback.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ModelMapper modelMapper;

    @Override
    public void placeOrder(Order order) {
        OrderEntity orderEntity = modelMapper.map(order, OrderEntity.class);
        orderRepository.save(orderEntity);
    }

    @Override
    public String getLastOrderId() {
        OrderEntity lastOrder = orderRepository.findTopByOrderByIdDesc();
        return lastOrder != null ? lastOrder.getId() : "ODR000"; // Default if no orders exist
    }
}
