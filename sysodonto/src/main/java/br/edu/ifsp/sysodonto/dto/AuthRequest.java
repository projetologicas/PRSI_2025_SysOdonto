package br.edu.ifsp.sysodonto.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequest {
    @NotBlank
    @Email
    @Size(max = 180)
    private String email;

    @NotBlank
    private String password;

    public AuthRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public AuthRequest(){

    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
