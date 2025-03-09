package edu.icet.mosback.controller;


import edu.icet.mosback.dto.Order;
import edu.icet.mosback.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("order")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://127.0.0.1:5500")

public class OrderController {

    private final OrderService orderService;

    @PostMapping("/add")
    public void placeOrder(@RequestBody Order order) {
        orderService.placeOrder(order);
    }

    @GetMapping("/lastOrderId")
    public String getLastOrderId() {
        return orderService.getLastOrderId();
    }
    
}
