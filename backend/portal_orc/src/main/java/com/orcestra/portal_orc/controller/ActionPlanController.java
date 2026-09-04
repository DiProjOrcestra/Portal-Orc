package com.orcestra.portal_orc.controller;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.orcestra.portal_orc.dto.ActionPlanRequestDto;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.service.ActionPlanService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/v1/action-plans")
@RequiredArgsConstructor 
@Validated 
public class ActionPlanController {

    private  final ActionPlanService actionPlanService;
 
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createActionPlan(@Valid @RequestBody  ActionPlanRequestDto actionPlanRequestDto) throws BadRequestException {
        actionPlanService.createActionPlan(actionPlanRequestDto);
    }                                                                                                                                                                 
}
