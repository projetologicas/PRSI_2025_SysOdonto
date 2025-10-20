package br.edu.ifsp.sysodonto.model;

public class WhatsappMessage {

	private Long id;
	private String message;
	private Consultation consultation;

	public WhatsappMessage() {}

	public WhatsappMessage(Long id, String message, Consultation consultation) {
		this.id = id;
		this.message = message;
		this.consultation = consultation;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Consultation getConsultation() {
		return consultation;
	}

	public void setConsultation(Consultation consultation) {
		this.consultation = consultation;
	}
	
}
