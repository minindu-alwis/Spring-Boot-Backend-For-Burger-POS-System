package edu.icet.mosback.repository;

import edu.icet.mosback.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<CustomerEntity, Integer> {
    Optional<CustomerEntity> findByTpNumber(String tpNumber);
    void deleteByTpNumber(String tpNumber);
}

