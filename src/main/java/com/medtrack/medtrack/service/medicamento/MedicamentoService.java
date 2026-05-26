package com.medtrack.medtrack.service.medicamento;

import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.medicamento.FrequenciaUso;
import com.medtrack.medtrack.model.medicamento.Medicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosDuplicidadeMedicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoGet;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoPut;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.model.usuario.dto.DadosDashboardPessoal;
import com.medtrack.medtrack.repository.DependenteRepository;
import com.medtrack.medtrack.repository.FrequenciaUsoRepository;
import com.medtrack.medtrack.repository.MedicamentoRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import com.medtrack.medtrack.util.NormalizeString;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


@Service
public class MedicamentoService {

    private final MedicamentoRepository medicamentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final DependenteRepository dependenteRepository;
    private final FrequenciaUsoRepository frequenciaUsoRepository;

    public MedicamentoService(MedicamentoRepository medicamentoRepository, UsuarioRepository usuarioRepository,
                              DependenteRepository dependenteRepository, FrequenciaUsoRepository frequenciaUsoRepository) {
        this.medicamentoRepository = medicamentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.dependenteRepository = dependenteRepository;
        this.frequenciaUsoRepository = frequenciaUsoRepository;

    }

    @Transactional
    public void deletarMedicamento(Long id) {
        Medicamento medicamento = medicamentoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Medicamento não encontrado"));

        if (medicamento.getUsuario() != null) {
            medicamento.getUsuario().getMedicamentos().remove(medicamento);
        }

        medicamentoRepository.delete(medicamento);
    }

    @Transactional
    public Medicamento criarMedicamento(DadosMedicamento dadosMedicamento) {
        Usuario usuario = usuarioRepository.findById(dadosMedicamento.usuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        Dependente dependente = null;
        if (dadosMedicamento.dependenteId() != null) {
            dependente = dependenteRepository.findById(dadosMedicamento.dependenteId())
                    .orElseThrow(() -> new IllegalArgumentException("Dependente não encontrado"));
        }

        verificarDuplicidadePrincipioAtivo(dadosMedicamento);

        FrequenciaUso frequenciaUso = dadosMedicamento.frequenciaUso().id() != null
                ? frequenciaUsoRepository.findById(dadosMedicamento.frequenciaUso().id())
                .orElseThrow(() -> new IllegalArgumentException("Frequência de uso não encontrada"))
                : frequenciaUsoRepository.save(new FrequenciaUso(dadosMedicamento.frequenciaUso()));

        Medicamento medicamento = new Medicamento(dadosMedicamento, usuario, dependente);
        medicamento.setFrequenciaUso(frequenciaUso);

        return medicamentoRepository.save(medicamento);
    }

    private void verificarDuplicidadePrincipioAtivo(DadosMedicamento dadosMedicamento) {
        if (Boolean.TRUE.equals(dadosMedicamento.ignorarDuplicidade())) {
            return;
        }

        String principioAtivoNormalizado = NormalizeString.normalize(dadosMedicamento.principioAtivo());
        if (principioAtivoNormalizado.isBlank()) {
            return;
        }

        List<Medicamento> medicamentosDoContexto = dadosMedicamento.dependenteId() != null
                ? medicamentoRepository.findByDependenteId(dadosMedicamento.dependenteId())
                : medicamentoRepository.findByUsuarioIdAndDependenteIsNull(dadosMedicamento.usuarioId());

        medicamentosDoContexto.stream()
                .filter(medicamento -> principioAtivoNormalizado.equals(
                        NormalizeString.normalize(medicamento.getPrincipioAtivo())
                ))
                .findFirst()
                .ifPresent(medicamento -> {
                    throw new DuplicidadeMedicamentoException(new DadosDuplicidadeMedicamento(medicamento));
                });
    }

    public void atualizarMedicamento(DadosMedicamentoPut dadosMedicamentoPut, Long id) {
        var medicamentoExistente = medicamentoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Medicamento não encontrado"));

        medicamentoExistente.atualizarInformacoes(dadosMedicamentoPut, medicamentoExistente);


        if (dadosMedicamentoPut.estoque() != null) {
          var estoque = medicamentoExistente.getEstoque();

           if (estoque != null) {
              if (dadosMedicamentoPut.estoque().quantidadeAtual() != null) {
                estoque.setQuantidadeAtual(dadosMedicamentoPut.estoque().quantidadeAtual());
              }
              if (dadosMedicamentoPut.estoque().quantidadeMinima() != null) {
                estoque.setQuantidadeMinima(dadosMedicamentoPut.estoque().quantidadeMinima());
              }
            }
        }

        medicamentoRepository.save(medicamentoExistente);
    }

    @Transactional
    public Medicamento atualizarImagem(Long id, String imagemUrl) {
        var medicamentoExistente = medicamentoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Medicamento não encontrado"));

        medicamentoExistente.setImagemUrl(imagemUrl);
        return medicamentoRepository.save(medicamentoExistente);
    }

    public List<Medicamento> listarEstoqueCritico(Long usuarioId) {
    return medicamentoRepository.findEstoqueBaixoByUsuarioId(usuarioId);
}

    public DadosDashboardPessoal obterDadosDashboardPessoal(Long usuarioId) {
        long medicamentosAtivos = medicamentoRepository.countByUsuarioId(usuarioId);
        List<Medicamento> estoqueCritico = listarEstoqueCritico(usuarioId);
        long reposicoesUrgentes = estoqueCritico.size();

        LocalDate hoje = LocalDate.now();
        
        List<Medicamento> medicamentosHoje = medicamentoRepository.findByUsuarioId(usuarioId).stream()
                .filter(m -> {
                    FrequenciaUso freq = m.getFrequenciaUso();
                    if (freq == null) return false;

                    if (freq.isUsoContinuo()) return true;

                    boolean jaComecou = (freq.getDataInicio() == null) || 
                                        !freq.getDataInicio().isAfter(hoje);

                    boolean naoTerminou = (freq.getDataTermino() == null) || 
                                          !freq.getDataTermino().isBefore(hoje);

                    return jaComecou && naoTerminou;
                })
                .toList();

        long proximasDoses = medicamentosHoje.size();

        List<DadosMedicamentoGet> listaMedicamentosHoje = medicamentosHoje.stream()
                .map(DadosMedicamentoGet::new)
                .toList();

        List<DadosMedicamentoGet> listaEstoqueCritico = estoqueCritico.stream()
                .map(DadosMedicamentoGet::new)
                .toList();

        return new DadosDashboardPessoal(medicamentosAtivos, reposicoesUrgentes, proximasDoses, listaMedicamentosHoje, listaEstoqueCritico);
    }
}
