package com.orcestra.portal_orc.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.dto.ObjectiveRequestDto;
import com.orcestra.portal_orc.dto.ObjectiveResponseDto;
import com.orcestra.portal_orc.exception.NotFoundException;
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
    
    public ObjectiveResponseDto updateObjective(Integer id, ObjectiveRequestDto objectiveRequestDto) throws NotFoundException {
        ObjectiveEntity objective = objectiveRepository.findById(id).orElseThrow(() -> new NotFoundException(String.format("Objetivo com id %d não existe", id)));
        
        if(objectiveRequestDto.getDescription() != null) objective.setDescription(objectiveRequestDto.getDescription());

        objectiveRepository.save(objective);

        return new ObjectiveResponseDto(objective);
    }

    public void deleteObjective(Integer id) throws NotFoundException {
        objectiveRepository.delete(objectiveRepository.findById(id).orElseThrow(() -> new 
        NotFoundException(String.format("Objetivo com id %d não encontrado", id))));
    }
}
