package br.edu.ifsp.sysodonto.controller;

import br.edu.ifsp.sysodonto.dto.AuthRequest;
import br.edu.ifsp.sysodonto.dto.RegisterRequest;
import br.edu.ifsp.sysodonto.dto.UserResponse;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private UserService userService;

    public AuthController (UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest dto) throws ExecutionException, InterruptedException {
        UserResponse userResponse = userService.registerUser(dto);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody AuthRequest dto) throws ExecutionException, InterruptedException {
        UserResponse userResponse = userService.checkCredentials(dto);
        return ResponseEntity.ok(userResponse);
    }

}
