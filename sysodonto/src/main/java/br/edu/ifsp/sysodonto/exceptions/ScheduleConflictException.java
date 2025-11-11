package br.edu.ifsp.sysodonto.exceptions;

public class ScheduleConflictException extends RuntimeException{

    public ScheduleConflictException(String message){
        super(message);
    }

}
