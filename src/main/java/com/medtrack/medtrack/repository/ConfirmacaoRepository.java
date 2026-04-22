package com.medtrack.medtrack.repository;

import com.medtrack.medtrack.model.confirmacao.Confirmacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfirmacaoRepository extends JpaRepository<Confirmacao, Long> {
    @Query("SELECT c FROM Confirmacao c WHERE c.usuario.id = :usuarioId AND c.data = CURRENT_DATE")
    List<Confirmacao> findAllTodayByUsuarioId(Long usuarioId);
}
