package com.medtrack.medtrack.controller;

import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.dependente.dto.DadosDependente;
import com.medtrack.medtrack.model.dependente.dto.DadosDependentePut;
import com.medtrack.medtrack.service.DependenteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/dependentes")
public class DependenteController {

    private final DependenteService dependenteService;

    public DependenteController(DependenteService dependenteService) {
        this.dependenteService = dependenteService;
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<Void> cadastrar(
            @RequestHeader("Authorization") String token,
            @RequestBody @Valid DadosDependente dadosDependente
    ) {
        var dependente = dependenteService.cadastrar(dadosDependente, token);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dependente.getId())
                .toUri();

        return ResponseEntity.created(uri).build();
    }

    @GetMapping("/buscar/todos")
    public ResponseEntity<List<Dependente>> listarTodos(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(dependenteService.listarPorToken(token));
    }

    @GetMapping("/administrador/{administradorId}")
    public ResponseEntity<List<Dependente>> listarPorAdministrador(@PathVariable Long administradorId) {
        List<Dependente> dependentes = dependenteService.listarPorAdministradorId(administradorId);
        return dependentes.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(dependentes);
    }

    @GetMapping("/buscar/{id}")
    public ResponseEntity<Dependente> detalharDependente(@PathVariable Long id) {
        return dependenteService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<DadosDependentePut> atualizar(@RequestBody @Valid DadosDependentePut dados) {
        var dependente = dependenteService.atualizar(dados);
        return ResponseEntity.ok(new DadosDependentePut(dependente));
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!dependenteService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }

        dependenteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
