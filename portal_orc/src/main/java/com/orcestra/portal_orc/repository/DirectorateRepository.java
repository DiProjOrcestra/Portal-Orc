package com.orcestra.portal_orc.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orcestra.portal_orc.enums.DirectorateEnum;
import com.orcestra.portal_orc.model.DirectorateEntity;

public interface DirectorateRepository extends JpaRepository <DirectorateEntity, Integer>{
    
    Optional <DirectorateEntity> findByName(DirectorateEnum nome);
}
