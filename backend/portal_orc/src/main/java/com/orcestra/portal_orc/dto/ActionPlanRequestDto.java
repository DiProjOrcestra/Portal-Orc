package com.orcestra.portal_orc.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.orcestra.portal_orc.enums.DirectorateEnum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ActionPlanRequestDto {
    
    private Integer objectiveId;
    private String name;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate term;
    private String progress;
    private List<SubtaskRequestDto> subtasks;
    private DirectorateEnum directorate;
    private String priority;
}
