package com.orcestra.portal_orc.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.orcestra.portal_orc.dto.ObjectiveDto.ObjectiveRequestDto;
import com.orcestra.portal_orc.dto.ObjectiveDto.ObjectiveResponseDto;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.model.ObjectiveEntity;
import com.orcestra.portal_orc.repository.ObjectiveRepository;

@ExtendWith(MockitoExtension.class)
class ObjectiveServiceTest {

    @Mock
    private ObjectiveRepository objectiveRepository;

    @InjectMocks
    private ObjectiveService objectiveService;

    @Test
    @DisplayName("Deve criar e salvar um objetivo com a descrição informada")
    void deveCriarObjetivo() {
        ObjectiveRequestDto request = ObjectiveRequestDto.builder()
                .description("Atingir CSAT acima de 4.5")
                .build();

        objectiveService.createObjective(request);

        verify(objectiveRepository).save(any(ObjectiveEntity.class));
    }

    @Test
    @DisplayName("Deve consultar todos os objetivos e convertê-los para DTO de resposta")
    void deveConsultarTodosOsObjetivos() {
        ObjectiveEntity first = ObjectiveEntity.builder()
                .id(1)
                .description("Atingir CSAT acima de 4.5")
                .build();
        ObjectiveEntity second = ObjectiveEntity.builder()
                .id(2)
                .description("Reduzir o tempo médio de atendimento")
                .build();
        when(objectiveRepository.findAll()).thenReturn(List.of(first, second));

        List<ObjectiveResponseDto> response = objectiveService.getAllObjective();

        assertEquals(2, response.size());
        assertEquals(1, response.get(0).getId());
        assertEquals("Atingir CSAT acima de 4.5", response.get(0).getDescription());
        assertEquals(2, response.get(1).getId());
        assertEquals("Reduzir o tempo médio de atendimento", response.get(1).getDescription());
        verify(objectiveRepository).findAll();
    }

    @Test
    @DisplayName("Deve atualizar a descrição de um objetivo existente")
    void deveAtualizarObjetivoExistente() throws NotFoundException {
        ObjectiveEntity objective = ObjectiveEntity.builder()
                .id(1)
                .description("Descrição antiga")
                .build();
        ObjectiveRequestDto request = ObjectiveRequestDto.builder()
                .description("Descrição atualizada")
                .build();
        when(objectiveRepository.findById(1)).thenReturn(Optional.of(objective));

        ObjectiveResponseDto response = objectiveService.updateObjective(1, request);

        assertEquals(1, response.getId());
        assertEquals("Descrição atualizada", response.getDescription());
        assertEquals("Descrição atualizada", objective.getDescription());
        verify(objectiveRepository).save(objective);
    }

    @Test
    @DisplayName("Deve manter a descrição quando a atualização recebe descrição nula")
    void deveManterDescricaoQuandoAtualizacaoForNula() throws NotFoundException {
        ObjectiveEntity objective = ObjectiveEntity.builder()
                .id(1)
                .description("Descrição original")
                .build();
        ObjectiveRequestDto request = ObjectiveRequestDto.builder()
                .description(null)
                .build();
        when(objectiveRepository.findById(1)).thenReturn(Optional.of(objective));

        ObjectiveResponseDto response = objectiveService.updateObjective(1, request);

        assertEquals("Descrição original", response.getDescription());
        verify(objectiveRepository).save(objective);
    }

    @Test
    @DisplayName("Deve lançar exceção quando o objetivo não existe")
    void deveRejeitarAtualizacaoDeObjetivoInexistente() {
        ObjectiveRequestDto request = ObjectiveRequestDto.builder()
                .description("Nova descrição")
                .build();
        when(objectiveRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(
                NotFoundException.class,
                () -> objectiveService.updateObjective(99, request));

        verify(objectiveRepository, never()).save(any(ObjectiveEntity.class));
    }
}