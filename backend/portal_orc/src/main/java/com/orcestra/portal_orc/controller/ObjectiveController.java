package com.orcestra.portal_orc.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.orcestra.portal_orc.dto.ActionPlanRequestDto;    
import com.orcestra.portal_orc.dto.ObjectiveDto.ObjectiveRequestDto;
import com.orcestra.portal_orc.dto.ObjectiveDto.ObjectiveResponseDto;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.service.ActionPlanService;
import com.orcestra.portal_orc.service.ObjectiveService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController 
@RequiredArgsConstructor
@Validated 
@RequestMapping("/v1/objective")
public class ObjectiveController {
    
    private final ObjectiveService objectiveService;
    private final ActionPlanService actionPlanService;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public void createObjective(@Valid @RequestBody ObjectiveRequestDto objectiveRequestDto) {
        objectiveService.createObjective(objectiveRequestDto);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ObjectiveResponseDto> getAllObjective() {
        return objectiveService.getAllObjective();
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ObjectiveResponseDto updateObjective(@PathVariable Integer id, @RequestBody ObjectiveRequestDto objectiveRequestDto) throws NotFoundException {
        return objectiveService.updateObjective(id, objectiveRequestDto);
    }

    @PostMapping("/{objectiveId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void createActionPlan(@PathVariable() Integer objectiveId, @RequestBody ActionPlanRequestDto actionPlanRequestDto) throws BadRequestException, NotFoundException {
        actionPlanService.createActionPlan(objectiveId, actionPlanRequestDto);
    }
}
