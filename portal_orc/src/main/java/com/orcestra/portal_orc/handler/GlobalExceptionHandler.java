package com.orcestra.portal_orc.handler;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException notFoundException) {
        
        ErrorResponse errorResponse = ErrorResponse.builder().message(notFoundException.getMessage()).status(HttpStatus.NOT_FOUND.value()).build();

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(errorResponse);
    }
}
