package br.edu.ifsp.sysodonto.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Consultation {

	private Long id;
	private Patient patient;
	private User professional;
	private LocalDateTime dateTime;
	private String patientName;
	private String observations;
	private List<WhatsappMessage> messages = new ArrayList<>();

	public Consultation() {}

	public Consultation(Long id, Patient patient, User professional, LocalDateTime dateTime, String patientName, String observations, List<WhatsappMessage> messages) {
		this.id = id;
		this.patient = patient;
		this.professional = professional;
		this.dateTime = dateTime;
		this.patientName = patientName;
		this.observations = observations;
		this.messages = messages;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public User getProfessional() {
		return professional;
	}

	public void setProfessional(User professional) {
		this.professional = professional;
	}

	public LocalDateTime getDateTime() {
		return dateTime;
	}

	public void setDateTime(LocalDateTime dateTime) {
		this.dateTime = dateTime;
	}

	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	public String getObservations() {
		return observations;
	}

	public void setObservations(String observations) {
		this.observations = observations;
	}

	public List<WhatsappMessage> getMessages() {
		return messages;
	}

	public void setMessages(List<WhatsappMessage> messages) {
		this.messages = messages;
	}
	
}