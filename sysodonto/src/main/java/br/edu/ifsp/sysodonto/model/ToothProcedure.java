package br.edu.ifsp.sysodonto.model;

import java.util.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ToothProcedure {

	private String procedureId;
	private int toothId;
	private String procedureName;
	private String description;
	private Date procedureDate;

	public ToothProcedure() {}

	public ToothProcedure(int toothId, String procedureName, String description, Date procedureDate) {
		this.toothId = toothId;
		this.procedureName = procedureName;
		this.description = description;
		this.procedureDate = procedureDate;
	}
	
}