package edu.icet.mosback.controller;

import edu.icet.mosback.dto.OrderDetail;
import edu.icet.mosback.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orderdetails")
@RequiredArgsConstructor
@CrossOrigin

public class OrderDetailController {

    private final OrderDetailService orderDetailService;

    @PostMapping("/add")
    public void addOrderDetails(@RequestBody OrderDetail orderDetail) {
        orderDetailService.addOrderDetails(orderDetail);
    }

}
