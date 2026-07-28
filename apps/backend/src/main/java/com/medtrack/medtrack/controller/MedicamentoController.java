package com.medtrack.medtrack.controller;

import com.medtrack.medtrack.model.medicamento.dto.DadosEstoqueGet;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoGet;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoPut;
import com.medtrack.medtrack.model.usuario.dto.DadosDashboardPessoal;
import com.medtrack.medtrack.service.CloudinaryService;
import com.medtrack.medtrack.service.MedicamentoService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/medicamentos")
public class MedicamentoController {
    private static final Logger logger = LoggerFactory.getLogger(MedicamentoController.class);

    private final MedicamentoService medicamentoService;
    private final CloudinaryService cloudinaryService;

    public MedicamentoController(MedicamentoService medicamentoService, CloudinaryService cloudinaryService) {
        this.medicamentoService = medicamentoService;
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<DadosMedicamentoGet> create(@RequestBody @Valid DadosMedicamento dadosMedicamento) {
        logger.info("Recebendo requisicao para criar medicamento: {}", dadosMedicamento);

        var medicamento = medicamentoService.criarMedicamento(dadosMedicamento);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(medicamento.getId())
                .toUri();

        return ResponseEntity.created(uri).body(new DadosMedicamentoGet(medicamento));
    }

    @GetMapping("/todos/{usuarioId}")
    public ResponseEntity<List<DadosMedicamentoGet>> getMedicamentosByUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(medicamentoService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/buscar/{id}")
    public ResponseEntity<DadosMedicamentoGet> detalharMedicamento(@PathVariable Long id) {
        return ResponseEntity.ok(medicamentoService.detalhar(id));
    }

    @GetMapping("/todos/dependente/{dependenteId}")
    public ResponseEntity<List<DadosMedicamentoGet>> getMedicamentosByDependenteId(@PathVariable Long dependenteId) {
        return ResponseEntity.ok(medicamentoService.listarPorDependente(dependenteId));
    }

    @GetMapping("/estoque-critico/{usuarioId}")
    public ResponseEntity<List<DadosMedicamentoGet>> getEstoqueCritico(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(medicamentoService.listarEstoqueCriticoDto(usuarioId));
    }

    @GetMapping("/dashboard/resumo/{usuarioId}")
    public ResponseEntity<DadosDashboardPessoal> getDashboardResumo(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(medicamentoService.obterDadosDashboardPessoal(usuarioId));
    }

    @PatchMapping("/{id}/consumir")
    public ResponseEntity<DadosEstoqueGet> consumirDose(@PathVariable Long id) {
        return ResponseEntity.ok(medicamentoService.consumirDose(id));
    }

    @PatchMapping("/{id}/repor")
    public ResponseEntity<DadosEstoqueGet> reporEstoque(@PathVariable Long id, @RequestBody Integer quantidadeAdicionada) {
        return ResponseEntity.ok(medicamentoService.reporEstoque(id, quantidadeAdicionada));
    }

    @PutMapping("/alterar/{id}")
    public ResponseEntity<Void> atualizarMedicamento(
            @RequestBody @Valid DadosMedicamentoPut dadosMedicamentoPut,
            @PathVariable Long id
    ) {
        medicamentoService.atualizarMedicamento(dadosMedicamentoPut, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/{id}/imagem", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DadosMedicamentoGet> atualizarImagem(
            @PathVariable Long id,
            @RequestPart("imagem") MultipartFile imagem
    ) {
        String imagemUrl = cloudinaryService.uploadImagemMedicamento(imagem);
        var medicamento = medicamentoService.atualizarImagem(id, imagemUrl);
        return ResponseEntity.ok(new DadosMedicamentoGet(medicamento));
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> deletarMedicamento(@PathVariable Long id) {
        medicamentoService.deletarMedicamento(id);
        return ResponseEntity.noContent().build();
    }
}
