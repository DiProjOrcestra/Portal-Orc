package com.orcestra.portal_orc.model;

import com.orcestra.portal_orc.dto.SubtaskRequestDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "subtarefas")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class SubtaskEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nome_tarefa")
    private String taskName;

    @Column(name = "finalizada")
    @Builder.Default()
    private Boolean done = false;

    @ManyToOne
    @JoinColumn(name = "plano_acao_id")
    private ActionPlanEntity actionPlan;

    public SubtaskEntity(SubtaskRequestDto subtaskRequestDto) {
        this.taskName = subtaskRequestDto.getName();
        this.done = subtaskRequestDto.getDone();
    }
}
