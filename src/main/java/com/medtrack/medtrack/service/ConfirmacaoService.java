package com.medtrack.medtrack.service;

import com.medtrack.medtrack.model.confirmacao.Confirmacao;
import com.medtrack.medtrack.model.confirmacao.dto.DadosConfirmacao;
import com.medtrack.medtrack.repository.ConfirmacaoRepository;
import com.medtrack.medtrack.repository.MedicamentoRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class ConfirmacaoService {

    private final ConfirmacaoRepository confirmacaoRepository;

    private final UsuarioRepository usuarioRepository;

    private final MedicamentoRepository medicamentoRepository;

    public ConfirmacaoService(ConfirmacaoRepository confirmationRepository, UsuarioRepository userRepository, MedicamentoRepository medicineRepository) {
        this.confirmacaoRepository = confirmationRepository;
        this.usuarioRepository = userRepository;
        this.medicamentoRepository = medicineRepository;
    }

    public Confirmacao salvarConfirmacao(DadosConfirmacao dados) {

        var usuario = usuarioRepository.findById(dados.usuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        var medicamento = medicamentoRepository.findById(dados.medicamentoId())
                .orElseThrow(() -> new RuntimeException("Medicamento não encontrado"));

        var confirmacao = new Confirmacao(dados, usuario, medicamento);

        return confirmacaoRepository.save(confirmacao);
    }
}
