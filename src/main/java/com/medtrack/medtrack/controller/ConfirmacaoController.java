package com.medtrack.medtrack.controller;

import com.medtrack.medtrack.model.confirmacao.Confirmacao;
import com.medtrack.medtrack.model.confirmacao.dto.DadosConfirmacao;
import com.medtrack.medtrack.service.ConfirmacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("confirmacao")
public class ConfirmacaoController {

    private final ConfirmacaoService service;

    public ConfirmacaoController(ConfirmacaoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> confirmarMedicamento(@RequestBody DadosConfirmacao request) {
        try {
            Confirmacao confirmacao = service.salvarConfirmacao(request);
            return ResponseEntity.ok(confirmacao);

        } catch(Exception e) {
            return ResponseEntity.badRequest().body("Erro ao confirmar medicamento: " + e.getMessage());
        }
    }
}
