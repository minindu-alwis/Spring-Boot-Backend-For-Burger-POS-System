package edu.icet.mosback.controller;

import edu.icet.mosback.dto.Customer;
import edu.icet.mosback.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
@CrossOrigin
public class CustomerController {

    final CustomerService customerService;

    // Add a new customer
    @PostMapping("/add")
    public boolean addCustomer(@RequestBody Customer customer) {
        return customerService.addCustomer(customer);

    }

    // Get all customers
    @GetMapping("/getAll")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @DeleteMapping("deleteByTp/{tpNumber}")
    public ResponseEntity<String> deleteCustomer(@PathVariable String tpNumber) {
        customerService.deleteCustomer(tpNumber);
        return new ResponseEntity<>("Customer deleted successfully", HttpStatus.NO_CONTENT);
    }


    @PutMapping("/update/{id}")
    public boolean updateCustomer(@PathVariable Integer id, @RequestBody Customer customer) {
        return  customerService.updateCustomer(id, customer);
    }

    @GetMapping("/searchByTp/{tpNumber}")
    public ResponseEntity<Customer> searchCustomerByTpNumber(@PathVariable String tpNumber) {
        Customer customer = customerService.searchByTpNumber(tpNumber);
        if (customer != null) {
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
