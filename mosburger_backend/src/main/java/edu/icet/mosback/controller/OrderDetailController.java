package edu.icet.mosback.controller;

import edu.icet.mosback.dto.Item;
import edu.icet.mosback.dto.OrderDetail;
import edu.icet.mosback.dto.OrderDetailsResponse;
import edu.icet.mosback.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/all")
    public List<OrderDetailsResponse> getAllOrderDetails() {
        return orderDetailService.getAllOrderDetails();
    }
    // Search order details by orderId and itemCode
    @GetMapping("/search/{orderId}/{itemCode}")
    public OrderDetailsResponse getOrderDetailById(
            @PathVariable String orderId,
            @PathVariable String itemCode) {
        return orderDetailService.getOrderDetailById(orderId, itemCode);
    }

    // Delete order details by orderId and itemCode
    @DeleteMapping("/delete/{orderId}/{itemCode}")
    public void deleteOrderDetail(
            @PathVariable String orderId,
            @PathVariable String itemCode) {
        orderDetailService.deleteOrderDetail(orderId, itemCode);
    }

    // Update order details by orderId and itemCode
    @PutMapping("/update/{orderId}/{itemCode}")
    public void updateOrderDetail(
            @PathVariable String orderId,
            @PathVariable String itemCode,
            @RequestParam int qty,
            @RequestParam double unitPrice) {
        orderDetailService.updateOrderDetail(orderId, itemCode, qty, unitPrice);
    }

}
