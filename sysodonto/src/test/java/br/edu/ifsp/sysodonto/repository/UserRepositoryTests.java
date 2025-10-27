package br.edu.ifsp.sysodonto.repository;

import br.edu.ifsp.sysodonto.model.User;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Slf4j
public class UserRepositoryTests {
    @Autowired
    private UserRepository userRepository;

    @Test
    void createUser() {
        try {
            log.info("createUser has started.");
            userRepository.createUser(new User("IntelliJ", "", "intellij@test.com", "testPassword"));
            log.info("createUser has ended.");
        } catch (Throwable t) {
            log.error("createUser failed.", t);
        }
    }
}
