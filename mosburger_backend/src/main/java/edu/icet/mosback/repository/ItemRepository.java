package edu.icet.mosback.repository;

import edu.icet.mosback.entity.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<ItemEntity, Integer> {

    List<ItemEntity> findByNameContainingIgnoreCase(String name);

    List<ItemEntity> findByCategory(String category);

    Optional<ItemEntity> findById(Integer id);

}
