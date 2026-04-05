package com.medtrack.medtrack.repository;

import com.medtrack.medtrack.model.medicamento.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MedicamentoRepository extends JpaRepository<Medicamento, Long> {
    List<Medicamento> findByDependenteId(Long dependenteId);
    List<Medicamento> findByUsuarioId(Long usuarioId);

    @Query("SELECT m FROM Medicamento m JOIN m.estoque e WHERE m.usuario.id = :usuarioId AND e.quantidadeAtual <= e.quantidadeMinima")
    List<Medicamento> findEstoqueBaixoByUsuarioId(@Param("usuarioId") Long usuarioId);
}
