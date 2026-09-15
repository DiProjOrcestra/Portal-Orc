package com.orcestra.portal_orc.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
public class MvvRequestDto {

    @NotBlank(message = "A citação não pode ser vazia")
    private String quote;

    @NotBlank(message = "A missão não pode ser vazia")
    private String mission;

    @NotBlank(message = "A visão não pode ser vazia")
    private String vision;

    @NotBlank(message = "O texto dos valores não pode ser vazio")
    private String valuesText;

    @NotEmpty(message = "Informe ao menos um valor")
    private List<@NotBlank(message = "Nenhum valor pode ser vazio") String> values;
}