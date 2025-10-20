package br.edu.ifsp.sysodonto.model;

import java.util.ArrayList;
import java.util.List;

public class Odontogram {

	private Long id;
	private String picture;
	private Patient patient;
	private List<ToothProcedure> procedures = new ArrayList<>();

	public Odontogram() {}

	public Odontogram(Long id, String picture, Patient patient, List<ToothProcedure> procedures) {
		this.id = id;
		this.picture = picture;
		this.patient = patient;
		this.procedures = procedures;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public List<ToothProcedure> getProcedures() {
		return procedures;
	}

	public void setProcedures(List<ToothProcedure> procedures) {
		this.procedures = procedures;
	}
	
}
