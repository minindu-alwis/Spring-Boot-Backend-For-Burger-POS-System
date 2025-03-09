package edu.icet.mosback.controller;

import edu.icet.mosback.dto.Item;
import edu.icet.mosback.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/item")
@RequiredArgsConstructor
@CrossOrigin

public class ItemController {

    private final ItemService itemService;

    // Add a new item
    @PostMapping("/add")
    public ResponseEntity<String> addItem(@RequestBody Item item) {
        boolean isAdded = itemService.addItem(item);
        if (isAdded) {
            return new ResponseEntity<>("Item added successfully!", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Failed to add item.", HttpStatus.BAD_REQUEST);
        }
    }

    // Get all items
    @GetMapping("/getAll")
    public ResponseEntity<List<Item>> getAllItems() {
        List<Item> items = itemService.getAllItems();
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    // Search item by ID
    @GetMapping("/searchById/{id}")
    public ResponseEntity<Item> searchItemById(@PathVariable Integer id) {
        Item item = itemService.searchItemById(id);
        if (item != null) {
            return new ResponseEntity<>(item, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Search items by name
    @GetMapping("/searchByName/{name}")
    public ResponseEntity<List<Item>> searchItemsByName(@PathVariable String name) {
        List<Item> items = itemService.searchItemsByName(name);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    // Update an item
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateItem(@PathVariable Integer id, @RequestBody Item item) {
        boolean isUpdated = itemService.updateItem(id, item);
        if (isUpdated) {
            return new ResponseEntity<>("Item updated successfully!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Item not found.", HttpStatus.NOT_FOUND);
        }
    }

    // Delete an item
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Integer id) {
        boolean isDeleted = itemService.deleteItem(id);
        if (isDeleted) {
            return new ResponseEntity<>("Item deleted successfully!", HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>("Item not found.", HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping("/updateQty/{itemId}/{qty}")
    public void updateQty(@PathVariable String itemId, @PathVariable int qty) {
        itemService.updateQty(itemId, qty);
    }
}
