package edu.icet.mosback.service;

import edu.icet.mosback.dto.Item;

import java.util.List;

public interface ItemService {
    boolean addItem(Item item);
    List<Item> getAllItems();
    Item searchItemById(Integer id);
    List<Item> searchItemsByName(String name);
    boolean updateItem(Integer id, Item item);
    boolean deleteItem(Integer id);
    void updateQty(String itemId, int qty);
}
