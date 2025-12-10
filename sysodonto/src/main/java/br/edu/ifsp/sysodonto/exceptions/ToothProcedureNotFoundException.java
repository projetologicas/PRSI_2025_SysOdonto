package br.edu.ifsp.sysodonto.exceptions;

public class ToothProcedureNotFoundException extends RuntimeException{
	
	public ToothProcedureNotFoundException(String message){
        super(message);
    }

}
