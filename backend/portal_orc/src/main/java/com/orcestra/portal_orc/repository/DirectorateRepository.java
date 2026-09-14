package com.orcestra.portal_orc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orcestra.portal_orc.model.DirectorateEntity;
import java.util.Optional;


public interface DirectorateRepository extends JpaRepository <DirectorateEntity, Integer>{
    Optional<DirectorateEntity> findByDirectorateName(String directorateName);
}
