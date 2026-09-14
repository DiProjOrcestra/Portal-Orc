package com.orcestra.portal_orc.dto.SubtaskDto;

import io.swagger.v3.oas.annotations.media.Schema;
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
public class SubtaskRequestDto {

    @Schema(example = "Criar formulário de CSAT")
    @NotBlank(message = "O campo nome não pode ser vazio")
    private String name;

    @Schema(example = "false")
    @Builder.Default
    private Boolean done = false;
}
