package com.orcestra.portal_orc.model;

import java.time.LocalDate;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.orcestra.portal_orc.dto.UserRequestDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario")
@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class UserEntity implements UserDetails {

    @Id
    @Column(length = 11)
    private String cpf;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "data_de_nascimento")
    private LocalDate birthDate;
    
    @Column(nullable = false, name = "nome")
    private String name;

    @Column(name = "telefone")
    private Long phone;

    @Column(name = "dia_de_entrada")
    private LocalDate entryDay;

    @Column(name = "funcao_na_empresa")
    private String position;

    @Column(nullable = false, name = "senha")
    private String password;

    @ManyToOne
    @JoinColumn(name = "diretoria_id")
    private DirectorateEntity directorate;

    @Builder.Default
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "cargo_usuario", joinColumns = @JoinColumn(name = "usuario_cpf"), inverseJoinColumns = @JoinColumn(name = "cargo_id"))
    private Set<RoleEntity> roles = new HashSet<>(); //roles de autenticação

    public UserEntity(UserRequestDto userRequestDto){
        this.cpf = userRequestDto.getCpf().replaceAll("\\D", "");
        this.email = userRequestDto.getEmail();
        this.birthDate = userRequestDto.getBirthDate();
        this.name = userRequestDto.getName();
        this.phone = userRequestDto.getPhone();
        this.entryDay = userRequestDto.getEntryDay();
        this.position = userRequestDto.getPosition();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles;
    }

    @Override
    public @Nullable String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

}
