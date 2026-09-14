package com.orcestra.portal_orc.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "diretoria")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DirectorateEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String directorateName;

    @Builder.Default
    @OneToMany(mappedBy = "directorate", fetch = FetchType.LAZY)
    private Set<UserEntity> users = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "directorate", fetch = FetchType.LAZY)
    private Set<ActionPlanEntity> actionPlans = new HashSet<>();

}
