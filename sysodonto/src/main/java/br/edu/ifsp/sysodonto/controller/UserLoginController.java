package br.edu.ifsp.sysodonto.controller;

import br.edu.ifsp.sysodonto.dto.AuthRequest;
import br.edu.ifsp.sysodonto.dto.RegisterRequest;
import br.edu.ifsp.sysodonto.exceptions.EmailAlreadyUsedException;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.JwtService;
import br.edu.ifsp.sysodonto.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;

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
            cookie.setHttpOnly(false);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60);
            response.addCookie(cookie);

            ResponseEntity<User> loggedUser = getLoggedUser(auth.getEmail());

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
    public ResponseEntity<Object> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            if (!registerRequest.passwordsMatch()) {
                return ResponseEntity.badRequest().body(Map.of("error", "As senhas não coincidem."));
            }

            ResponseEntity<User> loggedUser = getLoggedUser(userService.registerUser(registerRequest).getEmail());
            return ResponseEntity.ok(Map.of(
                    "message", "Cadastro realizado com sucesso!",
                    "loggedUser", loggedUser
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