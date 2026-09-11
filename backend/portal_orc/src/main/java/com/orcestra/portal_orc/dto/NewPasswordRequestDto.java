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
public class NewPasswordRequestDto {
    @Schema(example = "Token de verificação de nova senha")
    private String passwordToken;

    @Schema(example = "Orc*1234")
    @NotBlank 
    private String newPassword;

    @Schema(example = "Orc*1234")
    @NotBlank 
    private String confirmNewPassword;
}
