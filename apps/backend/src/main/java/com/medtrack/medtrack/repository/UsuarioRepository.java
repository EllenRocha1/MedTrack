package com.medtrack.medtrack.repository;

import com.medtrack.medtrack.model.usuario.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    boolean existsByNomeUsuario(String nomeUsuario);

    Page<Usuario> findAll(Pageable paginacao);

    Optional<Usuario> getUsuariosById(Long id);

    Optional<Usuario> findByNomeUsuario(String nomeUsuario);

    @Query("SELECT u.id FROM Usuario u WHERE u.nomeUsuario = :nomeUsuario")
    Optional<Long> getIdByNomeUsuario(String nomeUsuario);
}
