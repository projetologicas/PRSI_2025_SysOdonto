package br.edu.ifsp.sysodonto.model;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Patient {

    private String id;

    private String userId;
    
    @NotBlank(message="O nome do paciente não pode estar vazio")
    private String name;
    
    @NotBlank(message="O CPF do paciente não pode estar vazio")
    @Pattern(regexp = "(^\\d{3}\\x2E\\d{3}\\x2E\\d{3}\\x2D\\d{2}$)", message="Formato de CPF inválido")
    private String cpf;

    private String picture;
    
    @NotBlank(message="O telefone não pode estar vazio")
    private String telephone;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Past(message="A data de nascimento deve ser anterior à data de hoje")
    private Date birthDate;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @PastOrPresent(message="A data de início de tratamento deve ser anterior ou igual à data de hoje")
    private Date startTreatmentDate;

    private String observations;

    public Patient() {
    }

    public Patient(String userId, String name, String picture, String cpf, String telephone, Date birthDate, Date startTreatmentDate, String observations) {
        this.userId = userId;
        this.name = name;
        this.picture = picture;
        this.cpf = cpf;
        this.telephone = telephone;
        this.birthDate = birthDate;
        this.startTreatmentDate = startTreatmentDate;
        this.observations = observations;
    }
}
