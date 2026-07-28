package com.medtrack.medtrack.controller;

import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioAtualizacao;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioCadastro;
import com.medtrack.medtrack.model.usuario.dto.DetalhamentoUsuario;
import com.medtrack.medtrack.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<Void> cadastrarUsuario(@RequestBody @Valid DadosUsuarioCadastro dados) {
        var usuario = usuarioService.cadastrarUsuario(dados);

        var uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(usuario.getId())
                .toUri();

        return ResponseEntity.created(uri).build();
    }

    @GetMapping
    public ResponseEntity<Page<DetalhamentoUsuario>> listar(Pageable paginacao) {
        return ResponseEntity.ok(usuarioService.listar(paginacao));
    }

    @GetMapping("/buscar/{id}")
    public ResponseEntity<DetalhamentoUsuario> detalharUsuarios(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.detalhar(id));
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<DetalhamentoUsuario> atualizarUsuario(
            @PathVariable Long id,
            @RequestBody @Valid DadosUsuarioAtualizacao dados
    ) {
        var usuarioAtualizado = usuarioService.atualizarUsuario(id, dados);
        return ResponseEntity.ok(new DetalhamentoUsuario(usuarioAtualizado));
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        usuarioService.deletarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
