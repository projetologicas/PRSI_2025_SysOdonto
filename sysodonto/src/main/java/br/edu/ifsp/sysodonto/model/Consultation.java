package br.edu.ifsp.sysodonto.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
@Setter
public class Consultation {

    private String id;
    private String userId;

    @NotBlank
    private String patientId;

    @NotBlank
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private Date dateTime;

    @NotBlank
    private String patientName;

    private String observations;
    
    private boolean sendReminder;

    public Consultation() {}

    public Consultation(String userId, String patientId, Date dateTime, String patientName, String observations) {
        this.userId = userId;
        this.patientId = patientId;
        this.dateTime = dateTime;
        this.patientName = patientName;
        this.observations = observations;
    }
}
