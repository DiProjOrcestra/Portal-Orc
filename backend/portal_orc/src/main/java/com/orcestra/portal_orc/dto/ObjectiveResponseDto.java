package com.orcestra.portal_orc.dto;

import com.orcestra.portal_orc.model.ObjectiveEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor 
@NoArgsConstructor 
@Builder 
@Getter 
@Setter 
public class ObjectiveResponseDto {
    private Integer id;
    private String description;

    public ObjectiveResponseDto(ObjectiveEntity objectiveEntity) {
        this.id = objectiveEntity.getId();
        this.description = objectiveEntity.getDescription();
    }
}
