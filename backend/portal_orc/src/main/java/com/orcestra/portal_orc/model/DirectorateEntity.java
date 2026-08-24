package com.orcestra.portal_orc.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
    private Integer id;

    private String nome;

    @Builder.Default
    @OneToMany(mappedBy = "directorate", fetch = FetchType.LAZY)
    private Set<UserEntity> users = new HashSet<>();

}
