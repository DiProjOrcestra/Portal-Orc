package com.orcestra.portal_orc.config;

import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class TokenProvider {
    
    @Value("${jwt.expiration}")
    private long tempoExpiracao;

    @Value("${jwt.key}")
    private String chave;

    public String gerarToken(Authentication authentication) {
        UserDetails usuario = (UserDetails) authentication.getPrincipal();
        return buildToken(usuario.getUsername());
    }

    private String buildToken(String username) {
        Instant agora = Instant.now();
        Instant expiracao = agora.plusMillis(tempoExpiracao);

        return Jwts.builder()
                .subject(username)
                .issuedAt(Date.from(agora))
                .expiration(Date.from(expiracao))
                .signWith(getSigningKey())
                .compact();
    
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(chave.getBytes());
    }

    public boolean ehTokenValido(String token){
        try{
            getClaims(token);
            return true;
        }
        catch (Exception e){
            return false;
        }
    }

    private String getUsername (String token){
        return getClaims(token).getSubject();
    }

    private Claims getClaims(String token){
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


}
