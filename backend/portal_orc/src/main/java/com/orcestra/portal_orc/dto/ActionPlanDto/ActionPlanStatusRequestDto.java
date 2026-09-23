package com.orcestra.portal_orc.dto.ActionPlanDto;

import jakarta.validation.constraints.NotBlank;
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
public class ActionPlanStatusRequestDto {
    
    @NotBlank(message = "O campo de progresso não deve estar vazio")
    private String progress;
}
