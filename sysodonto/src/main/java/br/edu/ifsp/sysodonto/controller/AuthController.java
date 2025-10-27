package br.edu.ifsp.sysodonto.controller;

import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private UserService userService;

    public AuthController (UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user){

    }

    @PostMapping("/login")
    public User login(@RequestBody User userReq){

    }

}
