package com.orcestra.portal_orc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orcestra.portal_orc.model.ObjectiveEntity;

public interface ObjectiveRepository extends JpaRepository <ObjectiveEntity, Integer> {
    
}
