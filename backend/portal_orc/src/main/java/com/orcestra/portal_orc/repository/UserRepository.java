package com.orcestra.portal_orc.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orcestra.portal_orc.model.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);
    boolean existsByCpf(String cpf);
}
