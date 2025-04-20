package com.medtrack.medtrack.controller.mobile;

import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.medicamento.Medicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoMobile;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.repository.DependenteRepository;
import com.medtrack.medtrack.repository.MedicamentoRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import com.medtrack.medtrack.service.jwt.JwtService;
import com.medtrack.medtrack.service.medicamento.MedicamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.medtrack.medtrack.model.usuario.CategoriaUsuario.ADMINISTRADOR;
import static com.medtrack.medtrack.model.usuario.CategoriaUsuario.PESSOAL;

@RestController
@RequestMapping("medicamento/mobile")
public class MedicamentoMobileController {

    private final MedicamentoRepository medicamentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final MedicamentoService medicamentoService;
    private final DependenteRepository dependenteRepository;

    public MedicamentoMobileController(MedicamentoRepository medicamentoRepository, UsuarioRepository usuarioRepository,
                                       JwtService jwtService, MedicamentoService medicamentoService, DependenteRepository dependenteRepository){
        this.medicamentoRepository = medicamentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.medicamentoService = medicamentoService;
        this.dependenteRepository = dependenteRepository;
    }


    @GetMapping("/lista")
    public ResponseEntity<List<DadosMedicamentoMobile>> getMedicamentos(@RequestHeader("Authorization") String token) {
        String username = jwtService.extractUsername(token.replace("Bearer ", ""));
        Optional<Usuario> optionalUsuario = usuarioRepository.findByNomeUsuario(username);
        Optional<Dependente> optionalDependente = dependenteRepository.findByNomeUsuario(username);
        List<Medicamento> medicamentos;

        if (optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();
            medicamentos = medicamentoRepository.findByUsuarioId(usuario.getId());
        } else if (optionalDependente.isPresent()) {
            Dependente dependente = optionalDependente.get();
            System.out.println(dependente.toString());
            medicamentos = medicamentoRepository.findByDependenteId(dependente.getId());
            System.out.println(medicamentos);
        } else {
            return ResponseEntity.notFound().build();
        }

        List<DadosMedicamentoMobile> medicamentosMobile = medicamentos.stream()
                .map(medicamento -> {
                    List<LocalTime> horarios = medicamentoService.calcularHorarios(medicamento);
                    boolean usoContinuo = medicamento.getFrequenciaUso().isUsoContinuo();
                    return new DadosMedicamentoMobile(medicamento, horarios, usoContinuo);
                })
                .filter(medimentoMobile -> !medimentoMobile.horarios().isEmpty())
                .collect(Collectors.toList());

        return ResponseEntity.ok(medicamentosMobile);
    }

}
