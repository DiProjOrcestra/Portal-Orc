package com.orcestra.portal_orc.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orcestra.portal_orc.model.MvvEntity;

public interface MvvRepository extends JpaRepository<MvvEntity, Integer> {

    Optional<MvvEntity> findFirstByOrderByIdAsc();
}