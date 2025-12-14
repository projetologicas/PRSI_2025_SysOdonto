package br.edu.ifsp.sysodonto.model;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Consultation {

    private String id;
    
    private String userId;

    @NotBlank(message="O ID do paciente não pode estar vazio")
    private String patientId;

    @NotNull
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @FutureOrPresent(message="A data e hora da consulta devem ser num horário futuro")
    private Date dateTime;

    @NotBlank(message="O nome do paciente não deve estar vazio")
    private String patientName;

    private String observations;
    
    public Consultation() {}

    public Consultation(String userId, String patientId, Date dateTime, String patientName, String observations) {
        this.userId = userId;
        this.patientId = patientId;
        this.dateTime = dateTime;
        this.patientName = patientName;
        this.observations = observations;
    }
}
