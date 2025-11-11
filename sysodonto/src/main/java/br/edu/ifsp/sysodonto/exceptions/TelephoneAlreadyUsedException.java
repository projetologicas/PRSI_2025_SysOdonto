package br.edu.ifsp.sysodonto.exceptions;

public class TelephoneAlreadyUsedException extends RuntimeException{

    public TelephoneAlreadyUsedException(String message){
        super(message);
    }

}
