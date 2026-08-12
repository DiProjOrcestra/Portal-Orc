package com.orcestra.portal_orc.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orcestra.portal_orc.model.CargoEntity;

public interface CargoRepository extends JpaRepository <CargoEntity, Integer> {
    
}
