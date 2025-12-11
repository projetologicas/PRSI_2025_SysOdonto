package br.edu.ifsp.sysodonto.controller;

import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import br.edu.ifsp.sysodonto.dto.AuthRequest;
import br.edu.ifsp.sysodonto.dto.RegisterRequest;
import br.edu.ifsp.sysodonto.dto.UserResponse;
import br.edu.ifsp.sysodonto.exceptions.EmailAlreadyUsedException;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.JwtService;
import br.edu.ifsp.sysodonto.service.UserService;
import br.edu.ifsp.sysodonto.service.WhatsAppBotService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@Controller
@RequestMapping("/view/auth")
public class UserLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private WhatsAppBotService whatsAppBotService;
    
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
            cookie.setHttpOnly(false);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60);
            response.addCookie(cookie);

            ResponseEntity<User> loggedUser = getLoggedUser(auth.getEmail());
            
            whatsAppBotService.sendMessages(user.getId());

            return ResponseEntity.ok().body(Map.of(
                    "message", "Login realizado com sucesso!",
                    "loggedUser", loggedUser
            ));


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "E-mail ou senha inválidos."
            ));

        }
    }

    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<Object> registerUser(@RequestBody RegisterRequest registerRequest, HttpServletResponse response) {
        try {
            if (!registerRequest.passwordsMatch()) {
                return ResponseEntity.badRequest().body(Map.of("error", "As senhas não coincidem."));
            }

            UserResponse userResponse = userService.registerUser(registerRequest);
            
            User user = userService.getUserByEmail(userResponse.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado após registro"));
            
            String token = jwtService.generateToken(user);
            
            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(false);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60); 
            response.addCookie(cookie);

            return ResponseEntity.ok(Map.of(
                    "message", "Cadastro realizado com sucesso!",
                    "loggedUser", userResponse 
            ));


        } catch (EmailAlreadyUsedException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Este e-mail já está cadastrado."));

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Erro ao realizar cadastro. Tente novamente."));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Erro inesperado. Tente novamente."));
        }
    }


    @GetMapping("{email}")
    private ResponseEntity<User> getLoggedUser(@PathVariable String email) throws ExecutionException, InterruptedException {
        User loggedUser = userService.getUserByEmail(email).orElse(null);
        if (loggedUser == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(loggedUser);
    }
}