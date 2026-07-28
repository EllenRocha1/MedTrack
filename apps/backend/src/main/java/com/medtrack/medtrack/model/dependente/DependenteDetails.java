package com.medtrack.medtrack.model.dependente;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class DependenteDetails implements UserDetails {
    private final Dependente dependente;

    public DependenteDetails(Dependente dependente) {
        this.dependente = dependente;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public String getPassword() {
        return dependente.getSenhaHashed();
    }

    @Override
    public String getUsername() {
        return dependente.getNomeUsuario();
    }

    public Dependente getDependente() {
        return dependente;
    }

    public String getNome() {
        return dependente.getNome();
    }

    public String getEmail() {
        return dependente.getEmail();
    }

    public String getTelefone() {
        return dependente.getTelefone();
    }
    public long getIdDependente() {
        return dependente.getId();
    }

}

