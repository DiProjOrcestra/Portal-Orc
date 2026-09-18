package com.orcestra.portal_orc.service;

import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.config.TokenProvider;
import com.orcestra.portal_orc.dto.CodeRequestDto;
import com.orcestra.portal_orc.dto.LoginRequestDto;
import com.orcestra.portal_orc.dto.NewPasswordRequestDto;
import com.orcestra.portal_orc.dto.RegisterRequestDto;
import com.orcestra.portal_orc.dto.ResendPasswordDto;
import com.orcestra.portal_orc.dto.TempTokenResponseDto;
import com.orcestra.portal_orc.enums.RoleTypeEnum;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.exception.NotFoundException;
import com.orcestra.portal_orc.model.DirectorateEntity;
import com.orcestra.portal_orc.model.RoleEntity;
import com.orcestra.portal_orc.model.UserEntity;
import com.orcestra.portal_orc.repository.DirectorateRepository;
import com.orcestra.portal_orc.repository.RoleRepository;
import com.orcestra.portal_orc.repository.UserRepository;
import com.orcestra.portal_orc.util.PasswordValidator;
import com.orcestra.portal_orc.util.RandomPasswordGenerator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final DirectorateRepository directorateRepository;
    private final RandomPasswordGenerator randomPasswordGenerator;
    private final EmailSenderService emailSenderService;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    private final MfaService mfaService;
    private final PasswordValidator passwordValidator;
    @Value("${jwt.expiration}")
    private long expirationTime;
    @Value("${jwt.mfa.expiration}")
    private long tempExpirationTime;

    public void registerUser(RegisterRequestDto registerRequestDto) throws BadRequestException{
        UserEntity userEntity = userRepository.findByEmail(registerRequestDto.getEmail()).orElse(null);
        if (userEntity != null){
            throw new BadRequestException("Email já cadastrado");
        }

        if (userRepository.existsByCpf(registerRequestDto.getCpf().replaceAll("\\D", ""))) {
            throw new BadRequestException("Esse CPF já foi cadastrado");
        }

        RoleEntity role = roleRepository.findByName(RoleTypeEnum.USER.name())
                            .orElseGet(() -> roleRepository.save(RoleEntity.builder()
                                .name(RoleTypeEnum.USER.name()).build()));

        DirectorateEntity direcotrate = directorateRepository.findByDirectorateName(registerRequestDto.getDirectorate().name())
                                        .orElseGet(() -> directorateRepository.save(DirectorateEntity.builder()
                                            .directorateName(registerRequestDto.getDirectorate().name()).build()));
                                
        String userPassword = randomPasswordGenerator.generateRandomPassword(15);
        UserEntity userRegister = new UserEntity(registerRequestDto);
        userRegister.setRoles(Set.of(role));
        userRegister.setPassword(passwordEncoder.encode(userPassword));
        userRegister.setDirectorate(direcotrate);
        userRepository.save(userRegister);
        emailSenderService.sendEmail(registerRequestDto.getEmail(), "Senha para primeiro cadastro", "Sua senha é " + userPassword);
    }

    public void resendRandomPassword(ResendPasswordDto resendPasswordDto) throws NotFoundException {
        UserEntity userEntity = userRepository.findByEmail(resendPasswordDto.getEmail()).orElseThrow(() -> new NotFoundException("Email não encontrado"));

        String userPassword = randomPasswordGenerator.generateRandomPassword(15);
        userEntity.setPassword(passwordEncoder.encode(userPassword));
        userRepository.save(userEntity);
        emailSenderService.sendEmail(resendPasswordDto.getEmail(), "Senha para primeiro cadastro", "Sua senha é " + userPassword);
    }
    public TempTokenResponseDto loginUser(LoginRequestDto dto) throws Exception {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
            UserEntity user = userRepository.findByEmail(dto.getEmail())
                        .orElseThrow(() -> new BadRequestException("Credenciais inválidas"));
            
            if(user.getFirstAccess() == true){
                String tokenPassword = tokenProvider.gerarTokenPassword(user);
                return new TempTokenResponseDto(tokenPassword, tempExpirationTime);
            }

            mfaService.generateAndSendCode(user);

            String tokenMfa = tokenProvider.gerarTokenMfa(authentication);

            return new TempTokenResponseDto(tokenMfa, tempExpirationTime);
        } 
        catch (Exception e){
            throw e;
        }
    }

    public String validatingCode(String mfaToken, CodeRequestDto codeRequestDto) throws Exception{
        String email = tokenProvider.validarTokenMfa(mfaToken);

        Boolean isValid = mfaService.validateCode(email, codeRequestDto.getCode());
        if(!isValid){
            throw new BadRequestException("Código inválido.");
        }

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Credenciais inválidas"));

        return tokenProvider.gerarToken(user);
    }

    public void resendCode(String mfaToken) throws BadRequestException{
        String email = tokenProvider.validarTokenMfa(mfaToken);

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Credenciais inválidas"));

        mfaService.generateAndSendCode(user);
    }

    public String createNewPassword(String passwordToken, NewPasswordRequestDto dto) throws Exception{
        String email = tokenProvider.validarTokenPassword(passwordToken);

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Credenciais inválidas"));

        if(!dto.getNewPassword().equals(dto.getConfirmNewPassword())){
            throw new BadRequestException("As senhas não coincidem.");
        }

        passwordValidator.validate(dto.getNewPassword());
        
        user.setPassword(dto.getNewPassword());
        user.setFirstAccess(false);
        userRepository.save(user);

        return tokenProvider.gerarToken(user);
    }

}
