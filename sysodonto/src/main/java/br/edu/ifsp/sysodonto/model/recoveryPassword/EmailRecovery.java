package br.edu.ifsp.sysodonto.model.recoveryPassword;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailRecovery {

    @NotBlank
    private String email;



}
