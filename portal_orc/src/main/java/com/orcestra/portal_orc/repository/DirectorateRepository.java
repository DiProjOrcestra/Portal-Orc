package com.orcestra.portal_orc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orcestra.portal_orc.model.DirectorateEntity;

public interface DirectorateRepository extends JpaRepository <DirectorateEntity, Integer>{
    
}
