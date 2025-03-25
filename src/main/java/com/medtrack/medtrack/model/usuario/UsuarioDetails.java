package com.medtrack.medtrack.model.usuario;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

public class UsuarioDetails implements UserDetails {

    private final Usuario usuario;

    public UsuarioDetails(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> usuario.getTipoConta().name());
    }

    @Override
    public String getPassword() {
        return usuario.getSenhaHashed();
    }

    @Override
    public String getUsername() {
        return usuario.getNomeUsuario();
    }

    public Object getTipoConta() {
        return usuario.getTipoConta();
    }

    public String getEmail() {
        return usuario.getEmail();
    }

    public String getNome() {
        return usuario.getNome();
    }

    public long getId() {
        return usuario.getId();
    }
}

