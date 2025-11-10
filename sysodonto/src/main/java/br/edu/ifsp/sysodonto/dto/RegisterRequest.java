package br.edu.ifsp.sysodonto.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "É necessário fornecer um nome")
    @Size(max = 120)
    private String name;

    @NotBlank(message = "É necessário fornecer um e-mail")
    @Email(message = "Formato de e-mail inválido.")
    @Size(max = 180)
    private String email;

    @NotBlank(message = "É necessário fornecer uma senha")
    @Size(min = 6, max = 72, message = "A senha deve conter entre 6 a 72 caracteres")
    private String password;
    
    private String confirmPassword;	

    private String profilePicture;

    public RegisterRequest(String name, String email, String password, String confirmPassword, String profilePicture) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.profilePicture = profilePicture;
    }

    public RegisterRequest(){}
    
    public boolean passwordsMatch() {
        return password != null && password.equals(confirmPassword);
    }

}
