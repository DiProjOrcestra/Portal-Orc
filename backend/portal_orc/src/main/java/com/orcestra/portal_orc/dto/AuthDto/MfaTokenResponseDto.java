package com.orcestra.portal_orc.dto.AuthDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder 
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
public class MfaTokenResponseDto {
    private String token;

    private long tempExpirationTime;
}
