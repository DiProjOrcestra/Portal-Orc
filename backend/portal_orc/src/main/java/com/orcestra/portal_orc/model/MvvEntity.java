package com.orcestra.portal_orc.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "mvv")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class MvvEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "citacao", nullable = false)
    private String quote;

    @Column(name = "missao", nullable = false)
    private String mission;

    @Column(name = "visao", nullable = false)
    private String vision;

    @Column(name = "texto_valores", nullable = false)
    private String valuesText;

    @ElementCollection
    @CollectionTable(name = "mvv_valor", joinColumns = @JoinColumn(name = "mvv_id"))
    @Column(name = "valor", nullable = false)
    @OrderColumn(name = "ordem")
    @Builder.Default
    private List<String> values = new ArrayList<>();
}