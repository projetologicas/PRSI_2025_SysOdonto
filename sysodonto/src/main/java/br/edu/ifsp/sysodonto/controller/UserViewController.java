package br.edu.ifsp.sysodonto.controller;

import br.edu.ifsp.sysodonto.dto.RegisterRequest;
import br.edu.ifsp.sysodonto.exceptions.EmailAlreadyUsedException;
import br.edu.ifsp.sysodonto.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@Controller
@RequestMapping("/view/auth")
public class UserViewController {

    @Autowired
    private UserService userService;

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("registerRequest", new RegisterRequest());
        return "registerUser";
    }

    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<Object> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            if (!registerRequest.passwordsMatch()) {
                return ResponseEntity.badRequest().body(Map.of("error", "As senhas não coincidem."));
            }

            userService.registerUser(registerRequest);
            return ResponseEntity.ok(Map.of("message", "Cadastro realizado com sucesso!"));

        } catch (EmailAlreadyUsedException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Este e-mail já está cadastrado."));

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Erro ao realizar cadastro. Tente novamente."));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Erro inesperado. Tente novamente."));
        }
    }


    @GetMapping("/login")
    public String showLoginForm() {
        return "loginUser";
    }
}