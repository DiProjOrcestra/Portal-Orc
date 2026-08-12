package com.orcestra.portal_orc.model;

import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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
@Table(name = "usuarios")
@AllArgsConstructor
@Getter
@Setter
@Builder
@NoArgsConstructor
public class UsuarioEntity implements UserDetails {

    @Id
    private Integer cpf;

    @Column(nullable = false, unique = true)
    private String email;

    private Date dataNascimento;

    @Column(nullable = false)
    private String nome;

    private Integer telefone;

    @Column(name = "semestre_de_entrada")
    private String semestreEntrada;

    private String funcao;

    @Column(nullable = false)
    private String senha;

    @ManyToOne
    @JoinColumn(name = "diretoria_id")
    private DiretoriaEntity diretoria;

    @Builder.Default
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "cargo_usuario", joinColumns = @JoinColumn(name = "usuario_cpf"), inverseJoinColumns = @JoinColumn(name = "cargo_id"))
    private Set<CargoEntity> cargos = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.cargos;
    }

    @Override
    public @Nullable String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

}
