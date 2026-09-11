package com.orcestra.portal_orc.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.orcestra.portal_orc.dto.LinkUsersToActionPlanRequestDto;
import com.orcestra.portal_orc.dto.ActionPlanDto.ActionPlanResponseDto;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.service.ActionPlanService;

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

    @PutMapping("/{id}")
    public void linkUserToActionPlan(@PathVariable Integer id, @RequestBody LinkUsersToActionPlanRequestDto requestDto) throws NotFoundException {
        actionPlanService.linkUserToActionPlan(id, requestDto);
    }
}
