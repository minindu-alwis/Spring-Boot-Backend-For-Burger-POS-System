package edu.icet.mosback.service;

import edu.icet.mosback.entity.User;

public interface UserService {
    User registerUser(User user);

    boolean authenticateUser(String username, String password);
}
