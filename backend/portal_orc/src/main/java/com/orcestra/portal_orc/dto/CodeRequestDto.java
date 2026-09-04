package com.orcestra.portal_orc.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeRequestDto {
    @NotBlank(message="Token de verificação obrigatório")
    private String mfaToken;

    @Schema(description = "Informe o código de 4 dígitos recebido no email cadastrado")
    @NotBlank(message = "Informe o código recebido no email")
    private String code;
}
