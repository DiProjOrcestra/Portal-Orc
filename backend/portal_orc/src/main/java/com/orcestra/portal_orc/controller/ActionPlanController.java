package com.orcestra.portal_orc.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.orcestra.portal_orc.dto.ActionPlanDto.ActionPlanResponseDto;
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
}
