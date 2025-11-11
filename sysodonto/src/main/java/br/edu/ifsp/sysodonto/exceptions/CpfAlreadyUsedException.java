package br.edu.ifsp.sysodonto.exceptions;

public class CpfAlreadyUsedException extends RuntimeException{

    public CpfAlreadyUsedException(String message){
        super(message);
    }

}
