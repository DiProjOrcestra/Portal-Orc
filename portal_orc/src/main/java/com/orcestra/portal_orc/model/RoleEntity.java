package com.orcestra.portal_orc.model;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name =  "cargo")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class RoleEntity implements GrantedAuthority{
    
    @Id
    private Integer id;

    private String name;

    @Override
    public @Nullable String getAuthority() {
        return name;
    }
}
