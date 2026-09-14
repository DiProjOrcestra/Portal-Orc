package com.orcestra.portal_orc.controller;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.orcestra.portal_orc.dto.MvvRequestDto;
import com.orcestra.portal_orc.dto.MvvResponseDto;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.service.MvvService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/v1/mvv")
public class MvvController {

    private final MvvService mvvService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MvvResponseDto createMvv(@Valid @RequestBody MvvRequestDto request)
            throws BadRequestException {
        return mvvService.createMvv(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public MvvResponseDto getMvv() throws NotFoundException {
        return mvvService.getMvv();
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public MvvResponseDto updateMvv(@Valid @RequestBody MvvRequestDto request)
            throws NotFoundException {
        return mvvService.updateMvv(request);
    }
}