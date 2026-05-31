package com.medtrack.medtrack.service;

import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.dependente.DependenteDetails;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.model.usuario.UsuarioDetails;
import com.medtrack.medtrack.model.usuario.dto.DadosLogin;
import com.medtrack.medtrack.repository.DependenteRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final DependenteRepository dependenteRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AuthenticationManager authenticationManager,
            UsuarioRepository usuarioRepository,
            DependenteRepository dependenteRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.dependenteRepository = dependenteRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public String autenticarUsuario(DadosLogin dados) {
        Usuario usuario = usuarioRepository.findByNomeUsuario(dados.username())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado"));

        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dados.username(), dados.password())
        );

        if (!authentication.isAuthenticated()) {
            throw new UsernameNotFoundException("Falha na autenticacao");
        }

        return jwtService.generateToken(new UsuarioDetails(usuario));
    }

    public String autenticarMobile(DadosLogin dados) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByNomeUsuario(dados.username());
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            validarSenha(dados.password(), usuario.getSenhaHashed());
            return jwtService.generateToken(new UsuarioDetails(usuario));
        }

        Dependente dependente = dependenteRepository.findByNomeUsuario(dados.username())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario ou dependente nao encontrado"));

        validarSenha(dados.password(), dependente.getSenhaHashed());
        return jwtService.generateTokenDependente(new DependenteDetails(dependente));
    }

    private void validarSenha(String senhaInformada, String senhaHashed) {
        if (!passwordEncoder.matches(senhaInformada, senhaHashed)) {
            throw new UsernameNotFoundException("Credenciais invalidas");
        }
    }
}
