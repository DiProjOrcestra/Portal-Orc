package com.orcestra.portal_orc.dto;

import com.orcestra.portal_orc.model.UserEntity;

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
public class MeResponseDto {

    private String name;
    private String position;
    private String directorate;

    public MeResponseDto(UserEntity userEntity) {
        this.name = userEntity.getName();
        this.position = userEntity.getPosition();
        this.directorate = userEntity.getDirectorate() != null ? userEntity.getDirectorate().getName() : null;
    }
}
