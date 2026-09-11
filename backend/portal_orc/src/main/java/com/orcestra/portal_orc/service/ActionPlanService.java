package com.orcestra.portal_orc.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.dto.ActionPlanDto.ActionPlanRequestDto;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.model.ActionPlanEntity;
import com.orcestra.portal_orc.model.DirectorateEntity;
import com.orcestra.portal_orc.model.ObjectiveEntity;
import com.orcestra.portal_orc.model.SubtaskEntity;
import com.orcestra.portal_orc.repository.ActionPlanRepository;
import com.orcestra.portal_orc.repository.DirectorateRepository;
import com.orcestra.portal_orc.repository.ObjectiveRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActionPlanService {
    
    private final ActionPlanRepository actionPlanRepository;
    private final DirectorateRepository directorateRepository;
    private final ObjectiveRepository objectiveRepository;

    public void createActionPlan(Integer objectiveId, ActionPlanRequestDto actionPlanRequestDto) throws BadRequestException, NotFoundException {

        ObjectiveEntity objective = objectiveRepository.findById(objectiveId)
                                    .orElseThrow(() -> new NotFoundException(String
                                    .format("Objetivo com id %d não existe", objectiveId)));

        ActionPlanEntity actionPlan = new ActionPlanEntity(actionPlanRequestDto);
        DirectorateEntity directorate = directorateRepository
                                        .findByDirectorateName(
                                                actionPlanRequestDto
                                                .getDirectorate()
                                                .getName())
                                                .orElseThrow(() -> new BadRequestException(
                                                    String.format(
                                                        "A diretoria %s não existe",
                                                        actionPlanRequestDto.getDirectorate()
                                                                                        .getName())));
        List<SubtaskEntity> subtasks = actionPlanRequestDto.getSubtasks()
                                                                .stream()
                                                                .map(SubtaskEntity::new)
                                                                .toList(); 
                                                                
        actionPlan.setObjective(objective);
        actionPlan.setSubtasks(subtasks);
        actionPlan.setDirectorate(directorate);

        subtasks.forEach(subtask -> subtask.setActionPlan(actionPlan));
        actionPlanRepository.save(actionPlan);
    }
}
