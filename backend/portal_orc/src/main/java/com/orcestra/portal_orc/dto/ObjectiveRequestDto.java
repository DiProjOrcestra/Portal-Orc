package com.orcestra.portal_orc.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor 
@NoArgsConstructor 
@Builder 
@Getter 
@Setter 
public class ObjectiveRequestDto {
    
    @NotBlank(message = "Esse campo não pode ser vazio")
    private String description;
}
