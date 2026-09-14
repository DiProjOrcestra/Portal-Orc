package com.orcestra.portal_orc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orcestra.portal_orc.model.ActionPlanEntity;

public interface ActionPlanRepository extends JpaRepository <ActionPlanEntity, Integer> {
    
}
