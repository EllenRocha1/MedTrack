package com.medtrack.medtrack.repository;

import com.medtrack.medtrack.model.confirmacao.Confirmacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConfirmacaoRepository extends JpaRepository<Confirmacao, Long> {
    List<Confirmacao> findByUsuarioId(Long usuarioId);
    List<Confirmacao> findByMedicamentoId(Long medicamentoId);
    List<Confirmacao> findByMedicamentoDependenteId(Long dependenteId);
}
