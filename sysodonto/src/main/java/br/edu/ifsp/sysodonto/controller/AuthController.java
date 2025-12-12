package br.edu.ifsp.sysodonto.controller;

import java.util.concurrent.ExecutionException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ifsp.sysodonto.dto.AuthRequest;
import br.edu.ifsp.sysodonto.dto.AuthResponse;
import br.edu.ifsp.sysodonto.dto.RegisterRequest;
import br.edu.ifsp.sysodonto.dto.UserResponse;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.JwtService;
import br.edu.ifsp.sysodonto.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private UserService userService;
    private JwtService jwtService;

    public AuthController (UserService userService, JwtService jwtService){
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest dto) throws ExecutionException, InterruptedException {
        UserResponse userResponse = userService.registerUser(dto);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest dto) throws ExecutionException, InterruptedException {
        User user = userService.checkCredentialsAndReturnUser(dto);
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(token));
    }

}
