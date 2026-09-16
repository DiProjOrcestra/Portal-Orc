package com.orcestra.portal_orc.service;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.orcestra.portal_orc.dto.ActionPlanDto.ActionPlanRequestDto;
import com.orcestra.portal_orc.enums.DirectorateEnum;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.model.ActionPlanEntity;
import com.orcestra.portal_orc.model.DirectorateEntity;
import com.orcestra.portal_orc.model.ObjectiveEntity;
import com.orcestra.portal_orc.repository.ActionPlanRepository;
import com.orcestra.portal_orc.repository.DirectorateRepository;
import com.orcestra.portal_orc.repository.ObjectiveRepository;

@ExtendWith(MockitoExtension.class)
class ActionPlanServiceTest {

    @Mock
    private ActionPlanRepository actionPlanRepository;

    @Mock
    private DirectorateRepository directorateRepository;

    @Mock
    private ObjectiveRepository objectiveRepository;

    @InjectMocks
    private ActionPlanService actionPlanService;

    @Mock
    private ActionPlanRequestDto actionPlanRequestDto;

    private ObjectiveEntity objectiveEntity;
    private DirectorateEntity directorateEntity;

    @BeforeEach
    void setUp() {
        objectiveEntity = ObjectiveEntity.builder()
                .id(1)
                .description("Objetivo Teste")
                .build();

        directorateEntity = new DirectorateEntity();
        directorateEntity.setId(1);
    }

    @Test
    @DisplayName("Deve cadastrar plano de ação com sucesso quando objetivo e diretoria existem")
    void createActionPlan_Success() throws BadRequestException, NotFoundException {
        when(actionPlanRequestDto.getDirectorate()).thenReturn(DirectorateEnum.values()[0]);
        when(actionPlanRequestDto.getSubtasks()).thenReturn(List.of());
        when(objectiveRepository.findById(1)).thenReturn(Optional.of(objectiveEntity));
        when(directorateRepository.findByDirectorateName(anyString())).thenReturn(Optional.of(directorateEntity));

        actionPlanService.createActionPlan(1, actionPlanRequestDto);

        verify(objectiveRepository).findById(1);
        verify(actionPlanRepository).save(any(ActionPlanEntity.class));
    }

    @Test
    @DisplayName("Deve lançar NotFoundException quando o objetivo não for encontrado")
    void createActionPlan_ObjectiveNotFound() {
        when(objectiveRepository.findById(99)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class, () -> {
            actionPlanService.createActionPlan(99, actionPlanRequestDto);
        });

        assertEquals("Objetivo com id 99 não existe", exception.getMessage());
        verify(objectiveRepository).findById(99);
        verify(directorateRepository, never()).findByDirectorateName(any());
        verify(actionPlanRepository, never()).save(any());
    }

    @Test
    @DisplayName("Deve lançar BadRequestException quando a diretoria não for encontrada")
    void createActionPlan_DirectorateNotFound() {
        when(actionPlanRequestDto.getDirectorate()).thenReturn(DirectorateEnum.values()[0]);
        when(objectiveRepository.findById(1)).thenReturn(Optional.of(objectiveEntity));
        when(directorateRepository.findByDirectorateName(anyString())).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () -> {
            actionPlanService.createActionPlan(1, actionPlanRequestDto);
        });

        verify(objectiveRepository).findById(1);
        verify(actionPlanRepository, never()).save(any());
    }
}