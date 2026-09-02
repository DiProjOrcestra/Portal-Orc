package com.orcestra.portal_orc.dto;

import com.orcestra.portal_orc.model.UserEntity;

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
public class UserListResponseDto {

    private String cpf;
    private String name;

    public UserListResponseDto(UserEntity userEntity) {
        this.cpf = userEntity.getCpf();
        this.name = userEntity.getName();
    }
}
