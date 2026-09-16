package com.orcestra.portal_orc.dto;

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
public class MfaTokenResponseDto {
    private String mfaToken;

    private long mfaExpirationTime;
}
