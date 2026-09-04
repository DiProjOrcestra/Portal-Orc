package com.orcestra.portal_orc.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.orcestra.portal_orc.dto.ActionPlanRequestDto;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "plano_de_acao")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ActionPlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome")
    private String name;

    @Column(name = "proridade")
    private String priority;
    
    @Column(name = "objetivo_id")
    private Integer objectiveId;
    
    @Column(name = "prazo")
    private LocalDate term;

    @Column(name = "andamento")
    private String progress;
    
    @Builder.Default
    @OneToMany(mappedBy = "actionPlan", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<SubtaskEntity> subtasks = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "diretoria_id")
    private DirectorateEntity directorate; 

    public ActionPlanEntity(ActionPlanRequestDto actionPlanRequestDto) {
        this.name = actionPlanRequestDto.getName();
        this.objectiveId = actionPlanRequestDto.getObjectiveId();
        this.priority = actionPlanRequestDto.getPriority();
        this.progress = actionPlanRequestDto.getProgress();
        this.term = actionPlanRequestDto.getTerm();
    }
}
