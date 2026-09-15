package com.orcestra.portal_orc.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.orcestra.portal_orc.dto.GoldenCircleItemDto;
import com.orcestra.portal_orc.dto.GoldenCircleResponseDto;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.service.GoldenCircleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/v1/golden-circle")
public class GoldenCircleController {

    private final GoldenCircleService goldenCircleService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GoldenCircleResponseDto create(@Valid @RequestBody GoldenCircleItemDto request)
            throws BadRequestException {
        return goldenCircleService.create(request);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<GoldenCircleResponseDto> getAll() {
        return goldenCircleService.getAll();
    }

    @PutMapping("/{number}")
    @ResponseStatus(HttpStatus.OK)
    public GoldenCircleResponseDto update(@PathVariable Integer number,
            @Valid @RequestBody GoldenCircleItemDto request) throws NotFoundException {
        return goldenCircleService.update(number, request);
    }
}