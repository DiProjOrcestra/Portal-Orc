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
public class UserListResponseDto {

    private Long id;
    private String name;

    public UserListResponseDto(UserEntity userEntity) {
        this.id = userEntity.getId();
        this.name = userEntity.getName();
    }
}
