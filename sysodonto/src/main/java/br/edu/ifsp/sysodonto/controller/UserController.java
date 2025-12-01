package br.edu.ifsp.sysodonto.controller;

import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import br.edu.ifsp.sysodonto.exceptions.InvalidCredentialsException;
import br.edu.ifsp.sysodonto.exceptions.UserNotFoundException;
import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.service.UserService;

@RestController
@RequestMapping("/view/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) throws ExecutionException, InterruptedException {
        User loggedUser = (User) authentication.getPrincipal();
        String userId = loggedUser.getId();
        
        return userService.getUserById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> requestData, 
                                           Authentication authentication) throws ExecutionException, InterruptedException {
        try {
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();
            
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
            User loggedUser = (User) authentication.getPrincipal();
            String userId = loggedUser.getId();
            
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
                    .body(Map.of("error", "Erro ao alterar senha"));
        }
    }
}
