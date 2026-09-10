package com.orcestra.portal_orc.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import com.orcestra.portal_orc.config.TokenProvider;
import com.orcestra.portal_orc.dto.CodeRequestDto;
import com.orcestra.portal_orc.dto.LoginRequestDto;
import com.orcestra.portal_orc.dto.MfaTokenResponseDto;
import com.orcestra.portal_orc.dto.RegisterRequestDto;
import com.orcestra.portal_orc.dto.ResendCodeRequestDto;
import com.orcestra.portal_orc.enums.RoleTypeEnum;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.model.RoleEntity;
import com.orcestra.portal_orc.model.UserEntity;
import com.orcestra.portal_orc.repository.RoleRepository;
import com.orcestra.portal_orc.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    private static final String EMAIL = "membro@orcestra.com.br";
    private static final String PASSWORD = "senhaCerta123";
    private static final String MFA_TOKEN = "mfa-token-de-teste";

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private TokenProvider tokenProvider;

    @Mock
    private MfaService mfaService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthenticationService authenticationService;

    private UserEntity user;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authenticationService, "expirationTime", 86400000L);
        ReflectionTestUtils.setField(authenticationService, "mfaExpirationTime", 300000L);

        user = UserEntity.builder()
                .email(EMAIL)
                .password("hash-da-senha")
                .build();
    }

    @Test
    @DisplayName("Deve registrar um usuário com sucesso quando o e-mail não estiver cadastrado")
    void deveRegistrarUsuarioComSucesso() throws Exception {
        RegisterRequestDto dto = new RegisterRequestDto();
        dto.setEmail(EMAIL);
        dto.setPassword(PASSWORD);

        RoleEntity role = RoleEntity.builder().name(RoleTypeEnum.USER.name()).build();

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());
        when(roleRepository.findByName(RoleTypeEnum.USER.name())).thenReturn(Optional.of(role));
        when(passwordEncoder.encode(PASSWORD)).thenReturn("hash-da-senha");

        authenticationService.registerUser(dto);

        verify(userRepository).save(any(UserEntity.class));
    }

    @Test
    @DisplayName("Deve lançar BadRequestException ao registrar com e-mail já existente")
    void deveLancarExcecaoAoRegistrarEmailDuplicado() {
        RegisterRequestDto dto = new RegisterRequestDto();
        dto.setEmail(EMAIL);

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> authenticationService.registerUser(dto));
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    @DisplayName("Deve autenticar o usuário e disparar a geração do código MFA no login")
    void deveFazerLoginEDispararMfa() throws Exception {
        LoginRequestDto dto = LoginRequestDto.builder().email(EMAIL).password(PASSWORD).build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        doNothing().when(mfaService).generateAndSendCode(user);
        when(tokenProvider.gerarTokenMfa(authentication)).thenReturn(MFA_TOKEN);

        MfaTokenResponseDto response = authenticationService.loginUser(dto);

        assertNotNull(response);
        assertEquals(MFA_TOKEN, response.getMfaToken());
        assertEquals(300000L, response.getMfaExpirationTime());
        verify(mfaService).generateAndSendCode(user);
    }

    @Test
    @DisplayName("Deve validar o código MFA com sucesso")
    void deveValidarCodigoMfaComSucesso() throws Exception {
        CodeRequestDto dto = new CodeRequestDto();
        dto.setMfaToken(MFA_TOKEN);
        dto.setCode("0123");

        when(tokenProvider.validarTokenMfa(MFA_TOKEN)).thenReturn(EMAIL);
        when(mfaService.validateCode(EMAIL, "0123")).thenReturn(true);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));

        authenticationService.validatingCode(dto);

        verify(mfaService).validateCode(EMAIL, "0123");
        verify(userRepository).findByEmail(EMAIL);
    }

    @Test
    @DisplayName("Deve lançar exceção quando o código MFA for inválido")
    void deveLancarExcecaoQuandoCodigoInvalido() throws Exception {
        CodeRequestDto dto = new CodeRequestDto();
        dto.setMfaToken(MFA_TOKEN);
        dto.setCode("9999");

        when(tokenProvider.validarTokenMfa(MFA_TOKEN)).thenReturn(EMAIL);
        when(mfaService.validateCode(EMAIL, "9999")).thenReturn(false);

        assertThrows(BadRequestException.class, () -> authenticationService.validatingCode(dto));
    }

    @Test
    @DisplayName("Deve reenviar o código MFA com sucesso")
    void deveReenviarCodigoMfa() throws Exception {
        ResendCodeRequestDto dto = new ResendCodeRequestDto();
        dto.setMfaToken(MFA_TOKEN);

        when(tokenProvider.validarTokenMfa(MFA_TOKEN)).thenReturn(EMAIL);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        doNothing().when(mfaService).generateAndSendCode(user);

        authenticationService.resendCode(dto);

        verify(mfaService).generateAndSendCode(user);
    }
}