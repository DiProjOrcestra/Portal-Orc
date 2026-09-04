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
import com.orcestra.portal_orc.dto.MfaTokenResponseDto;
import com.orcestra.portal_orc.dto.RegisterRequestDto;
import com.orcestra.portal_orc.dto.TokenResponseDto;
import com.orcestra.portal_orc.enums.RoleTypeEnum;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.model.RoleEntity;
import com.orcestra.portal_orc.model.UserEntity;
import com.orcestra.portal_orc.repository.RoleRepository;
import com.orcestra.portal_orc.repository.UserRepository;

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
    @Value("${jwt.expiration}")
    private long expirationTime;
    @Value("${jwt.mfa.expiration}")
    private long mfaExpirationTime;

    public void registerUser(RegisterRequestDto userRequestDto) throws BadRequestException{
        UserEntity userEntity = userRepository.findByEmail(userRequestDto.getEmail()).orElse(null);
        if (userEntity != null){
            throw new BadRequestException("Email já cadastrado");
        }

        RoleEntity role = roleRepository.findByName(RoleTypeEnum.USER.name())
                            .orElseGet(() -> roleRepository.save(RoleEntity.builder()
                                .name(RoleTypeEnum.USER.name()).build()));

        UserEntity userRegister = new UserEntity(userRequestDto);
        userRegister.setPassword(passwordEncoder.encode(userRequestDto.getPassword()));
        userRegister.setRoles(Set.of(role));
        userRepository.save(userRegister);
    }

    public MfaTokenResponseDto loginUser(LoginRequestDto dto) throws Exception {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
            mfaService.generateAndSendCode(dto);

            String mfaToken = tokenProvider.gerarTokenMfa(authentication);

            return new MfaTokenResponseDto(mfaToken, "Código de verificação enviado para o e-mail cadastrado", mfaExpirationTime);
        } 
        catch (Exception e){
            throw e;
        }
    }

    public TokenResponseDto validatingCode(CodeRequestDto codeRequestDto) throws Exception{
        String email = tokenProvider.validarTokenMfa(codeRequestDto.getMfaToken());

        Boolean isValid = mfaService.validateCode(email, codeRequestDto.getCode());
        if(!isValid){
            throw new BadRequestException("Código inválido.");
        }

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Credenciais inválidas"));
        
        String token = tokenProvider.gerarToken(user);
        return new TokenResponseDto(token, expirationTime);
    }

}
