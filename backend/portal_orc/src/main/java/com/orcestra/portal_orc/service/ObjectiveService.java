package com.orcestra.portal_orc.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.dto.ObjectiveRequestDto;
import com.orcestra.portal_orc.dto.ObjectiveResponseDto;
import com.orcestra.portal_orc.model.ObjectiveEntity;
import com.orcestra.portal_orc.repository.ObjectiveRepository;

import lombok.RequiredArgsConstructor;

@Service 
@RequiredArgsConstructor 
public class ObjectiveService {
    
    private final ObjectiveRepository objectiveRepository;

    public void createObjective(ObjectiveRequestDto objectiveRequestDto) {
        objectiveRepository.save(ObjectiveEntity.builder().description(objectiveRequestDto.getDescription()).build());
    }

    public List<ObjectiveResponseDto> getAllObjective() {
        return objectiveRepository.findAll().stream()
                                            .map(ObjectiveResponseDto::new )
                                            .toList();
    } 
}
