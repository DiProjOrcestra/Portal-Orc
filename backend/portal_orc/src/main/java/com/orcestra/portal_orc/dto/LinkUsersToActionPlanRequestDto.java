package com.orcestra.portal_orc.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
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
public class LinkUsersToActionPlanRequestDto {

    @NotEmpty(message = "A lista de usuários não pode ser vazia")
    private List<String> usersId;
}
