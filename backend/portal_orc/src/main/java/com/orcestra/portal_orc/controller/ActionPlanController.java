package com.orcestra.portal_orc.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.orcestra.portal_orc.dto.LinkUsersToActionPlanRequestDto;
import com.orcestra.portal_orc.dto.ActionPlanDto.ActionPlanRequestDto;
import com.orcestra.portal_orc.dto.ActionPlanDto.ActionPlanResponseDto;
import com.orcestra.portal_orc.dto.ActionPlanDto.ActionPlanStatusRequestDto;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.service.ActionPlanService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor 
@RestController 
@RequestMapping("/v1/action-plan")
public class ActionPlanController {
    
    private final ActionPlanService actionPlanService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ActionPlanResponseDto> getActionPlan() {
        return actionPlanService.getAllActionPlan();
    }

    @PutMapping("/{id}/link-user")
    @ResponseStatus(HttpStatus.OK)
    public void linkUserToActionPlan(@PathVariable Integer id, @RequestBody LinkUsersToActionPlanRequestDto requestDto) throws NotFoundException {
        actionPlanService.linkUserToActionPlan(id, requestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateActionPlan(@PathVariable Integer id, @Valid @RequestBody ActionPlanRequestDto actionPlanRequestDto) throws NotFoundException, BadRequestException {
        actionPlanService.updateActionPlan(id, actionPlanRequestDto);
    }

    @PatchMapping("/{id}/status")
    @ResponseStatus(HttpStatus.OK)
    public void updateActionPlanStatus(@PathVariable Integer id, @Valid @RequestBody ActionPlanStatusRequestDto actionPlanStatusRequestDto) throws NotFoundException {
        actionPlanService.updateActionPlanStatus(id, actionPlanStatusRequestDto);
    }

    @PatchMapping("/{actionPlanId}/subtask/{subtaskId}")
    @ResponseStatus(HttpStatus.OK)
    public void updateActionPlanSubtask(@PathVariable Integer actionPlanId, @PathVariable Integer subtaskId) throws NotFoundException {
        actionPlanService.updateActionPlanSubtask(actionPlanId, subtaskId);
    }

    @DeleteMapping("/{id}") 
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteActionPlan(@PathVariable Integer id) throws NotFoundException {
        actionPlanService.deleteActionPlan(id);
    }
}
