package com.medtrack.medtrack.controller;

import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioAtualizacao;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioCadastro;
import com.medtrack.medtrack.model.usuario.dto.DetalhamentoUsuario;
import com.medtrack.medtrack.repository.UsuarioRepository;
import com.medtrack.medtrack.service.usuario.UsuarioService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


@RestController
@RequestMapping("usuarios")
public class UsuarioController {

    private final UsuarioRepository repositorio;
    private final PasswordEncoder passwordEncoder;
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioRepository repositorio, PasswordEncoder passwordEncoder, UsuarioService usuarioService) {
        this.repositorio = repositorio;
        this.passwordEncoder = passwordEncoder;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastro")
    @Transactional
    public ResponseEntity<Void> cadastrarUsuario(@RequestBody @Valid DadosUsuarioCadastro dados) {
        var usuario = new Usuario(dados);

        usuario.setSenhaHashed(passwordEncoder.encode(dados.senha()));

        repositorio.save(usuario);


       var uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(usuario.getId())
                .toUri();

        return ResponseEntity.created(uri).build();
    }


    @GetMapping
    public ResponseEntity<Page<DetalhamentoUsuario>> listar(Pageable paginacao) {
        var page = repositorio.findAll(paginacao).map(DetalhamentoUsuario::new);
        return ResponseEntity.ok(page);
    }


    @GetMapping("/buscar/{id}")
    public ResponseEntity<DetalhamentoUsuario> detalharUsuarios(@PathVariable Long id) {
        var usuario = repositorio.getReferenceById(id);
        return ResponseEntity.ok(new DetalhamentoUsuario(usuario));

    }

    @PutMapping("/atualizar/{id}")
    @Transactional
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Long id,
                                                    @RequestBody @Valid DadosUsuarioAtualizacao dados) {
        Usuario usuarioAtualizado = usuarioService.atualizarUsuario(id, dados);
        return ResponseEntity.ok(usuarioAtualizado);
    }



    @DeleteMapping("/deletar/{id}")
    @Transactional
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        if (!repositorio.existsById(id)) {
            throw new EntityNotFoundException("Usuário não encontrado para exclusão");
        }
        repositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
