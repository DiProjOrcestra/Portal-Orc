package com.orcestra.portal_orc.service;

import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.dto.RegisterRequestDto;
import com.orcestra.portal_orc.enums.RoleTypeEnum;
import com.orcestra.portal_orc.exception.BadRequestException;
import com.orcestra.portal_orc.model.DirectorateEntity;
import com.orcestra.portal_orc.model.RoleEntity;
import com.orcestra.portal_orc.model.UserEntity;
import com.orcestra.portal_orc.repository.DirectorateRepository;
import com.orcestra.portal_orc.repository.RoleRepository;
import com.orcestra.portal_orc.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final DirectorateRepository directorateRepository;

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

        DirectorateEntity directorate = directorateRepository.findByDirectorateName(registerRequestDto.getDirectorate().name())
                                        .orElseGet(() -> directorateRepository.save(DirectorateEntity.builder()
                                            .directorateName(registerRequestDto.getDirectorate().name()).build()));
                                
        UserEntity userRegister = new UserEntity(registerRequestDto);
        userRegister.setPassword(passwordEncoder.encode(registerRequestDto.getPassword()));
        userRegister.setRoles(Set.of(role));
        userRegister.setDirectorate(directorate);
        userRepository.save(userRegister);
    }

}
