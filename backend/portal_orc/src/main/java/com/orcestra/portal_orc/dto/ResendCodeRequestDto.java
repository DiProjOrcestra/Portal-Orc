package com.orcestra.portal_orc.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResendCodeRequestDto {
    @NotBlank(message = "Token de mfa temporário obrigatório")
    private String mfaToken;
}
