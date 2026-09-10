package com.orcestra.portal_orc.config;

import java.time.Duration;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Component 
@RequiredArgsConstructor 
public class CookieProvider {
    
    @Value("${jwt.expiration}")
    private long expirationTime;

    //este parâmetro precisa ser mudado para FALSE para testar localmente
    @Value("${cookie.secure:false}") 
    private boolean secure;

    public ResponseCookie createAccessTokenCookie(String token){
        return ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofMillis(expirationTime))
                .build();
    }

    public String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }
        
        return Arrays.stream(request.getCookies())
                .filter(cookie -> "access_token".equals(cookie.getName()))
                .map(cookie -> cookie.getValue())
                .findFirst()
                .orElse(null);
    }
}