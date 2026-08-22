package com.orcestra.portal_orc.dto;

import java.time.LocalDate;

import org.hibernate.validator.constraints.br.CPF;

import com.orcestra.portal_orc.enums.DirectorateEnum;

import jakarta.validation.constraints.Email;
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
    
    @NotBlank(message = "Esse campo não pode ser vazio")
    @CPF(message = "Esse CPF não é válido")
    private String cpf;

    @NotBlank(message = "Esse campo não pode ser vazio")
    @Email(message = "Esse email não é válido")
    private String email;

    @NotNull(message = "Esse campo não pode ser vazio")
    private LocalDate birthDate;

    @NotBlank(message = "Esse campo não pode ser vazio")
    private String name;

    @NotNull(message = "Esse campo não pode ser vazio")
    private Long phone;

    @NotNull(message = "Esse campo não pode ser vazio")
    private LocalDate entryDay;

    @NotBlank(message = "Esse campo não pode ser vazio")
    private String position;

    @NotBlank(message = "Esse campo não pode ser vazio")
    private String password;

    @NotBlank(message = "Esse campo não pode ser vazio")
    private DirectorateEnum directorate;
}
