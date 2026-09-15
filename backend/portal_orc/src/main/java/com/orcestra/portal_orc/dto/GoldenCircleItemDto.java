package com.orcestra.portal_orc.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class GoldenCircleItemDto {

    @NotNull
    @Positive
    private Integer number;

    @NotBlank(message = "O rótulo não pode ser vazio")
    private String label;

    @NotBlank(message = "O texto não pode ser vazio")
    private String text;
}