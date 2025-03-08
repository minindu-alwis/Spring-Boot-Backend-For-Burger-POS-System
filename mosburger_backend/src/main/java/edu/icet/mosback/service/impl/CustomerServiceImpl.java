package edu.icet.mosback.service.impl;

import edu.icet.mosback.dto.Customer;
import edu.icet.mosback.entity.CustomerEntity;
import edu.icet.mosback.repository.CustomerRepository;
import edu.icet.mosback.service.CustomerService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final ModelMapper modelMapper;

    @Override
    public boolean addCustomer(Customer customer) {
        CustomerEntity customerEntity = modelMapper.map(customer, CustomerEntity.class);
        CustomerEntity cuseEntity = customerRepository.save(customerEntity);
        if(cuseEntity==null){
            return false;
        }else{
            return true;
        }
    }

    @Override
    public List<Customer> getAllCustomers() {
        List<CustomerEntity> customerEntities = customerRepository.findAll();
        return customerEntities.stream()
                .map(entity -> modelMapper.map(entity, Customer.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteCustomer(String tpNumber) {
        customerRepository.deleteByTpNumber(tpNumber);
    }

    @Override
    public boolean updateCustomer(Integer id, Customer customer) {
        Optional<CustomerEntity> optionalCustomerEntity = customerRepository.findById(id);
        if (optionalCustomerEntity.isPresent()) {
            CustomerEntity customerEntity = optionalCustomerEntity.get();
            customerEntity.setName(customer.getName());
            customerEntity.setTpNumber(customer.getTpNumber());
            customerRepository.save(customerEntity);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Customer searchByTpNumber(String tpNumber) {
        Optional<CustomerEntity> optionalCustomerEntity = customerRepository.findByTpNumber(tpNumber);
        return optionalCustomerEntity.map(entity -> modelMapper.map(entity, Customer.class)).orElse(null);
    }
}
