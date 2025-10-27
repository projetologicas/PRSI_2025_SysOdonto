package br.edu.ifsp.sysodonto.service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.edu.ifsp.sysodonto.model.User;
import br.edu.ifsp.sysodonto.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) throws ExecutionException, InterruptedException {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email já cadastrado");
        }
        return userRepository.save(user);
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
            throw new IllegalArgumentException("Usuário não encontrado");
        }
        user.setId(id);
        return userRepository.save(user);
    }

    public boolean deleteUser(String id) throws ExecutionException, InterruptedException {
        return userRepository.delete(id);
    }

    public boolean userExists(String email) throws ExecutionException, InterruptedException {
        return userRepository.findByEmail(email).isPresent();
    }
}