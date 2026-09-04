package com.orcestra.portal_orc.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.dto.ActionPlanRequestDto;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.model.ActionPlanEntity;
import com.orcestra.portal_orc.model.DirectorateEntity;
import com.orcestra.portal_orc.model.SubtaskEntity;
import com.orcestra.portal_orc.repository.ActionPlanRepository;
import com.orcestra.portal_orc.repository.DirectorateRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActionPlanService {
    
    private final ActionPlanRepository actionPlanRepository;
    private final DirectorateRepository directorateRepository;

    public void createActionPlan(ActionPlanRequestDto actionPlanRequestDto) throws BadRequestException {

        ActionPlanEntity actionPlan = new ActionPlanEntity(actionPlanRequestDto);
        DirectorateEntity directorate = directorateRepository
                                            .findByDirectorateName(
                                                actionPlanRequestDto
                                                .getDirectorate()
                                                .name())
                                                .orElseThrow(() -> new BadRequestException(
                                                    String.format(
                                                        "A diretoria %s não existe",
                                                        actionPlanRequestDto.getDirectorate()
                                                                                        .name())));
        List<SubtaskEntity> subtasks = actionPlanRequestDto.getSubtasks()
                                                                .stream()
                                                                .map(SubtaskEntity::new)
                                                                .toList(); 
        actionPlan.setSubtasks(subtasks);
        actionPlan.setDirectorate(directorate);
        actionPlanRepository.save(actionPlan);
    }
}
