package com.orcestra.portal_orc.dto;

import java.time.LocalDate;

import com.orcestra.portal_orc.model.DirectorateEntity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class UserRequestDto {
    
    @NotNull
    private Integer cpf;

    @NotBlank
    private String email;

    private LocalDate birthDate;

    @NotBlank
    private String name;

    private Integer phone;

    private LocalDate entryDay;

    private String position;

    @NotBlank
    private String password;

    private DirectorateEntity directorate;

}
