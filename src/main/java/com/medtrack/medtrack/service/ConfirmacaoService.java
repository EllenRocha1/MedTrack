package com.medtrack.medtrack.service;

import com.medtrack.medtrack.model.confirmacao.Confirmacao;
import com.medtrack.medtrack.model.confirmacao.dto.DadosConfirmacao;
import com.medtrack.medtrack.repository.ConfirmacaoRepository;
import com.medtrack.medtrack.repository.MedicamentoRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfirmacaoService {

    private final ConfirmacaoRepository confirmacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final MedicamentoRepository medicamentoRepository;

    public ConfirmacaoService(
            ConfirmacaoRepository confirmacaoRepository,
            UsuarioRepository usuarioRepository,
            MedicamentoRepository medicamentoRepository
    ) {
        this.confirmacaoRepository = confirmacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.medicamentoRepository = medicamentoRepository;
    }

    public Confirmacao salvarConfirmacao(DadosConfirmacao dados) {
        return salvarConfirmacao(dados, null);
    }

    public Confirmacao salvarConfirmacao(DadosConfirmacao dados, String comprovanteImagemUrl) {
        var usuario = usuarioRepository.findById(dados.usuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));
        var medicamento = medicamentoRepository.findById(dados.medicamentoId())
                .orElseThrow(() -> new RuntimeException("Medicamento nao encontrado"));

        var confirmacao = new Confirmacao(dados, usuario, medicamento, comprovanteImagemUrl);

        return confirmacaoRepository.save(confirmacao);
    }

    public List<Confirmacao> listarConfirmacoesDoUsuario(Long usuarioId) {
        return confirmacaoRepository.findByUsuarioId(usuarioId);
    }

    public List<Confirmacao> listarConfirmacoesDoDependente(Long dependenteId) {
        return confirmacaoRepository.findByMedicamentoDependenteId(dependenteId);
    }

    public List<Confirmacao> listarConfirmacoesDoMedicamento(Long medicamentoId) {
        return confirmacaoRepository.findByMedicamentoId(medicamentoId);
    }
}
