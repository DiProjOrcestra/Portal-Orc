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
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequestDto {
    
    @Schema(example = "user@orcestra.com.br")
    @NotBlank
    private String email;

    @Schema(example = "orc'estra123")
    @NotBlank
    private String password;
}
