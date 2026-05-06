package com.medtrack.medtrack.service.medicamento;

import com.medtrack.medtrack.model.dependente.Dependente;
import com.medtrack.medtrack.model.medicamento.FrequenciaUso;
import com.medtrack.medtrack.model.medicamento.FrequenciaUsoTipo;
import com.medtrack.medtrack.model.medicamento.Medicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamento;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoPut;
import com.medtrack.medtrack.model.usuario.Usuario;
import com.medtrack.medtrack.repository.DependenteRepository;
import com.medtrack.medtrack.repository.FrequenciaUsoRepository;
import com.medtrack.medtrack.repository.MedicamentoRepository;
import com.medtrack.medtrack.repository.UsuarioRepository;
import com.medtrack.medtrack.model.usuario.dto.DadosDashboardPessoal;
import com.medtrack.medtrack.model.medicamento.dto.DadosMedicamentoGet;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.medtrack.medtrack.model.medicamento.dto.DadosEstoqueGet;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
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

        FrequenciaUso frequenciaUso = dadosMedicamento.frequenciaUso().id() != null
                ? frequenciaUsoRepository.findById(dadosMedicamento.frequenciaUso().id())
                .orElseThrow(() -> new IllegalArgumentException("Frequência de uso não encontrada"))
                : frequenciaUsoRepository.save(new FrequenciaUso(dadosMedicamento.frequenciaUso()));

        Medicamento medicamento = new Medicamento(dadosMedicamento, usuario, dependente);
        medicamento.setFrequenciaUso(frequenciaUso);

        return medicamentoRepository.save(medicamento);
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


    public List<LocalTime> calcularHorarios(Medicamento medicamento) {
        List<LocalTime> horariosNotificacao = new ArrayList<>();
        FrequenciaUso frequenciaUso = medicamento.getFrequenciaUso();

        // 1. Se for uso contínuo, ignora datas e retorna os horários
        if (frequenciaUso.isUsoContinuo()) {
            return frequenciaUso.getHorariosEspecificos() != null ? frequenciaUso.getHorariosEspecificos() : new ArrayList<>();
        }

        LocalDate dataInicio = frequenciaUso.getDataInicio();
        LocalDate dataTermino = frequenciaUso.getDataTermino();

        // 2. Proteção contra Data de Término nula
        if (dataTermino != null && dataTermino.isBefore(LocalDate.now())) {
            return new ArrayList<>();
        }

        // 3. Proteção contra Data de Início nula (Erro que você tomou)
        if (dataInicio == null || dataInicio.isBefore(LocalDate.now())) {
            dataInicio = LocalDate.now();
        }

        // 4. Se chegou aqui e a dataTermino for nula por erro de cadastro, 
        // definimos um limite padrão (ex: 30 dias) para não dar erro no loop (while) abaixo
        if (dataTermino == null) {
            dataTermino = dataInicio.plusDays(30);
        }

        if (frequenciaUso.getFrequenciaUsoTipo() == FrequenciaUsoTipo.INTERVALO_ENTRE_DOSES) {
            LocalTime primeiroHorario = frequenciaUso.getPrimeiroHorario();
            
            // Proteção extra caso o primeiroHorario também seja nulo
            if (primeiroHorario == null) primeiroHorario = LocalTime.of(8, 0); 
            
            int intervaloHoras = frequenciaUso.getIntervaloHoras();
            if (intervaloHoras <= 0) intervaloHoras = 8; // Evita divisão por zero

            int horariosPorDia = 24 / intervaloHoras;

            LocalDate dataAtual = dataInicio;
            while (!dataAtual.isAfter(dataTermino)) {
                for (int i = 0; i < horariosPorDia; i++) {
                    LocalTime horarioAtual = primeiroHorario.plusHours(i * intervaloHoras);
                    horariosNotificacao.add(horarioAtual);
                }
                dataAtual = dataAtual.plusDays(1);
            }
        } else if (frequenciaUso.getFrequenciaUsoTipo() == FrequenciaUsoTipo.HORARIOS_ESPECIFICOS) {
            LocalDate dataAtual = dataInicio;
            while (!dataAtual.isAfter(dataTermino)) {
                if (frequenciaUso.getHorariosEspecificos() != null) {
                    horariosNotificacao.addAll(frequenciaUso.getHorariosEspecificos());
                }
                dataAtual = dataAtual.plusDays(1);
            }
        }

        return horariosNotificacao;
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
