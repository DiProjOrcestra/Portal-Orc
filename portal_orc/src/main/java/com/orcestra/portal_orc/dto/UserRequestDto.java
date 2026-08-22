package com.orcestra.portal_orc.dto;

import java.time.LocalDate;

import org.hibernate.validator.constraints.br.CPF;

import com.orcestra.portal_orc.enums.DirectorateEnum;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;
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

    @Schema(example = "dd-MM-yyyy")
    @NotNull(message = "Esse campo não pode ser vazio")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;

    @NotBlank(message = "Esse campo não pode ser vazio")
    private String name;

    @NotNull(message = "Esse campo não pode ser vazio")
    private Long phone;

    @Schema(example = "dd-MM-yyyy")
    @NotNull(message = "Esse campo não pode ser vazio")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate entryDay;

    @NotBlank(message = "Esse campo não pode ser vazio")
    private String position;

    @NotBlank(message = "Esse campo não pode ser vazio")
    private String password;

    @NotNull(message = "Esse campo não pode ser vazio")
    private DirectorateEnum directorate;
}
