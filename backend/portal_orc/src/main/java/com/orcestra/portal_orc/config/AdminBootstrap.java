package com.orcestra.portal_orc.config;

import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.orcestra.portal_orc.enums.DirectorateEnum;
import com.orcestra.portal_orc.enums.RoleTypeEnum;
import com.orcestra.portal_orc.model.DirectorateEntity;
import com.orcestra.portal_orc.model.RoleEntity;
import com.orcestra.portal_orc.model.UserEntity;
import com.orcestra.portal_orc.repository.DirectorateRepository;
import com.orcestra.portal_orc.repository.RoleRepository;
import com.orcestra.portal_orc.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminBootstrap implements CommandLineRunner {
    
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DirectorateRepository directorateRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.cpf}")
    private String adminCpf;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(adminEmail).isPresent() || 
                userRepository.existsByCpf(adminCpf)) {
            return;
        }

        RoleEntity role = roleRepository.findByName(RoleTypeEnum.ADMIN.name())
                                    .orElseGet(() -> roleRepository.save(RoleEntity.builder()
                                        .name(RoleTypeEnum.ADMIN.name()).build()));
        DirectorateEntity directorate = directorateRepository.findByDirectorateName(DirectorateEnum.DIREX.name())
                                            .orElseGet(() -> directorateRepository.save(DirectorateEntity.builder()
                                                .directorateName(DirectorateEnum.DIREX.name()).build()));
        userRepository.save(UserEntity.builder()
                                        .name("Admin")
                                        .cpf(adminCpf)
                                        .email(adminEmail)
                                        .phone(61987654321L)
                                        .password(passwordEncoder.encode(adminPassword))
                                        .roles(Set.of(role))
                                        .directorate(directorate)
                                        .build());
                        
    }
    
}
