package br.edu.ifsp.sysodonto.exceptions;

public class ConsultationNotFoundException extends RuntimeException{

    public ConsultationNotFoundException(String message){
        super(message);
    }

}
