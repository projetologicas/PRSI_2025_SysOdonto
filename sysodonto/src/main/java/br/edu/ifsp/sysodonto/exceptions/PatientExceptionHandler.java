package br.edu.ifsp.sysodonto.exceptions;

import br.edu.ifsp.sysodonto.error.RestError;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class PatientExceptionHandler {

    @ExceptionHandler(CpfAlreadyUsedException.class)
    public ResponseEntity<RestError> handleCpfAlreadyUsed(CpfAlreadyUsedException ex, HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(RestError.of(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(InvalidCpfException.class)
    public ResponseEntity<RestError> handleInvalidCpf(InvalidCpfException ex, HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(RestError.of(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(InvalidTelephoneException.class)
    public ResponseEntity<RestError> handleInvalidTelephone(InvalidTelephoneException ex, HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(RestError.of(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(TelephoneAlreadyUsedException.class)
    public ResponseEntity<RestError> handleTelephoneAlreadyUsed(TelephoneAlreadyUsedException ex, HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(RestError.of(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(PatientNotFoundException.class)
    public ResponseEntity<RestError> handlePatientNotFound(PatientNotFoundException ex, HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(RestError.of(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI()));
    }


}
