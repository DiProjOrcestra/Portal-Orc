package com.orcestra.portal_orc.dto.ObjectiveDto;


import io.swagger.v3.oas.annotations.media.Schema;
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
    
    @Schema(example = "Atingir CSAT com cliente > 4.5")
    @NotBlank(message = "O campo descrição não pode ser vazio")
    private String description;
}
