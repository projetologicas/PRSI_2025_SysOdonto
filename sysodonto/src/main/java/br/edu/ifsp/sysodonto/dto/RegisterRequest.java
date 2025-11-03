package br.edu.ifsp.sysodonto.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank
    @Size(max = 120)
    private String name;

    @NotBlank @Email(message = "Formato de e-mail inválido.")
    @Size(max = 180)
    private String email;

    @NotBlank @Size(min = 6, max = 72)
    private String password;

    private String profilePicture;

    public RegisterRequest(String name, String email, String password, String profilePicture) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.profilePicture = profilePicture;
    }

    public RegisterRequest(){

    }

}
