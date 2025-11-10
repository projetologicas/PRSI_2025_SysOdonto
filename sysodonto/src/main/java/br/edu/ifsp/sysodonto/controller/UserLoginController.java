package br.edu.ifsp.sysodonto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import br.edu.ifsp.sysodonto.dto.AuthRequest;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.JwtService;
import br.edu.ifsp.sysodonto.service.UserService;

@Controller
@RequestMapping("/view/auth")
public class UserLoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public String login(@RequestParam String email,
                       @RequestParam String password,
                       RedirectAttributes redirectAttributes) {
        try {
            AuthRequest authRequest = new AuthRequest();
            authRequest.setEmail(email);
            authRequest.setPassword(password);

            User user = userService.checkCredentialsAndReturnUser(authRequest);
            String token = jwtService.generateToken(user);

            redirectAttributes.addFlashAttribute("success", "Login realizado com sucesso!");
            
            return "dashboard";
            
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "E-mail ou senha inválidos.");
            return "redirect:/view/auth/login";
        }
    }
}
