package br.edu.ifsp.sysodonto.controller;

import br.edu.ifsp.sysodonto.dto.AuthRequest;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.JwtService;
import br.edu.ifsp.sysodonto.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Controller
@RequestMapping("/view/auth")
public class UserLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody AuthRequest auth,
                                        HttpServletResponse response) {

        try {
            AuthRequest authRequest = new AuthRequest();
            authRequest.setEmail(auth.getEmail());
            authRequest.setPassword(auth.getPassword());

            User user = userService.checkCredentialsAndReturnUser(authRequest);
            String token = jwtService.generateToken(user);

            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60);
            response.addCookie(cookie);

            return ResponseEntity.ok().body(Map.of(
                    "message", "Login realizado com sucesso!"
            ));


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "E-mail ou senha inválidos."
            ));

        }
    }
}