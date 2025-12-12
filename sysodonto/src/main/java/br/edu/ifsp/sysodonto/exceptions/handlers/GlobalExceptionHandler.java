package br.edu.ifsp.sysodonto.exceptions.handlers;

import br.edu.ifsp.sysodonto.error.RestError;
import br.edu.ifsp.sysodonto.exceptions.InvalidSessionException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<RestError> handleIllegalArgument(IllegalArgumentException ex,
                                                           HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(RestError.of(
                        HttpStatus.BAD_REQUEST,
                        ex.getMessage(),
                        request.getRequestURI()
                ));
    }
    
    @ExceptionHandler(InvalidSessionException.class)
    public ResponseEntity<RestError> handleInvalidSession(InvalidSessionException ex,
                                                           HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(RestError.of(
                        HttpStatus.UNAUTHORIZED,
                        ex.getMessage(),
                        request.getRequestURI()
                ));
    }
    
}

