package com.orcestra.portal_orc.service;

import java.security.SecureRandom;
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

        DirectorateEntity direcotrate = directorateRepository.findByName(registerRequestDto.getDirectorate())
                                        .orElseGet(() -> directorateRepository.save(DirectorateEntity.builder()
                                            .name(registerRequestDto.getDirectorate()).build()));
                                
        UserEntity userRegister = new UserEntity(registerRequestDto);
        userRegister.setRoles(Set.of(role));
        userRegister.setPassword(passwordEncoder.encode(genereateRandomPassword(15)));
        userRegister.setDirectorate(direcotrate);

        userRepository.save(userRegister);
    }

    public String genereateRandomPassword(Integer length) {

        String letters_up = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String letters_low = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String symbols = "!@#$%^&*()-_=+";
        String dictionary = letters_low + letters_up + numbers + symbols;
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int randomIndex = random.nextInt(dictionary.length());
            char randomCharacter = dictionary.charAt(randomIndex);
            password.append(randomCharacter);
        }
        System.out.println("Sua senha é " + password);
        return password.toString();       
    }
}
