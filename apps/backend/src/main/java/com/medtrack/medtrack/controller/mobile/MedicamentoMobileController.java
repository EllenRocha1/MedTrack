package com.medtrack.medtrack.controller.mobile;

import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoMobile;
import com.medtrack.medtrack.service.JwtService;
import com.medtrack.medtrack.service.MedicamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("medicamento/mobile")
public class MedicamentoMobileController {

    private final MedicamentoService medicamentoService;
    private final JwtService jwtService;

    public MedicamentoMobileController(MedicamentoService medicamentoService, JwtService jwtService) {
        this.medicamentoService = medicamentoService;
        this.jwtService = jwtService;
    }

    @GetMapping("/lista")
    public ResponseEntity<List<DadosMedicamentoMobile>> getMedicamentos(@RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return ResponseEntity.ok(medicamentoService.listarMedicamentosMobilePorUsuario(username));
    }
}
