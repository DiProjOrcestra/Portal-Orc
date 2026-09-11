package com.orcestra.portal_orc.dto;

import java.time.LocalDate;

import com.orcestra.portal_orc.model.DirectorateEntity;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class RegisterRequestDto {
    
    @NotBlank 
    private String cpf;

    @NotBlank
    private String email;

    private LocalDate birthDate;

    @NotBlank
    private String name;

    private Long phone;

    private LocalDate entryDay;

    private String position;

    @NotBlank
    private String password;

    private DirectorateEntity directorate;

}
