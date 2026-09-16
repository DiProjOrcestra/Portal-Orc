package com.orcestra.portal_orc.dto.ActionPlanDto;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.orcestra.portal_orc.dto.SubtaskDto.SubtaskResponseDto;
import com.orcestra.portal_orc.model.ActionPlanEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter 
@Setter 
@AllArgsConstructor 
@NoArgsConstructor 
@Builder 
public class ActionPlanResponseDto {

    private Integer id;

    private String name;
 
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate term;

    private String progress;
    
    private String directorate;

    private String priority;

    private List<SubtaskResponseDto> subtasks;

    public ActionPlanResponseDto(ActionPlanEntity actionPlanEntity) {
        this.id = actionPlanEntity.getId();
        this.name = actionPlanEntity.getName();
        this.term = actionPlanEntity.getTerm();
        this.progress = actionPlanEntity.getProgress();
        this.directorate = actionPlanEntity.getDirectorate().getDirectorateName();
        this.priority = actionPlanEntity.getPriority();
        this.subtasks = actionPlanEntity.getSubtasks().stream()
            .map(SubtaskResponseDto::new)
            .collect(Collectors.toList());
    }
}
