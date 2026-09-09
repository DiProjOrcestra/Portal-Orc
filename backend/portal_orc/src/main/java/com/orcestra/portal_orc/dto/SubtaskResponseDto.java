package com.orcestra.portal_orc.dto;

import com.orcestra.portal_orc.model.SubtaskEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubtaskResponseDto {
    private Integer id;
    private String name;
    private Boolean done;

    public SubtaskResponseDto(SubtaskEntity subtaskEntity) {
        this.id = subtaskEntity.getId();
        this.name = subtaskEntity.getTaskName();
        this.done = subtaskEntity.getDone();
    }
}
