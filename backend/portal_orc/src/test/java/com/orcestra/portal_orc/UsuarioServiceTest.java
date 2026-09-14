package com.orcestra.portal_orc;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.orcestra.portal_orc.dto.RegisterRequestDto;
import com.orcestra.portal_orc.enums.DirectorateEnum;
import com.orcestra.portal_orc.enums.RoleTypeEnum;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.model.DirectorateEntity;
import com.orcestra.portal_orc.model.RoleEntity;
import com.orcestra.portal_orc.model.UserEntity;
import com.orcestra.portal_orc.repository.DirectorateRepository;
import com.orcestra.portal_orc.repository.RoleRepository;
import com.orcestra.portal_orc.repository.UserRepository;
import com.orcestra.portal_orc.service.AuthenticationService;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private DirectorateRepository directorateRepository;

    @InjectMocks
    private AuthenticationService authenticationService;

    private RegisterRequestDto request;

    @BeforeEach
    void setUp() {
        request = RegisterRequestDto.builder()
                .cpf("529.982.247-25")
                .email("membro@orcestra.com")
                .birthDate(LocalDate.of(2000, 1, 15))
                .name("Membro Teste")
                .phone(61987654321L)
                .entryDay(LocalDate.of(2024, 2, 1))
                .position("Desenvolvedor")
                .password("senha-temporaria")
                .directorate(DirectorateEnum.DIPROJ)
                .build();
    }

    @Test
    void deveCadastrarUsuarioComDadosRelacionamentosESenhaCriptografada() throws BadRequestException {
        RoleEntity role = RoleEntity.builder()
                .id(1)
                .name(RoleTypeEnum.USER.name())
                .build();
        DirectorateEntity directorate = DirectorateEntity.builder()
                .id(1)
                .directorateName(DirectorateEnum.DIPROJ.name())
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(userRepository.existsByCpf("52998224725")).thenReturn(false);
        when(roleRepository.findByName(RoleTypeEnum.USER.name())).thenReturn(Optional.of(role));
        when(directorateRepository.findByDirectorateName(DirectorateEnum.DIPROJ.name()))
                .thenReturn(Optional.of(directorate));
        when(passwordEncoder.encode(request.getPassword())).thenReturn("senha-hash");

        authenticationService.registerUser(request);

        ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);
        verify(userRepository).save(userCaptor.capture());

        UserEntity savedUser = userCaptor.getValue();
        assertEquals("52998224725", savedUser.getCpf());
        assertEquals(request.getEmail(), savedUser.getEmail());
        assertEquals(request.getBirthDate(), savedUser.getBirthDate());
        assertEquals(request.getName(), savedUser.getName());
        assertEquals(request.getPhone(), savedUser.getPhone());
        assertEquals(request.getEntryDay(), savedUser.getEntryDay());
        assertEquals(request.getPosition(), savedUser.getPosition());
        assertEquals("senha-hash", savedUser.getPassword());
        assertEquals(directorate, savedUser.getDirectorate());
        assertEquals(Set.of(role), savedUser.getRoles());

        verify(passwordEncoder).encode(request.getPassword());
        verify(userRepository).existsByCpf("52998224725");
    }

    @Test
    void deveCriarRoleEDiretoriaQuandoAindaNaoExistirem() throws BadRequestException {
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(userRepository.existsByCpf("52998224725")).thenReturn(false);
        when(roleRepository.findByName(RoleTypeEnum.USER.name())).thenReturn(Optional.empty());
        when(directorateRepository.findByDirectorateName(DirectorateEnum.DIPROJ.name()))
                .thenReturn(Optional.empty());
        when(roleRepository.save(any(RoleEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(directorateRepository.save(any(DirectorateEntity.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(passwordEncoder.encode(request.getPassword())).thenReturn("senha-hash");

        authenticationService.registerUser(request);

        ArgumentCaptor<RoleEntity> roleCaptor = ArgumentCaptor.forClass(RoleEntity.class);
        verify(roleRepository).save(roleCaptor.capture());
        assertEquals(RoleTypeEnum.USER.name(), roleCaptor.getValue().getName());

        ArgumentCaptor<DirectorateEntity> directorateCaptor =
                ArgumentCaptor.forClass(DirectorateEntity.class);
        verify(directorateRepository).save(directorateCaptor.capture());
        assertEquals(DirectorateEnum.DIPROJ.name(),
                directorateCaptor.getValue().getDirectorateName());

        verify(userRepository).save(any(UserEntity.class));
    }

    @Test
    void deveRecusarCadastroQuandoEmailJaEstiverCadastrado() {
        UserEntity existingUser = UserEntity.builder()
                .cpf("52998224725")
                .email(request.getEmail())
                .build();
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(existingUser));

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> authenticationService.registerUser(request));

        assertEquals("Email já cadastrado", exception.getMessage());
        verify(userRepository, never()).existsByCpf(any(String.class));
        verifyNoInteractions(roleRepository, directorateRepository, passwordEncoder);
        verify(userRepository, never()).save(any(UserEntity.class));
    }

    @Test
    void deveRecusarCadastroQuandoCpfJaEstiverCadastrado() {
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(userRepository.existsByCpf("52998224725")).thenReturn(true);

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> authenticationService.registerUser(request));

        assertEquals("Esse CPF já foi cadastrado", exception.getMessage());
        verify(userRepository).existsByCpf("52998224725");
        verifyNoInteractions(roleRepository, directorateRepository, passwordEncoder);
        verify(userRepository, never()).save(any(UserEntity.class));
    }
}