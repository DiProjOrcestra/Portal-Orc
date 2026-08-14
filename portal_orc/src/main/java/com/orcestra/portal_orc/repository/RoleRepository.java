package com.orcestra.portal_orc.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orcestra.portal_orc.model.RoleEntity;

public interface RoleRepository extends JpaRepository <RoleEntity, Integer> {
    
    Optional<RoleEntity> findByName(String name);
}
