package com.orcestra.portal_orc.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.dto.GoldenCircleItemDto;
import com.orcestra.portal_orc.dto.GoldenCircleResponseDto;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.model.GoldenCircleEntity;
import com.orcestra.portal_orc.repository.GoldenCircleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GoldenCircleService {

    private final GoldenCircleRepository goldenCircleRepository;

    public GoldenCircleResponseDto create(GoldenCircleItemDto request) throws BadRequestException {
        if (goldenCircleRepository.findByNumber(request.getNumber()).isPresent()) {
            throw new BadRequestException("Já existe um item do Golden Circle com esse número");
        }

        GoldenCircleEntity entity = GoldenCircleEntity.builder()
                .number(request.getNumber())
                .label(request.getLabel())
                .text(request.getText())
                .build();

        return new GoldenCircleResponseDto(goldenCircleRepository.save(entity));
    }

    public List<GoldenCircleResponseDto> getAll() {
        return goldenCircleRepository.findAllByOrderByNumberAsc().stream()
                .map(GoldenCircleResponseDto::new)
                .toList();
    }

    public GoldenCircleResponseDto update(Integer number, GoldenCircleItemDto request)
            throws NotFoundException {
        GoldenCircleEntity entity = goldenCircleRepository.findByNumber(number)
                .orElseThrow(() -> new NotFoundException("Item do Golden Circle não encontrado"));

        entity.setLabel(request.getLabel());
        entity.setText(request.getText());

        return new GoldenCircleResponseDto(goldenCircleRepository.save(entity));
    }
}