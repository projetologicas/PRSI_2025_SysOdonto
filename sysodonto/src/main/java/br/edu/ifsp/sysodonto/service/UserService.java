package br.edu.ifsp.sysodonto.service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import br.edu.ifsp.sysodonto.dto.AuthRequest;
import br.edu.ifsp.sysodonto.dto.RegisterRequest;
import br.edu.ifsp.sysodonto.dto.UserResponse;
import br.edu.ifsp.sysodonto.exceptions.EmailAlreadyUsedException;
import br.edu.ifsp.sysodonto.exceptions.InvalidCredentialsException;
import br.edu.ifsp.sysodonto.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder encoder;

    public UserResponse registerUser(RegisterRequest dto) throws ExecutionException, InterruptedException {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new EmailAlreadyUsedException("E-mail já cadastrado.");
        }

        var user = new User();

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(encoder.encode(dto.getPassword()));

        if(dto.getProfilePicture() != null){
            user.setProfilePicture(dto.getProfilePicture());
        }

        var saved = userRepository.save(user);

        return UserResponse.from(saved);
    }

    public UserResponse checkCredentials(AuthRequest dto) throws ExecutionException, InterruptedException {
        Optional<User> optionalUser = userRepository.findByEmail(dto.getEmail().toLowerCase());

        if(optionalUser.isEmpty()){
            throw new UserNotFoundException("Usuário não encontrado com email: " +  dto.getEmail());
        }

        User user = optionalUser.get();

        if(!encoder.matches(dto.getPassword(), user.getPassword())){
            throw new InvalidCredentialsException("E-mail ou senha inválidos.");
        }

        return UserResponse.from(user);
    }

    public User checkCredentialsAndReturnUser(AuthRequest dto) throws ExecutionException, InterruptedException {
        Optional<User> optionalUser = userRepository.findByEmail(dto.getEmail().toLowerCase());

        if(optionalUser.isEmpty()){
            throw new UserNotFoundException("Usuário não encontrado com email: " +  dto.getEmail());
        }

        User user = optionalUser.get();

        if(!encoder.matches(dto.getPassword(), user.getPassword())){
            throw new InvalidCredentialsException("E-mail ou senha inválidos.");
        }

        return user;
    }

    public Optional<User> getUserById(String id) throws ExecutionException, InterruptedException {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) throws ExecutionException, InterruptedException {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() throws ExecutionException, InterruptedException {
        return userRepository.findAll();
    }

    public User updateUser(String id, User user) throws ExecutionException, InterruptedException {
        if (!userRepository.findById(id).isPresent()) {
            throw new UserNotFoundException("Usuário não encontrado");
        }
        user.setId(id);
        return userRepository.save(user);
    }

    public boolean deleteUser(String id) throws ExecutionException, InterruptedException {
        return userRepository.delete(id);
    }

    public boolean userEmailExists(String email) throws ExecutionException, InterruptedException {
        return userRepository.findByEmail(email).isPresent();
    }
    
    public void changePassword(String userId, String currentPassword, String newPassword) throws ExecutionException, InterruptedException {
        Optional<User> optionalUser = userRepository.findById(userId);
        
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("Usuário não encontrado com ID: " + userId);
        }
        
        User user = optionalUser.get();
        
        if (!encoder.matches(currentPassword, user.getPassword())) {
            throw new InvalidCredentialsException("Senha atual incorreta.");
        }
        
        if (encoder.matches(newPassword, user.getPassword())) {
            throw new IllegalArgumentException("A nova senha deve ser diferente da senha atual.");
        }
        
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
    }
    
    public void updateProfile(String userId, String newName, String newProfilePicture) throws ExecutionException, InterruptedException {
        Optional<User> optionalUser = userRepository.findById(userId);
        
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("Usuário não encontrado com ID: " + userId);
        }
        
        User user = optionalUser.get();
        
        if (newName != null && !newName.trim().isEmpty()) {
            user.setName(newName.trim());
        }
        
        if (newProfilePicture != null) {
            user.setProfilePicture(newProfilePicture);
        }
        
        userRepository.save(user);
    }
}