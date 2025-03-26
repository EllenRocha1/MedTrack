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
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

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
        medicamentoRepository.save(medicamentoExistente);
    }

    public List<LocalTime> calcularHorarios(Medicamento medicamento) {
        List<LocalTime> horariosNotificacao = new ArrayList<>();
        FrequenciaUso frequenciaUso = medicamento.getFrequenciaUso();

        if (frequenciaUso.isUsoContinuo()) {
            return frequenciaUso.getHorariosEspecificos();
        }

        LocalDate dataInicio = frequenciaUso.getDataInicio();
        LocalDate dataTermino = frequenciaUso.getDataTermino();

        if (dataTermino.isBefore(LocalDate.now())) {
            return new ArrayList<>();
        }

        if (dataInicio.isBefore(LocalDate.now())) {
            dataInicio = LocalDate.now();
        }

        if (frequenciaUso.getFrequenciaUsoTipo() == FrequenciaUsoTipo.INTERVALO_ENTRE_DOSES) {
            LocalTime primeiroHorario = frequenciaUso.getPrimeiroHorario();
            int intervaloHoras = frequenciaUso.getIntervaloHoras();

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
                horariosNotificacao.addAll(frequenciaUso.getHorariosEspecificos());
                dataAtual = dataAtual.plusDays(1);
            }
        }

        return horariosNotificacao;
    }
}
