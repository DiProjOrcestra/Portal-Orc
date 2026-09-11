package com.orcestra.portal_orc.dto;

import com.orcestra.portal_orc.model.GoldenCircleEntity;

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
public class GoldenCircleResponseDto {

    private Integer number;
    private String label;
    private String text;

    public GoldenCircleResponseDto(GoldenCircleEntity entity) {
        this.number = entity.getNumber();
        this.label = entity.getLabel();
        this.text = entity.getText();
    }
}