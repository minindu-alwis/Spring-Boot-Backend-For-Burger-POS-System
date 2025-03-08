package edu.icet.mosback.service.impl;

import edu.icet.mosback.dto.Item;
import edu.icet.mosback.entity.ItemEntity;
import edu.icet.mosback.repository.ItemRepository;
import edu.icet.mosback.service.ItemService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public boolean addItem(Item item) {
        ItemEntity itemEntity = modelMapper.map(item, ItemEntity.class);
        itemRepository.save(itemEntity);
        return true;
    }

    @Override
    public List<Item> getAllItems() {
        return itemRepository.findAll().stream()
                .map(entity -> modelMapper.map(entity, Item.class))
                .collect(Collectors.toList());
    }

    @Override
    public Item searchItemById(Integer id) {
        Optional<ItemEntity> itemEntity = itemRepository.findById(id);
        return itemEntity.map(entity -> modelMapper.map(entity, Item.class)).orElse(null);
    }

    @Override
    public List<Item> searchItemsByName(String name) {
        return itemRepository.findByNameContainingIgnoreCase(name).stream()
                .map(entity -> modelMapper.map(entity, Item.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean updateItem(Integer id, Item item) {
        Optional<ItemEntity> optionalItemEntity = itemRepository.findById(id);
        if (optionalItemEntity.isPresent()) {
            ItemEntity itemEntity = optionalItemEntity.get();
            itemEntity.setName(item.getName());
            itemEntity.setPrice(item.getPrice());
            itemEntity.setCategory(item.getCategory());
            itemEntity.setQty(item.getQty());
            itemEntity.setImageUrl(item.getImageUrl());
            itemRepository.save(itemEntity);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean deleteItem(Integer id) {
        if (itemRepository.existsById(id)) {
            itemRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
