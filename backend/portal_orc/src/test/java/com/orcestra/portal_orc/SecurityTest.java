package com.orcestra.portal_orc;

import com.orcestra.portal_orc.config.OAuth2LoginSuccessHandler;
import com.orcestra.portal_orc.service.CustomOAuth2UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CustomOAuth2UserService customOAuth2UserService;

    @MockitoBean
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Test
    @DisplayName("Deve proibir o cadastro publico sem token de ADMIN")
    public void deveExigirAutenticacaoParaRegistro() throws Exception {
        String jsonPayload = """
                {
                  "cpf": "12345678900",
                  "email": "teste@orcestra.com.br",
                  "password": "orcestra123"
                }
                """;

        mockMvc.perform(post("/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isUnauthorized());
    }
}