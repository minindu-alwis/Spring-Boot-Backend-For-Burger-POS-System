package edu.icet.mosback.controller;


import edu.icet.mosback.dto.LoginRequest;
import edu.icet.mosback.dto.SingupRequest;
import edu.icet.mosback.entity.User;
import edu.icet.mosback.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public boolean signup(@RequestBody SingupRequest signupRequest) {
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setPassword(signupRequest.getPassword());
        user.setEmail(signupRequest.getEmail());

        User registeredUser = userService.registerUser(user);
        if(registeredUser==null){
           return false;
        }else{
            return true;
        }
    }

    @PostMapping("/login")
    public boolean login(@RequestBody LoginRequest loginRequest) {
       return userService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());
    }
}
