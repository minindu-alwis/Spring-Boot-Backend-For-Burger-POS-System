package edu.icet.mosback.repository;

import edu.icet.mosback.entity.ItemEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<ItemEntity, Integer> {

    List<ItemEntity> findByNameContainingIgnoreCase(String name);

    List<ItemEntity> findByCategory(String category);

    Optional<ItemEntity> findById(Integer id);

    @Modifying
    @Transactional
    @Query("UPDATE ItemEntity i SET i.qty = i.qty - :qty WHERE i.id = :itemId")
    void updateQty(@Param("itemId") String itemId, @Param("qty") int qty);

}
