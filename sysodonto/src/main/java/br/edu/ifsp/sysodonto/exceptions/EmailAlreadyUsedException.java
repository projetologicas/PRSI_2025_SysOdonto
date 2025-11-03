package br.edu.ifsp.sysodonto.exceptions;

public class EmailAlreadyUsedException extends RuntimeException{

    public EmailAlreadyUsedException(String message){
        super(message);
    }

}
