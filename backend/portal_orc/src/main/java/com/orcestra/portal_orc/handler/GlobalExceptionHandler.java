package com.orcestra.portal_orc.handler;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.ErrorResponse;
import com.orcestra.portal_orc.exception.NotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadResquestException(BadRequestException badRequestException){

        ErrorResponse errorResponse = ErrorResponse.builder().message(badRequestException.getMessage()).status(HttpStatus.BAD_REQUEST.value()).build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errorResponse);

    }

    // Thrown by authenticationManager.authenticate() in AuthenticationService#loginUser
    // (BadCredentialsException for a wrong password, UsernameNotFoundException for an
    // unknown email - both are AuthenticationException subtypes). Without this handler
    // Spring Security's authenticationEntryPoint returns a bodyless 401, which the
    // frontend then shows as a generic "unexpected error" instead of this message.
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException authenticationException){

        ErrorResponse errorResponse = ErrorResponse.builder().message("Email ou senha inválidos.").status(HttpStatus.UNAUTHORIZED.value()).build();

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(errorResponse);

    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException notFoundException) {
        
        ErrorResponse errorResponse = ErrorResponse.builder().message(notFoundException.getMessage()).status(HttpStatus.NOT_FOUND.value()).build();

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(errorResponse);
    }
}
