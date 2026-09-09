package com.orcestra.portal_orc.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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
@Table(name = "objetivo") 
@AllArgsConstructor 
@NoArgsConstructor 
@Builder 
@Getter 
@Setter 
public class ObjectiveEntity {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "descricao")
    private  String description;

    @OneToMany(mappedBy = "objective", fetch = FetchType.LAZY, cascade = CascadeType.ALL) 
    @Builder.Default
    private Set<ActionPlanEntity> actionPlans = new HashSet<>();
}
