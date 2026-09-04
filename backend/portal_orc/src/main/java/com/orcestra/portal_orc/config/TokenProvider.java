package com.orcestra.portal_orc.config;

import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.model.UserEntity;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class TokenProvider {
    
    @Value("${jwt.expiration}")
    private long expirationTime;

    @Value("${jwt.key}")
    private String key;

    @Value("${jwt.mfa.expiration}")
    private long mfaExpiration;

    public String gerarToken(UserEntity username) {
        return buildToken(username.getUsername());
    }

    public String gerarTokenMfa(Authentication authentication) {
        UserDetails usuario = (UserDetails) authentication.getPrincipal();
        return buildTokenMfa(usuario.getUsername());
    }

    public String gerarTokenPorEmail(String email) {
        return buildToken(email);
    }

    public String buildTokenMfa(String username) {
        Instant now = Instant.now();
        Instant expiration = now.plusMillis(mfaExpiration);

        return Jwts.builder()
                .subject(username)
                .claim("scope", "mfa")
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(getSigningKey())
                .compact();
    }

    private String buildToken(String username) {
        Instant now = Instant.now();
        Instant expiration = now.plusMillis(expirationTime);

        return Jwts.builder()
                .subject(username)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiration))
                .signWith(getSigningKey())
                .compact();
    
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(key.getBytes());
    }

    public boolean isTokenValid(String token){
        try{
            getClaims(token);
            return true;
        }
        catch (Exception e){
            return false;
        }
    }

    public String validarTokenMfa(String token) throws BadRequestException {
        Claims claims;
        try {
            claims = getClaims(token);
        } catch (ExpiredJwtException e) {
            throw new BadRequestException("Sessão de verificação expirada. Faça login novamente.");
        } catch (Exception e) {
            throw new BadRequestException("Token inválido");
        }

        if (!"mfa".equals(claims.get("scope"))) {
            throw new BadRequestException("Token inválido para esta operação");
        }

        return claims.getSubject();
    }

    public String getUsername (String token){
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
