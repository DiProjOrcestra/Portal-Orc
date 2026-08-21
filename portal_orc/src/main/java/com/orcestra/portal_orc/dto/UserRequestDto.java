package com.orcestra.portal_orc.dto;

import java.time.LocalDate;
import org.hibernate.validator.constraints.br.CPF;

import com.orcestra.portal_orc.enums.DirectorateEnum;

import jakarta.validation.constraints.Email;
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
public class UserRequestDto {
    
    @NotBlank(message = "Esse campo não pode ser vazio")
    @CPF(message = "Esse CPF não é válido")
    private String cpf;

    @NotBlank(message = "Esse campo não pode ser vazio")
    @Email(message = "Esse email não é válido")
    private String email;

    private LocalDate birthDate;

    @NotBlank(message = "Esse campo não pode ser vazio")
    private String name;

    private Long phone;

    private LocalDate entryDay;

    private String position;

    @NotBlank(message = "Esse campo não pode ser vazio")
    private String password;

    private DirectorateEnum directorate;

}
