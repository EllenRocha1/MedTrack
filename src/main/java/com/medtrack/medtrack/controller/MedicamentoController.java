package com.medtrack.medtrack.controller;

import com.medtrack.medtrack.model.medicamento.Medicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoPut;
import com.medtrack.medtrack.repository.MedicamentoRepository;
import com.medtrack.medtrack.service.medicamento.MedicamentoService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/medicamentos")
public class MedicamentoController {
    private static final Logger logger = LoggerFactory.getLogger(MedicamentoController.class);
    private final MedicamentoRepository repositorio;
    private final MedicamentoService medicamentoService;

    public MedicamentoController(MedicamentoRepository repositorio, MedicamentoService medicamentoService) {
        this.repositorio = repositorio;
        this.medicamentoService = medicamentoService;
    }

    @PostMapping("/cadastro")
    @Transactional
    public ResponseEntity<Medicamento> create(@RequestBody @Valid DadosMedicamento dadosMedicamento) {
        logger.info("Recebendo requisição para criar medicamento: {}", dadosMedicamento);
        Medicamento medicamento = medicamentoService.criarMedicamento(dadosMedicamento);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(medicamento.getId())
                .toUri();

        return ResponseEntity.created(uri).body(medicamento);

    }



    @GetMapping("/buscar/{id}")
    public ResponseEntity<Medicamento> detalharMedicamento(@PathVariable Long id) {
        Medicamento medicamento = repositorio.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Medicamento não encontrado"));
        return ResponseEntity.ok(medicamento);
    }

    @PutMapping("/alterar/{id}")
    @Transactional
    public ResponseEntity<Void> atualizarMedicamento(@RequestBody @Valid DadosMedicamentoPut dadosMedicamentoPut, @PathVariable Long id) {
        if (!repositorio.existsById(id)) {
            throw new EntityNotFoundException("Medicamento não encontrado para atualização");
        }
        medicamentoService.atualizarMedicamento(dadosMedicamentoPut, id);


        return ResponseEntity.ok().build();  // Resposta 200 OK sem conteúdo
    }


    @DeleteMapping("/deletar/{id}")
    @Transactional
    public ResponseEntity<Void> deletarMedicamento(@PathVariable Long id) {
        if (!repositorio.existsById(id)) {
            throw new EntityNotFoundException("Medicamento não encontrado para exclusão");
        }
        repositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
