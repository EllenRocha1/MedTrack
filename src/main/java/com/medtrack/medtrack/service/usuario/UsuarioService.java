package com.medtrack.medtrack.service.usuario;

import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioAtualizacao;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioCadastro;
import com.medtrack.medtrack.repository.DependenteRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
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
}
