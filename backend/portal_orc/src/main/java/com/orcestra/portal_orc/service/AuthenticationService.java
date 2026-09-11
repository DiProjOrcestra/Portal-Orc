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
import com.orcestra.portal_orc.dto.ResendCodeRequestDto;
import com.orcestra.portal_orc.dto.ResendPasswordDto;
import com.orcestra.portal_orc.dto.TokenResponseDto;
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
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    private final MfaService mfaService;
    private final DirectorateRepository directorateRepository;
    private final RandomPasswordGenerator randomPasswordGenerator;
    private final EmailSenderService emailSenderService;
    private final RegisterRequestDto registerRequestDto;
    private final PasswordValidator passwordValidator;
    @Value("${jwt.expiration}")
    private long accessExpirationTime;
    @Value("${jwt.mfa.expiration}")
    private long mfaExpirationTime;
    @Value("${jwt.password.expiration}")
    private long passwordExpirationTime;

    public void registerUser(RegisterRequestDto userRequestDto) throws BadRequestException{
        UserEntity userEntity = userRepository.findByEmail(userRequestDto.getEmail()).orElse(null);
        if (userEntity != null){
            throw new BadRequestException("Email já cadastrado");
        }

        RoleEntity role = roleRepository.findByName(RoleTypeEnum.USER.name())
                            .orElseGet(() -> roleRepository.save(RoleEntity.builder()
                                .name(RoleTypeEnum.USER.name()).build()));

        DirectorateEntity direcotrate = directorateRepository.findByDirectorateName(registerRequestDto.getDirectorate().getName())
                                        .orElseGet(() -> directorateRepository.save(DirectorateEntity.builder()
                                            .name(registerRequestDto.getDirectorate().getName()).build()));
                                
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
    
    public TokenResponseDto loginUser(LoginRequestDto dto) throws Exception {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
            UserEntity user = userRepository.findByEmail(dto.getEmail())
                        .orElseThrow(() -> new BadRequestException("Credenciais inválidas"));
            
            if(user.getFirstAccess() == true){
                String tokenPassword = tokenProvider.gerarTokenPassword(user);
                return new TokenResponseDto(tokenPassword, "Token temporário para troca de senha obrigatória", passwordExpirationTime);
            }

            mfaService.generateAndSendCode(user);

            String tokenMfa = tokenProvider.gerarTokenMfa(authentication);

            return new TokenResponseDto(tokenMfa, "Token temporário para código de mfa", mfaExpirationTime);
        } 
        catch (Exception e){
            throw e;
        }
    }

    public String validatingCode(CodeRequestDto codeRequestDto) throws Exception{
        String email = tokenProvider.validarTokenMfa(codeRequestDto.getMfaToken());

        Boolean isValid = mfaService.validateCode(email, codeRequestDto.getCode());
        if(!isValid){
            throw new BadRequestException("Código inválido.");
        }

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Credenciais inválidas"));

        return tokenProvider.gerarToken(user);
    }

    public void resendCode(ResendCodeRequestDto resendCodeRequestDto) throws BadRequestException{
        String email = tokenProvider.validarTokenMfa(resendCodeRequestDto.getMfaToken());

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Credenciais inválidas"));

        mfaService.generateAndSendCode(user);
    }

    public String createNewPassword(NewPasswordRequestDto dto) throws Exception{
        String email = tokenProvider.validarTokenPassword(dto.getPasswordToken());

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
