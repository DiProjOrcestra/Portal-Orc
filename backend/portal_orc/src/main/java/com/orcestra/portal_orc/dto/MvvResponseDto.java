package com.orcestra.portal_orc.dto;

import java.util.List;

import com.orcestra.portal_orc.model.MvvEntity;

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
public class MvvResponseDto {

    private Integer id;
    private String quote;
    private String mission;
    private String vision;
    private String valuesText;
    private List<String> values;

    public MvvResponseDto(MvvEntity entity) {
        this.id = entity.getId();
        this.quote = entity.getQuote();
        this.mission = entity.getMission();
        this.vision = entity.getVision();
        this.valuesText = entity.getValuesText();
        this.values = List.copyOf(entity.getValues());
    }
}