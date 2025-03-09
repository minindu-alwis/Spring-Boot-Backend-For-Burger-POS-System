package edu.icet.mosback.controller;


import edu.icet.mosback.dto.Order;
import edu.icet.mosback.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("order")
@RequiredArgsConstructor
@CrossOrigin

public class OrderController {

    private final OrderService orderService;

    @PostMapping("/add")
    public void placeOrder(@RequestBody Order order) {
        orderService.placeOrder(order);
    }
}
