package br.edu.ifsp.sysodonto.model;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Consultation {

	private String id;
	private String userId;
	private String patientId;
	private LocalDateTime dateTime;
	private String patientName;
    private String observations;

	public Consultation() {}

	public Consultation(String userId, String patientId, LocalDateTime dateTime, String patientName, String observations) {
		this.userId = userId;
		this.patientId = patientId;
		this.dateTime = dateTime;
		this.patientName = patientName;
		this.observations = observations;
	}

}