package com.orcestra.portal_orc.config;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final TokenProvider tokenProvider;

    public void onAuthenticationSucces(HttpServletRequest request, 
                                       HttpServletResponse response, 
                                       Authentication authentication) throws IOException, ServletException{
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        String token = tokenProvider.gerarTokenPorEmail(email);

        String frontendUrl = "https://localhost:3000/oauth2/callback?token=" + token;

        getRedirectStrategy().sendRedirect(request, response, token);
    }
    
}
