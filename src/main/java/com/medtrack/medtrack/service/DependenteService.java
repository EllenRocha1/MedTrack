package com.medtrack.medtrack.service;

import com.medtrack.medtrack.util.exception.AdministradorNaoEncontradoException;
import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.dependente.dto.DadosDependente;
import com.medtrack.medtrack.model.dependente.dto.DadosDependentePut;

import com.medtrack.medtrack.repository.DependenteRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DependenteService {

    private final DependenteRepository dependenteRepository;
    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;

    public DependenteService(
            DependenteRepository dependenteRepository,
            UsuarioRepository usuarioRepository,
            UsuarioService usuarioService,
            JwtService jwtService,
            PasswordEncoder passwordEncoder
    ) {
        this.dependenteRepository = dependenteRepository;
        this.usuarioService = usuarioService;
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Dependente cadastrar(DadosDependente dadosDependente, String authorizationHeader) {
        return cadastrar(dadosDependente, obterAdministradorIdDoToken(authorizationHeader));
    }

    @Transactional
    public Dependente cadastrar(DadosDependente dadosDependente, Long id) {

        if (usuarioRepository.existsByNomeUsuario(dadosDependente.nomeUsuario()) || dependenteRepository.existsByNomeUsuario(dadosDependente.nomeUsuario())) {
            throw new RuntimeException("Nome de usuário já está em uso!");
        }

        DadosDependente dadosComAdministradorId = dadosDependente.withAdministradorId(id);

        var administrador = usuarioService.buscarPorId(dadosComAdministradorId.administradorId())
                .orElseThrow(() -> new AdministradorNaoEncontradoException("Administrador não encontrado com o ID: " + id));

        var dependente = new Dependente(dadosComAdministradorId, administrador);

        String senhaCriptografada = passwordEncoder.encode(dadosComAdministradorId.senha());
        dependente.setSenhaHashed(senhaCriptografada);

        return dependenteRepository.save(dependente);
    }



    public List<Dependente> listarPorAdministradorId(Long administradorId) {
        return dependenteRepository.findByAdministradorId(administradorId);
    }

    public List<Dependente> listarPorToken(String authorizationHeader) {
        return listarPorAdministradorId(obterAdministradorIdDoToken(authorizationHeader));
    }

    public Optional<Dependente> buscarPorId(Long id) {
        return dependenteRepository.findById(id);
    }

    @Transactional
    public Dependente atualizar(DadosDependentePut dados) {
        var dependente = dependenteRepository.getReferenceById(dados.id());

        if (dados.nomeUsuario() != null && !dados.nomeUsuario().equals(dependente.getNomeUsuario())) {
            boolean existeEmUsuarios = usuarioRepository.existsByNomeUsuario(dados.nomeUsuario());
            boolean existeEmDependentes = dependenteRepository.existsByNomeUsuario(dados.nomeUsuario());
            if (existeEmUsuarios || existeEmDependentes) {
                throw new RuntimeException("Nome de usuário já está em uso!");
            }
        }

        dependente.atualizarInformacoes(dados);

        return dependente;
        
    }

    public void deletar(Long id) {
        dependenteRepository.deleteById(id);
    }

    private Long obterAdministradorIdDoToken(String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        String nomeUsuario = jwtService.extractUsername(token);

        return usuarioRepository.getIdByNomeUsuario(nomeUsuario)
                .orElseThrow(() -> new EntityNotFoundException("Administrador nao encontrado"));
    }

    public boolean existePorId(Long id) {
        return dependenteRepository.existsById(id);
    }
}
