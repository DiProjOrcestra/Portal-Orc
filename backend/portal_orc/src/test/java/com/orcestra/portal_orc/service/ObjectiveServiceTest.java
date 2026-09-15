package com.orcestra.portal_orc.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
<<<<<<< HEAD
=======
import static org.junit.jupiter.api.Assertions.assertNotNull;
>>>>>>> origin/develop
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

<<<<<<< HEAD
=======
import org.junit.jupiter.api.BeforeEach;
>>>>>>> origin/develop
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

<<<<<<< HEAD
import com.orcestra.portal_orc.dto.ObjectiveDto.ObjectiveRequestDto;
import com.orcestra.portal_orc.dto.ObjectiveDto.ObjectiveResponseDto;
=======
// IMPORTS CORRIGIDOS
import com.orcestra.portal_orc.dto.ObjectiveRequestDto;
import com.orcestra.portal_orc.dto.ObjectiveResponseDto;
>>>>>>> origin/develop
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.model.ObjectiveEntity;
import com.orcestra.portal_orc.repository.ObjectiveRepository;

@ExtendWith(MockitoExtension.class)
class ObjectiveServiceTest {

    @Mock
    private ObjectiveRepository objectiveRepository;

    @InjectMocks
    private ObjectiveService objectiveService;

<<<<<<< HEAD
    @Test
    @DisplayName("Deve criar e salvar um objetivo com a descrição informada")
    void deveCriarObjetivo() {
        ObjectiveRequestDto request = ObjectiveRequestDto.builder()
                .description("Atingir CSAT acima de 4.5")
                .build();

        objectiveService.createObjective(request);
=======
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
>>>>>>> origin/develop

        verify(objectiveRepository).save(any(ObjectiveEntity.class));
    }

    @Test
<<<<<<< HEAD
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
=======
    @DisplayName("Deve listar todos os objetivos com sucesso")
    void getAllObjective_Success() {
        when(objectiveRepository.findAll()).thenReturn(List.of(objectiveEntity));

        List<ObjectiveResponseDto> result = objectiveService.getAllObjective();

        assertNotNull(result);
        assertEquals(1, result.size());
>>>>>>> origin/develop
        verify(objectiveRepository).findAll();
    }

    @Test
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/develop
    }
}