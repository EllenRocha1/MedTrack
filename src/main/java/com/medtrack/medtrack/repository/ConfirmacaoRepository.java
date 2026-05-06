package com.medtrack.medtrack.repository;

import com.medtrack.medtrack.model.confirmacao.Confirmacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ConfirmacaoRepository extends JpaRepository<Confirmacao, Long> {
    List<Confirmacao> findByUsuarioId(Long usuarioId);
    @Query("SELECT c FROM Confirmacao c WHERE c.usuario.id = :usuarioId AND c.data = CURRENT_DATE")
    List<Confirmacao> findAllTodayByUsuarioId(Long usuarioId);
}
