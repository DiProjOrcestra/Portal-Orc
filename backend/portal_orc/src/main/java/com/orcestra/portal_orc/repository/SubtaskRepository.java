package com.orcestra.portal_orc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orcestra.portal_orc.model.SubtaskEntity;

public interface SubtaskRepository extends JpaRepository <SubtaskEntity, Integer> {
    
}
