package br.edu.ifsp.sysodonto.model.recoveryPassword;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordRecovery {

    @NotBlank
    private String email;

    private String password;
    private String confirmPassword;

}
