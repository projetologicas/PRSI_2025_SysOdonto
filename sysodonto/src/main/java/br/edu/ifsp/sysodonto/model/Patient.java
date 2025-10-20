package br.edu.ifsp.sysodonto.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Patient {

	private Long id;
	private User createdBy;
	private String name;
	private String picture;
	private String cpf;
	private String telephone;
	private LocalDate birthDate;
	private LocalDate startTreatmentDate;
	private String observations;

	private Odontogram odontogram;
	private List<Consultation> consultations = new ArrayList<>();

	public Patient() {}

	public Patient(Long id, User createdBy, String name, String picture, String cpf, String telephone, LocalDate birthDate, LocalDate startTreatmentDate, String observations, Odontogram odontogram, List<Consultation> consultations) {
		this.id = id;
		this.createdBy = createdBy;
		this.name = name;
		this.picture = picture;
		this.cpf = cpf;
		this.telephone = telephone;
		this.birthDate = birthDate;
		this.startTreatmentDate = startTreatmentDate;
		this.observations = observations;
		this.odontogram = odontogram;
		this.consultations = consultations;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public LocalDate getBirthDate() {
		return birthDate;
	}

	public void setBirthDate(LocalDate birthDate) {
		this.birthDate = birthDate;
	}

	public LocalDate getStartTreatmentDate() {
		return startTreatmentDate;
	}

	public void setStartTreatmentDate(LocalDate startTreatmentDate) {
		this.startTreatmentDate = startTreatmentDate;
	}

	public String getObservations() {
		return observations;
	}

	public void setObservations(String observations) {
		this.observations = observations;
	}

	public Odontogram getOdontogram() {
		return odontogram;
	}

	public void setOdontogram(Odontogram odontogram) {
		this.odontogram = odontogram;
	}

	public List<Consultation> getConsultations() {
		return consultations;
	}

	public void setConsultations(List<Consultation> consultations) {
		this.consultations = consultations;
	}
	
}
