package com.medtrack.medtrack.repository;

import com.medtrack.medtrack.model.dependente.Dependente;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DependenteRepository extends JpaRepository<Dependente, Long> {
    List<Dependente> findByAdministradorId(long administradorId);

    boolean existsByNomeUsuario(@NotBlank String nomeUsuario);

    Optional <Dependente> findByNomeUsuario(String username);

}

