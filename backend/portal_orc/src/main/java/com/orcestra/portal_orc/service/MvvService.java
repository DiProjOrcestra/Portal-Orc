package com.orcestra.portal_orc.service;

import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.dto.MvvRequestDto;
import com.orcestra.portal_orc.dto.MvvResponseDto;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.model.MvvEntity;
import com.orcestra.portal_orc.repository.MvvRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MvvService {

    private final MvvRepository mvvRepository;

    public MvvResponseDto createMvv(MvvRequestDto request) throws BadRequestException {
        if (mvvRepository.findFirstByOrderByIdAsc().isPresent()) {
            throw new BadRequestException("O MVV já foi cadastrado");
        }

        MvvEntity entity = MvvEntity.builder()
                .quote(request.getQuote())
                .mission(request.getMission())
                .vision(request.getVision())
                .valuesText(request.getValuesText())
                .values(request.getValues())
                .build();

        return new MvvResponseDto(mvvRepository.save(entity));
    }

    public MvvResponseDto getMvv() throws NotFoundException {
        return mvvRepository.findFirstByOrderByIdAsc()
                .map(MvvResponseDto::new)
                .orElseThrow(() -> new NotFoundException("MVV não encontrado"));
    }

    public MvvResponseDto updateMvv(MvvRequestDto request) throws NotFoundException {
        MvvEntity entity = mvvRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new NotFoundException("MVV não encontrado"));

        entity.setQuote(request.getQuote());
        entity.setMission(request.getMission());
        entity.setVision(request.getVision());
        entity.setValuesText(request.getValuesText());
        entity.setValues(request.getValues());

        return new MvvResponseDto(mvvRepository.save(entity));
    }
}