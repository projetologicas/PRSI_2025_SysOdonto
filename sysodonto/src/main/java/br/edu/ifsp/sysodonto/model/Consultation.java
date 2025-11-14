package br.edu.ifsp.sysodonto.model;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

@Getter
@Setter
public class Consultation {

    private String id;
    private String userId;
    private String patientId;

    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private Date dateTime;

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
