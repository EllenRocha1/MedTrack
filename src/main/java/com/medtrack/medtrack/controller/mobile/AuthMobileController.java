package com.medtrack.medtrack.controller.mobile;

import com.medtrack.medtrack.model.usuario.dto.DadosLogin;
import com.medtrack.medtrack.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth/mobile")
public class AuthMobileController {

    private final AuthService authService;

    public AuthMobileController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody DadosLogin dados) {
        try {
            String jwt = authService.autenticarMobile(dados);
            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);
            return ResponseEntity.ok(response);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(401).body(Collections.singletonMap("error", "Credenciais invalidas"));
        }
    }
}
