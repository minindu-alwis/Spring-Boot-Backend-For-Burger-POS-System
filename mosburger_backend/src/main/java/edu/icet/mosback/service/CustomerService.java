package edu.icet.mosback.service;

import edu.icet.mosback.dto.Customer;

import java.util.List;

public interface CustomerService {
    boolean addCustomer(Customer customer);
    List<Customer> getAllCustomers();
    void deleteCustomer(String tpNumber);
    boolean updateCustomer(Integer id, Customer customer);
    Customer searchByTpNumber(String tpNumber);
}
