package br.edu.ifsp.sysodonto.exceptions;

import br.edu.ifsp.sysodonto.error.RestError;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<RestError> handleEmailAlreadyUsed(EmailAlreadyUsedException ex, HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(RestError.of(HttpStatus.FORBIDDEN, ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<RestError> handleInvalidCredentials(InvalidCredentialsException ex, HttpServletRequest request){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(RestError.of(HttpStatus.UNAUTHORIZED, ex.getMessage(), request.getRequestURI()));
    }

}
