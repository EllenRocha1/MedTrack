package com.medtrack.medtrack.controller;

import com.medtrack.medtrack.model.confirmacao.Confirmacao;
import com.medtrack.medtrack.model.confirmacao.dto.DadosConfirmacao;
import com.medtrack.medtrack.model.confirmacao.dto.DadosConfirmacaoResponse;
import com.medtrack.medtrack.service.CloudinaryService;
import com.medtrack.medtrack.service.ConfirmacaoService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/confirmacao")
public class ConfirmacaoController {

    private final ConfirmacaoService service;
    private final CloudinaryService cloudinaryService;

    public ConfirmacaoController(ConfirmacaoService service, CloudinaryService cloudinaryService) {
        this.service = service;
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> confirmarMedicamento(@RequestBody DadosConfirmacao request) {
        try {
            Confirmacao confirmacao = service.salvarConfirmacao(request);
            return ResponseEntity.ok(new DadosConfirmacaoResponse(confirmacao));

        } catch(Exception e) {
            return ResponseEntity.badRequest().body("Erro ao confirmar medicamento: " + e.getMessage());
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> confirmarMedicamentoComImagem(
            @RequestPart("dados") DadosConfirmacao dados,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem
    ) {
        try {
            String comprovanteImagemUrl = cloudinaryService.uploadImagem(imagem);
            Confirmacao confirmacao = service.salvarConfirmacao(dados, comprovanteImagemUrl);
            return ResponseEntity.ok(new DadosConfirmacaoResponse(confirmacao));

        } catch(Exception e) {
            return ResponseEntity.badRequest().body("Erro ao confirmar medicamento: " + e.getMessage());
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<DadosConfirmacaoResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        try {
            List<Confirmacao> lista = service.listarConfirmacoesDoUsuario(usuarioId);
            return ResponseEntity.ok(lista.stream().map(DadosConfirmacaoResponse::new).toList());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
