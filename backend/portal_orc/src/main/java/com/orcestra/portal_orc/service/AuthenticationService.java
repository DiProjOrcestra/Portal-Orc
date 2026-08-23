package com.orcestra.portal_orc.service;

import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.orcestra.portal_orc.dto.UserRequestDto;
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

    public void registerUser(UserRequestDto userRequestDto) throws BadRequestException{
        UserEntity userEntity = userRepository.findByEmail(userRequestDto.getEmail()).orElse(null);
        if (userEntity != null){
            throw new BadRequestException("Email já cadastrado");
        }

        if (userRepository.existsByCpf(userRequestDto.getCpf().replaceAll("\\D", ""))) {
            throw new BadRequestException("Esse CPF já foi cadastrado");
        }

        RoleEntity role = roleRepository.findByName(RoleTypeEnum.USER.name())
                            .orElseGet(() -> roleRepository.save(RoleEntity.builder()
                                .name(RoleTypeEnum.USER.name()).build()));

        DirectorateEntity direcotrate = directorateRepository.findByName(userRequestDto.getDirectorate())
                                        .orElseGet(() -> directorateRepository.save(DirectorateEntity.builder()
                                            .name(userRequestDto.getDirectorate()).build()));
                                
        UserEntity userRegister = new UserEntity(userRequestDto);
        userRegister.setPassword(passwordEncoder.encode(userRequestDto.getPassword()));
        userRegister.setRoles(Set.of(role));
        userRegister.setDirectorate(direcotrate);
        userRepository.save(userRegister);
    }

}
