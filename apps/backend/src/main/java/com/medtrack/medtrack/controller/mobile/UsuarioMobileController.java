package com.medtrack.medtrack.controller.mobile;

import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioMobile;
import com.medtrack.medtrack.service.JwtService;
import com.medtrack.medtrack.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("usuario/mobile")
public class UsuarioMobileController {

    private final UsuarioService usuarioService;
    private final JwtService jwtService;

    public UsuarioMobileController(UsuarioService usuarioService, JwtService jwtService) {
        this.usuarioService = usuarioService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<DadosUsuarioMobile> getUsuario(@RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        return ResponseEntity.ok(usuarioService.buscarUsuarioMobilePorUsername(username));
    }
}
