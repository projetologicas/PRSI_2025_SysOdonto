package br.edu.ifsp.sysodonto.model;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

@Getter
@Setter
public class Patient {

	private String id;
	private String userId;
	private String name;
	private String picture;
	private String cpf;
	private String telephone;

	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date birthDate;

	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private Date startTreatmentDate;

	private String observations;

	public Patient() {}

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
