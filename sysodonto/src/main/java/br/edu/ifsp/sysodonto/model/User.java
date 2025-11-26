package br.edu.ifsp.sysodonto.model;

import com.google.cloud.firestore.annotation.DocumentId;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.checkerframework.common.aliasing.qual.Unique;

@Getter
@Setter
public class User {

    @DocumentId
    private String id;

    @Unique
    @NotBlank
    private String email;

    private String name;
    private String profilePicture;
    private String password;

    public User() {}

    public User(String name, String profilePicture, String email, String password) {
        this.email = email;
        this.name = name;
        this.profilePicture = profilePicture;
        this.password = password;
    }
}
