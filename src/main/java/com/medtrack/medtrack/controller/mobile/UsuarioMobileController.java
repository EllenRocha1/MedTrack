package com.medtrack.medtrack.controller.mobile;

import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.model.usuario.dto.DadosUsuarioMobile;
import com.medtrack.medtrack.repository.UsuarioRepository;
import com.medtrack.medtrack.service.jwt.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("usuario/mobile")
public class UsuarioMobileController {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public UsuarioMobileController(UsuarioRepository usuarioRepository, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<DadosUsuarioMobile> getUsuario(@RequestHeader("Authorization") String token) {

        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        Optional<Usuario> optional = usuarioRepository.findByNomeUsuario(username);

        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario usuario = optional.get();
        return ResponseEntity.ok(new DadosUsuarioMobile(usuario));
    }

}

