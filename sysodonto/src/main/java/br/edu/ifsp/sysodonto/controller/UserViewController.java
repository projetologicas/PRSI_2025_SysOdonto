package br.edu.ifsp.sysodonto.controller;

import br.edu.ifsp.sysodonto.dto.RegisterRequest;
import br.edu.ifsp.sysodonto.exceptions.EmailAlreadyUsedException;
import br.edu.ifsp.sysodonto.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
    public String registerUser(@ModelAttribute RegisterRequest registerRequest,
                             RedirectAttributes redirectAttributes) {
        try {
            if (!registerRequest.passwordsMatch()) {
                redirectAttributes.addFlashAttribute("error", "As senhas não coincidem.");
                return "redirect:/view/auth/register";
            }

            userService.registerUser(registerRequest);
            redirectAttributes.addFlashAttribute("success", "Cadastro realizado com sucesso!");
            return "redirect:/view/auth/login";
            
        } catch (EmailAlreadyUsedException e) {
            redirectAttributes.addFlashAttribute("error", "Este e-mail já está cadastrado.");
            return "redirect:/view/auth/register";
            
        } catch (ExecutionException | InterruptedException e) {
            redirectAttributes.addFlashAttribute("error", "Erro ao realizar cadastro. Tente novamente.");
            return "redirect:/view/auth/register";
            
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Erro inesperado. Tente novamente.");
            return "redirect:/view/auth/register";
        }
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "loginUser";
    }
}