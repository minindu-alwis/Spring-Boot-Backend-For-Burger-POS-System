package edu.icet.mosback.service.impl;

import edu.icet.mosback.dto.OrderDetail;
import edu.icet.mosback.entity.OrderDetailEntity;
import edu.icet.mosback.repository.OrderDetailsRepository;
import edu.icet.mosback.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

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
}
