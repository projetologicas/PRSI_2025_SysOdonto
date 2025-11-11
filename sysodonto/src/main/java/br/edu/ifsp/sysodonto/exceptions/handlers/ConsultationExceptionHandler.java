package br.edu.ifsp.sysodonto.exceptions.handlers;

import br.edu.ifsp.sysodonto.error.RestError;
import br.edu.ifsp.sysodonto.exceptions.ConsultationNotFoundException;
import br.edu.ifsp.sysodonto.exceptions.EmailAlreadyUsedException;
import br.edu.ifsp.sysodonto.exceptions.ScheduleConflictException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ConsultationExceptionHandler {

    @ExceptionHandler(ConsultationNotFoundException.class)
    public ResponseEntity<RestError> handleConsultationNotFound(ConsultationNotFoundException ex, HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(RestError.of(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(ScheduleConflictException.class)
    public ResponseEntity<RestError> handleScheduleConflict(ScheduleConflictException ex, HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(RestError.of(HttpStatus.CONFLICT, ex.getMessage(), request.getRequestURI()));
    }

}
