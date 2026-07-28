package com.medtrack.medtrack.service;

import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioAtualizacao;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioCadastro;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioMobile;
import com.medtrack.medtrack.model.usuario.dto.DetalhamentoUsuario;
import com.medtrack.medtrack.repository.DependenteRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository repositorio;

    private final DependenteRepository dependenteRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repositorio, PasswordEncoder passwordEncoder, DependenteRepository dependenteRepository) {
        this.repositorio = repositorio;
        this.passwordEncoder = passwordEncoder;
        this.dependenteRepository = dependenteRepository;
    }

    @Transactional
    public Usuario cadastrarUsuario(DadosUsuarioCadastro dados) {
        if (repositorio.existsByNomeUsuario(dados.nomeUsuario()) || dependenteRepository.existsByNomeUsuario(dados.nomeUsuario())) {
            throw new RuntimeException("Nome de usuário já está em uso!");
        }

        var usuario = new Usuario(dados);
        usuario.setSenhaHashed(passwordEncoder.encode(dados.senha()));

        return repositorio.save(usuario);
    }
    public Optional<Usuario> buscarPorId(Long id) {
        return repositorio.getUsuariosById(id);
    }

    public DadosUsuarioMobile buscarUsuarioMobilePorUsername(String username) {
        return repositorio.findByNomeUsuario(username)
                .map(DadosUsuarioMobile::new)
                .or(() -> dependenteRepository.findByNomeUsuario(username)
                        .map(DadosUsuarioMobile::new))
                .orElseThrow(() -> new EntityNotFoundException("Usuario ou dependente nao encontrado"));
    }

    public Page<DetalhamentoUsuario> listar(Pageable paginacao) {
        return repositorio.findAll(paginacao).map(DetalhamentoUsuario::new);
    }

    public DetalhamentoUsuario detalhar(Long id) {
        Usuario usuario = repositorio.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado"));
        return new DetalhamentoUsuario(usuario);
    }

    @Transactional
    public Usuario atualizarUsuario(Long id, DadosUsuarioAtualizacao dados) {
        Usuario usuario = repositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        if (dados.nomeUsuario() != null && !dados.nomeUsuario().equals(usuario.getNomeUsuario())) {
            boolean existeEmUsuarios = repositorio.existsByNomeUsuario(dados.nomeUsuario());
            boolean existeEmDependentes = dependenteRepository.existsByNomeUsuario(dados.nomeUsuario());
            if (existeEmUsuarios || existeEmDependentes) {
                throw new RuntimeException("Nome de usuário já está em uso!");
            }
        }

        if (dados.nome() != null) {
            usuario.setNome(dados.nome());
        }
        if (dados.nomeUsuario() != null) {
            usuario.setNomeUsuario(dados.nomeUsuario());
        }
        if (dados.numeroTelefone() != null) {
            usuario.setNumeroTelefone(dados.numeroTelefone());
        }
        if (dados.senha() != null) {
            usuario.setSenhaHashed(passwordEncoder.encode(dados.senha()));
        }
        if (dados.dataNascimento() != null) {
            usuario.setDataNascimento(dados.dataNascimento());
        }
        if (dados.tipoConta() != null) {
            usuario.setTipoConta(dados.tipoConta());
        }
        if(dados.email() != null) {
            usuario.setEmail(dados.email());
        }

        return repositorio.save(usuario);
    }

    @Transactional
    public void deletarUsuario(Long id) {
        if (!repositorio.existsById(id)) {
            throw new EntityNotFoundException("Usuario nao encontrado para exclusao");
        }

        repositorio.deleteById(id);
    }
}
