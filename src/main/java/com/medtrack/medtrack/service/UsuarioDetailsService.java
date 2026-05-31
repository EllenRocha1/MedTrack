package com.medtrack.medtrack.service;

import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.repository.DependenteRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final DependenteRepository dependenteRepository;

    public UsuarioDetailsService(
            UsuarioRepository usuarioRepository,
            DependenteRepository dependenteRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.dependenteRepository = dependenteRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String nomeUsuario) throws UsernameNotFoundException {
        return usuarioRepository.findByNomeUsuario(nomeUsuario)
                .map(this::criarUserDetailsUsuario)
                .or(() -> dependenteRepository.findByNomeUsuario(nomeUsuario).map(this::criarUserDetailsDependente))
                .orElseThrow(() -> new UsernameNotFoundException("Usuario ou dependente nao encontrado"));
    }

    private UserDetails criarUserDetailsUsuario(Usuario usuario) {
        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + usuario.getTipoConta().name())
        );

        return new org.springframework.security.core.userdetails.User(
                usuario.getNomeUsuario(),
                usuario.getSenhaHashed(),
                authorities
        );
    }

    private UserDetails criarUserDetailsDependente(Dependente dependente) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_DEPENDENTE"));

        return new org.springframework.security.core.userdetails.User(
                dependente.getNomeUsuario(),
                dependente.getSenhaHashed(),
                authorities
        );
    }
}
