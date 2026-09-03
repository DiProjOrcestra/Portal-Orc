package com.orcestra.portal_orc.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.apache.coyote.BadRequestException;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import com.orcestra.portal_orc.config.TokenProvider;
import com.orcestra.portal_orc.dto.CodeRequestDto;
import com.orcestra.portal_orc.dto.LoginRequestDto;
import com.orcestra.portal_orc.dto.TokenResponseDto;
import com.orcestra.portal_orc.model.UserEntity;
import com.orcestra.portal_orc.repository.RoleRepository;
import com.orcestra.portal_orc.repository.UserRepository;
import com.orcestra.portal_orc.util.RandomCodeGenerator;

@ExtendWith(MockitoExtension.class)
class MfaServiceTest {

    private static final String EMAIL = "membro@orcestra.com.br";
    private static final String PASSWORD = "orcestra123";

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailSenderService mailSender;

    @Mock
    private RandomCodeGenerator randomCodeGenerator;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TokenProvider tokenProvider;

    @Mock
    private MfaService mfaService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private MfaService mfaServiceUnderTest;

    @InjectMocks
    private AuthenticationService authenticationService;

    private LoginRequestDto loginRequest;
    private UserEntity user;

    @BeforeEach
    void setUp() {
        loginRequest = LoginRequestDto.builder()
                .email(EMAIL)
                .password(PASSWORD)
                .build();

        user = UserEntity.builder()
                .email(EMAIL)
                .password("senha-hash")
                .mfaAttempts(0)
                .build();
    }

    @Test
    @DisplayName("Deve gerar, criptografar, salvar e enviar o código MFA por e-mail")
    void deveGerarSalvarEEnviarCodigoMfa() throws Exception {
        when(randomCodeGenerator.generateRandomCode(4)).thenReturn("0123");
        when(passwordEncoder.encode("0123")).thenReturn("codigo-hash");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        doNothing().when(mailSender).sendEmail(any(), any(), any());

        mfaServiceUnderTest.generateAndSendCode(loginRequest);

        assertEquals("codigo-hash", user.getMfaCode());
        assertEquals(0, user.getMfaAttempts());
        assertTrue(user.getMfaCodeExpiresAt().isAfter(LocalDateTime.now()));
        verify(userRepository).save(user);
        verify(mailSender).sendEmail(
                eq(EMAIL),
                eq("Código de verificação"),
                eq("Este é o seu código: 0123"));
    }

    @Test
    @DisplayName("Deve rejeitar a geração do código quando o usuário não existe")
    void deveRejeitarCodigoParaUsuarioInexistente() {
        when(randomCodeGenerator.generateRandomCode(4)).thenReturn("0123");
        when(passwordEncoder.encode("0123")).thenReturn("codigo-hash");
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        assertThrows(
                BadRequestException.class,
                () -> mfaServiceUnderTest.generateAndSendCode(loginRequest));

        verify(userRepository, never()).save(any(UserEntity.class));
        verify(mailSender, never()).sendEmail(any(), any(), any());
    }

    @Test
    @DisplayName("Deve validar o código correto, limpar o código e zerar as tentativas")
    void deveValidarCodigoCorreto() throws Exception {
        user.setMfaCode("codigo-hash");
        user.setMfaCodeExpiresAt(LocalDateTime.now().plusMinutes(5));
        user.setMfaAttempts(0);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("0123", "codigo-hash")).thenReturn(true);

        boolean result = mfaServiceUnderTest.validateCode(
                loginRequest,
                CodeRequestDto.builder().code("0123").build());

        assertTrue(result);
        assertNull(user.getMfaCode());
        assertNull(user.getMfaCodeExpiresAt());
        assertEquals(0, user.getMfaAttempts());
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("Deve rejeitar código incorreto e incrementar as tentativas")
    void deveRejeitarCodigoIncorretoEIncrementarTentativas() throws Exception {
        user.setMfaCode("codigo-hash");
        user.setMfaCodeExpiresAt(LocalDateTime.now().plusMinutes(5));
        user.setMfaAttempts(1);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("9999", "codigo-hash")).thenReturn(false);

        boolean result = mfaServiceUnderTest.validateCode(
                loginRequest,
                CodeRequestDto.builder().code("9999").build());

        assertFalse(result);
        assertEquals(2, user.getMfaAttempts());
        assertEquals("codigo-hash", user.getMfaCode());
        verify(userRepository).save(user);
    }

    @Test
    @DisplayName("Deve impedir a validação quando o código estiver expirado")
    void deveImpedirValidacaoDeCodigoExpirado() throws Exception {
        user.setMfaCode("codigo-hash");
        user.setMfaCodeExpiresAt(LocalDateTime.now().minusSeconds(1));
        user.setMfaAttempts(0);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        boolean result = mfaServiceUnderTest.validateCode(
                loginRequest,
                CodeRequestDto.builder().code("0123").build());

        assertFalse(result);
        assertEquals(0, user.getMfaAttempts());
        verify(passwordEncoder, never()).matches(any(), any());
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    @DisplayName("Deve impedir a validação após três tentativas")
    void deveImpedirValidacaoAposTresTentativas() throws Exception {
        user.setMfaCode("codigo-hash");
        user.setMfaCodeExpiresAt(LocalDateTime.now().plusMinutes(5));
        user.setMfaAttempts(3);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        boolean result = mfaServiceUnderTest.validateCode(
                loginRequest,
                CodeRequestDto.builder().code("0123").build());

        assertFalse(result);
        verify(passwordEncoder, never()).matches(any(), any());
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    @DisplayName("Deve gerar e enviar o MFA depois de autenticar a senha")
    void deveDispararMfaDepoisDoLogin() throws Exception {
        ReflectionTestUtils.setField(authenticationService, "expirationTime", 900000L);
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(tokenProvider.gerarToken(authentication)).thenReturn("jwt-de-teste");
        doNothing().when(mfaService).generateAndSendCode(loginRequest);

        TokenResponseDto response = authenticationService.loginUser(loginRequest);

        assertEquals("jwt-de-teste", response.getToken());
        assertEquals(900000L, response.getExpiration());
        verify(mfaService).generateAndSendCode(loginRequest);
        verify(tokenProvider).gerarToken(authentication);
    }
}