package br.edu.ifsp.sysodonto.controller;

import br.edu.ifsp.sysodonto.exceptions.InvalidCredentialsException;
import br.edu.ifsp.sysodonto.exceptions.UserNotFoundException;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.model.recoveryPassword.PasswordRecovery;
import br.edu.ifsp.sysodonto.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ExecutionException;

import static br.edu.ifsp.sysodonto.service.EmailRecoveryService.generateCodeRecoveryEmail;

@RestController
@RequestMapping("/view/user")
public class UserController extends SessionChecker {

    @Autowired
    private UserService userService;

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) throws ExecutionException, InterruptedException {
    	String userId = getLoggedUserId(authentication);

        return userService.getUserById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> requestData,
                                           Authentication authentication) throws ExecutionException, InterruptedException {
        try {
        	String userId = getLoggedUserId(authentication);

            String name = (String) requestData.get("name");
            String profilePicture = (String) requestData.get("profilePicture");

            userService.updateProfile(userId, name, profilePicture);

            User updatedUser = userService.getUserById(userId)
                    .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

            return ResponseEntity.ok(updatedUser);

        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao atualizar perfil"));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> requestData,
                                            Authentication authentication) throws ExecutionException, InterruptedException {
        try {
        	String userId = getLoggedUserId(authentication);

            String currentPassword = requestData.get("currentPassword");
            String newPassword = requestData.get("newPassword");

            userService.changePassword(userId, currentPassword, newPassword);

            return ResponseEntity.ok(Map.of("message", "Senha alterada com sucesso"));

        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Ocorreu um erro inesperado, contate o administrador!"));
        }
    }

    @PostMapping("/recovery-password")
    public ResponseEntity<Object> recoveryPassword(@RequestBody PasswordRecovery passwordRecovery) {
        try {
            User user = userService.getUserByEmail(passwordRecovery.getEmail()).get();
            if (Objects.equals(user.getPassword(), passwordRecovery.getPassword())) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Senha ja cadastrada no sistema, volte a tela de login!"));
            }

            if (!passwordRecovery.getPassword().equals(passwordRecovery.getConfirmPassword())) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "As senhas fornecidas não coincidem"));
            }

            userService.recoverPassword(user, passwordRecovery);

            return ResponseEntity.ok(Map.of("message", "Senha recuperada com sucesso"));

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Ocorreu um erro inesperado, contate o administrador!"));
        }
    }


    @PostMapping("/getRecoveryPasswordCode")
    public ResponseEntity<Object> getRecoveryPasswordCode(@RequestBody PasswordRecovery request) {

        String email = request.getEmail();

        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "error", "Ocorreu um erro inesperado, tente outro email"
            ));
        }


        String code = generateCodeRecoveryEmail();

        try {

            boolean isValid = userService.getUserByEmail(email).isPresent();

            if (!isValid) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                        "error", "Email nao cadastrado no sistema"
                ));
            }

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setTo(request.getEmail());
            helper.setSubject("Código de Recuperação de Senha");

            String htmlContent = "<h2>Recuperação de Senha</h2>"
                    + "<p>Seu código de verificação é:</p>"
                    + "<h1 style='color:blue;'>" + code + "</h1>"
                    + "<p>Use este código para concluir a recuperação da sua senha.</p>";

            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);

            return ResponseEntity.ok().body(Map.of(
                    "message", "Código enviado com sucesso!",
                    "code", code
            ));
        } catch (MessagingException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "error", "Email nao cadastrado no sistema"
            ));
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        }
    }
}
