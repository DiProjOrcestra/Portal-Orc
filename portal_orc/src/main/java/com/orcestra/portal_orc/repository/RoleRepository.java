package com.orcestra.portal_orc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orcestra.portal_orc.model.RoleEntity;

public interface RoleRepository extends JpaRepository <RoleEntity, Integer> {
    
}
