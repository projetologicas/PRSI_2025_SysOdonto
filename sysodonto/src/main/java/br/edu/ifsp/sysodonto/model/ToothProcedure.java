package br.edu.ifsp.sysodonto.model;

import java.time.LocalDate;

public class ToothProcedure {

	private Long id;
	private int toothId;
	private String procedureName;
	private String description;
	private LocalDate procedureDate;
	private Odontogram odontogram;

	public ToothProcedure() {}

	public ToothProcedure(Long id, int toothId, String procedureName, String description, LocalDate procedureDate, Odontogram odontogram) {
		this.id = id;
		this.toothId = toothId;
		this.procedureName = procedureName;
		this.description = description;
		this.procedureDate = procedureDate;
		this.odontogram = odontogram;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getToothId() {
		return toothId;
	}

	public void setToothId(int toothId) {
		this.toothId = toothId;
	}

	public String getProcedureName() {
		return procedureName;
	}

	public void setProcedureName(String procedureName) {
		this.procedureName = procedureName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDate getProcedureDate() {
		return procedureDate;
	}

	public void setProcedureDate(LocalDate procedureDate) {
		this.procedureDate = procedureDate;
	}

	public Odontogram getOdontogram() {
		return odontogram;
	}

	public void setOdontogram(Odontogram odontogram) {
		this.odontogram = odontogram;
	}
	
}