package com.orcestra.portal_orc.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orcestra.portal_orc.model.GoldenCircleEntity;

public interface GoldenCircleRepository extends JpaRepository<GoldenCircleEntity, Integer> {

    List<GoldenCircleEntity> findAllByOrderByNumberAsc();

    Optional<GoldenCircleEntity> findByNumber(Integer number);
}