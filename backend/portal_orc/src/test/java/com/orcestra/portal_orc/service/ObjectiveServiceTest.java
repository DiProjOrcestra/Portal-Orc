package com.orcestra.portal_orc.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

// IMPORTS CORRIGIDOS
import com.orcestra.portal_orc.dto.ObjectiveRequestDto;
import com.orcestra.portal_orc.dto.ObjectiveResponseDto;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.model.ObjectiveEntity;
import com.orcestra.portal_orc.repository.ObjectiveRepository;

@ExtendWith(MockitoExtension.class)
class ObjectiveServiceTest {

    @Mock
    private ObjectiveRepository objectiveRepository;

    @InjectMocks
    private ObjectiveService objectiveService;

    private ObjectiveEntity objectiveEntity;
    private ObjectiveRequestDto objectiveRequestDto;

    @BeforeEach
    void setUp() {
        objectiveEntity = ObjectiveEntity.builder()
                .id(1)
                .description("Objetivo Teste")
                .build();

        objectiveRequestDto = new ObjectiveRequestDto();
        objectiveRequestDto.setDescription("Novo Objetivo");
    }

    @Test
    @DisplayName("Deve criar um objetivo com sucesso")
    void createObjective_Success() {
        objectiveService.createObjective(objectiveRequestDto);

        verify(objectiveRepository).save(any(ObjectiveEntity.class));
    }

    @Test
    @DisplayName("Deve listar todos os objetivos com sucesso")
    void getAllObjective_Success() {
        when(objectiveRepository.findAll()).thenReturn(List.of(objectiveEntity));

        List<ObjectiveResponseDto> result = objectiveService.getAllObjective();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(objectiveRepository).findAll();
    }

    @Test
    @DisplayName("Deve atualizar um objetivo com sucesso quando o ID existe")
    void updateObjective_Success() throws NotFoundException {
        when(objectiveRepository.findById(1)).thenReturn(Optional.of(objectiveEntity));

        ObjectiveResponseDto response = objectiveService.updateObjective(1, objectiveRequestDto);

        assertNotNull(response);
        assertEquals("Novo Objetivo", objectiveEntity.getDescription());
        verify(objectiveRepository).findById(1);
        verify(objectiveRepository).save(objectiveEntity);
    }

    @Test
    @DisplayName("Deve lançar NotFoundException ao tentar atualizar um objetivo inexistente")
    void updateObjective_NotFoundException() {
        when(objectiveRepository.findById(99)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class, () -> {
            objectiveService.updateObjective(99, objectiveRequestDto);
        });

        assertEquals("Objetivo com id 99 não existe", exception.getMessage());
        verify(objectiveRepository).findById(99);
        verify(objectiveRepository, never()).save(any());
    }
}