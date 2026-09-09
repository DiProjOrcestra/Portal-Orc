package com.orcestra.portal_orc.dto.ActionPlanDto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.orcestra.portal_orc.dto.SubtaskRequestDto;
import com.orcestra.portal_orc.enums.DirectorateEnum;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ActionPlanRequestDto {
    
    @NotBlank(message =  "O campo nome não pode ser vazio")
    private String name;

    @Schema(example = "dd-MM-yyyy")
    @NotNull(message =  "O campo prazo não pode ser vazio")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate term;

    @NotBlank(message = "O campo progresso não pode ser vazio")
    private String progress;
    
    @NotNull(message = "O campo diretoria não pode ser vazio")
    private DirectorateEnum directorate;

    @NotBlank(message = "O campo prioridade não pode ser vazio")
    private String priority;

    @NotEmpty(message = "A lista de subtarefas não pode ser vazia")
    private List<SubtaskRequestDto> subtasks;
}
