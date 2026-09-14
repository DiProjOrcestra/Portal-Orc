package com.orcestra.portal_orc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.orcestra.portal_orc.dto.RegisterRequestDto;
import com.orcestra.portal_orc.dto.ResendPasswordDto;
import com.orcestra.portal_orc.enums.DirectorateEnum;
import com.orcestra.portal_orc.enums.RoleTypeEnum;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.model.DirectorateEntity;
import com.orcestra.portal_orc.model.RoleEntity;
import com.orcestra.portal_orc.model.UserEntity;
import com.orcestra.portal_orc.repository.DirectorateRepository;
import com.orcestra.portal_orc.repository.RoleRepository;
import com.orcestra.portal_orc.repository.UserRepository;
import com.orcestra.portal_orc.service.AuthenticationService;
import com.orcestra.portal_orc.service.EmailSenderService;
import com.orcestra.portal_orc.util.RandomPasswordGenerator;

@ExtendWith(MockitoExtension.class)
class SenhaTemporariaServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private DirectorateRepository directorateRepository;

    @Mock
    private RandomPasswordGenerator randomPasswordGenerator;

    @Mock
    private EmailSenderService emailSenderService;

    @InjectMocks
    private AuthenticationService authenticationService;

    private RegisterRequestDto registerRequest;
    private RoleEntity userRole;
    private DirectorateEntity directorate;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequestDto.builder()
                .cpf("529.982.247-25")
                .email("membro@orcestra.com")
                .birthDate(LocalDate.of(2000, 1, 15))
                .name("Membro Teste")
                .phone(61987654321L)
                .entryDay(LocalDate.of(2024, 2, 1))
                .position("Desenvolvedor")
                .directorate(DirectorateEnum.DIPROJ)
                .build();

        userRole = RoleEntity.builder()
                .id(1)
                .name(RoleTypeEnum.USER.name())
                .build();

        directorate = DirectorateEntity.builder()
                .id(1)
                .directorateName(DirectorateEnum.DIPROJ.name())
                .build();
    }

    @Test
    void deveGerarCriptografarPersistirEEnviarSenhaTemporariaNoCadastro()
            throws BadRequestException {
        String temporaryPassword = "Aa1!Bb2@Cc3#D4$";

        when(userRepository.findByEmail(registerRequest.getEmail()))
                .thenReturn(Optional.empty());
        when(userRepository.existsByCpf("52998224725")).thenReturn(false);
        when(roleRepository.findByName(RoleTypeEnum.USER.name()))
                .thenReturn(Optional.of(userRole));
        when(directorateRepository.findByDirectorateName(DirectorateEnum.DIPROJ.name()))
                .thenReturn(Optional.of(directorate));
        when(randomPasswordGenerator.generateRandomPassword(15))
                .thenReturn(temporaryPassword);
        when(passwordEncoder.encode(temporaryPassword)).thenReturn("senha-temporaria-hash");

        authenticationService.registerUser(registerRequest);

        ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);
        verify(userRepository).save(userCaptor.capture());

        UserEntity savedUser = userCaptor.getValue();
        assertEquals("52998224725", savedUser.getCpf());
        assertEquals(registerRequest.getEmail(), savedUser.getEmail());
        assertEquals("senha-temporaria-hash", savedUser.getPassword());
        assertEquals(Set.of(userRole), savedUser.getRoles());
        assertEquals(directorate, savedUser.getDirectorate());

        verify(randomPasswordGenerator).generateRandomPassword(15);
        verify(passwordEncoder).encode(temporaryPassword);
        verify(emailSenderService).sendEmail(
                registerRequest.getEmail(),
                "Senha para primeiro cadastro",
                "Sua senha é " + temporaryPassword);
    }

    @Test
    void deveCriarRoleEDiretoriaQuandoNaoExistiremNoCadastro() throws BadRequestException {
        String temporaryPassword = "Aa1!Bb2@Cc3#D4$";

        when(userRepository.findByEmail(registerRequest.getEmail()))
                .thenReturn(Optional.empty());
        when(userRepository.existsByCpf("52998224725")).thenReturn(false);
        when(roleRepository.findByName(RoleTypeEnum.USER.name()))
                .thenReturn(Optional.empty());
        when(directorateRepository.findByDirectorateName(DirectorateEnum.DIPROJ.name()))
                .thenReturn(Optional.empty());
        when(roleRepository.save(any(RoleEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(directorateRepository.save(any(DirectorateEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(randomPasswordGenerator.generateRandomPassword(15))
                .thenReturn(temporaryPassword);
        when(passwordEncoder.encode(temporaryPassword)).thenReturn("senha-hash");

        authenticationService.registerUser(registerRequest);

        ArgumentCaptor<RoleEntity> roleCaptor = ArgumentCaptor.forClass(RoleEntity.class);
        verify(roleRepository).save(roleCaptor.capture());
        assertEquals(RoleTypeEnum.USER.name(), roleCaptor.getValue().getName());

        ArgumentCaptor<DirectorateEntity> directorateCaptor =
                ArgumentCaptor.forClass(DirectorateEntity.class);
        verify(directorateRepository).save(directorateCaptor.capture());
        assertEquals(DirectorateEnum.DIPROJ, directorateCaptor.getValue().getDirectorateName());

        verify(userRepository).save(any(UserEntity.class));
        verify(emailSenderService).sendEmail(
                registerRequest.getEmail(),
                "Senha para primeiro cadastro",
                "Sua senha é " + temporaryPassword);
    }

    @Test
    void deveReenviarNovaSenhaTemporariaParaUsuarioExistente() throws NotFoundException {
        String newTemporaryPassword = "Zz9@Yy8#Xx7!W6%";
        ResendPasswordDto resendRequest = ResendPasswordDto.builder()
                .email("membro@orcestra.com")
                .build();
        UserEntity existingUser = UserEntity.builder()
                .cpf("52998224725")
                .email(resendRequest.getEmail())
                .password("senha-antiga-hash")
                .build();

        when(userRepository.findByEmail(resendRequest.getEmail()))
                .thenReturn(Optional.of(existingUser));
        when(randomPasswordGenerator.generateRandomPassword(15))
                .thenReturn(newTemporaryPassword);
        when(passwordEncoder.encode(newTemporaryPassword))
                .thenReturn("nova-senha-hash");

        authenticationService.resendRandomPassword(resendRequest);

        assertEquals("nova-senha-hash", existingUser.getPassword());
        verify(randomPasswordGenerator).generateRandomPassword(15);
        verify(passwordEncoder).encode(newTemporaryPassword);
        verify(userRepository).save(existingUser);
        verify(emailSenderService).sendEmail(
                resendRequest.getEmail(),
                "Senha para primeiro cadastro",
                "Sua senha é " + newTemporaryPassword);
    }

    @Test
    void deveRecusarReenvioQuandoEmailNaoForEncontrado() {
        ResendPasswordDto resendRequest = ResendPasswordDto.builder()
                .email("inexistente@orcestra.com")
                .build();

        when(userRepository.findByEmail(resendRequest.getEmail()))
                .thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> authenticationService.resendRandomPassword(resendRequest));

        assertEquals("Email não encontrado", exception.getMessage());
        verifyNoInteractions(randomPasswordGenerator, passwordEncoder, emailSenderService);
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    void deveGerarSenhaComExatamente15Caracteres() {
        RandomPasswordGenerator generator = new RandomPasswordGenerator();

        String password = generator.generateRandomPassword(15);

        assertEquals(15, password.length());
    }
}