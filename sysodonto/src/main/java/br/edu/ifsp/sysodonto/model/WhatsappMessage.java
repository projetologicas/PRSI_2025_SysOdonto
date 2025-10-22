package br.edu.ifsp.sysodonto.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WhatsappMessage {

	private String id;
	private String message;

	public WhatsappMessage() {}

	public WhatsappMessage(String message) {
		this.message = message;
	}

}
