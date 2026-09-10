package com.orcestra.portal_orc;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.orcestra.portal_orc.config.CookieProvider;
import com.orcestra.portal_orc.config.OAuth2LoginSuccessHandler;
import com.orcestra.portal_orc.config.TokenProvider;
import com.orcestra.portal_orc.service.CustomOAuth2UserService;

@ExtendWith(MockitoExtension.class)
public class SecurityTest {

    @Mock
    private TokenProvider tokenProvider;

    @Mock
    private CookieProvider cookieProvider;

    @Mock
    private CustomOAuth2UserService customOAuth2UserService;

    @Mock
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Test
    @DisplayName("Deve inicializar dependencias de seguranca")
    void deveInicializarMocks() {
        assertNotNull(tokenProvider);
        assertNotNull(cookieProvider);
    }
}