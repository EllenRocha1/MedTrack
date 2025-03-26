package com.medtrack.medtrack.repository;

import com.medtrack.medtrack.model.confirmacao.Confirmacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfirmacaoRepository extends JpaRepository<Confirmacao, Long> {
}
