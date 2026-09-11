package com.orcestra.portal_orc.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "golden_circle", uniqueConstraints = @UniqueConstraint(columnNames = "numero"))
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class GoldenCircleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "numero", nullable = false)
    private Integer number;

    @Column(name = "rotulo", nullable = false)
    private String label;

    @Column(name = "texto", nullable = false)
    private String text;
}