package com.medtrack.medtrack.model.medicamento;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Estoque")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantidadeAtual;
    private Integer quantidadeMinima;

    @OneToOne
    @JoinColumn(name = "medicamento_id", nullable = false)
    @JsonBackReference
    private Medicamento medicamento;

    public Estoque(Integer quantidadeAtual, Integer quantidadeMinima, Medicamento medicamento) {
        this.quantidadeAtual = quantidadeAtual != null ? quantidadeAtual : 0;
        this.quantidadeMinima = quantidadeMinima;
        this.medicamento = medicamento;
    }

    public void decrementar() {
        if (this.quantidadeAtual != null && this.quantidadeAtual > 0) {
            this.quantidadeAtual--;
        }
    }

    public boolean isBaixo() {
        if (this.quantidadeMinima == null) {
            return false;
        }
        if (this.quantidadeAtual != null) {
            return this.quantidadeAtual <= this.quantidadeMinima;
        }
        return false;
    }

    public Long getId() { return id; }
    public Integer getQuantidadeAtual() { return quantidadeAtual; }
    public Integer getQuantidadeMinima() { return quantidadeMinima; }

    public void setQuantidadeAtual(Integer quantidadeAtual) {
    this.quantidadeAtual = quantidadeAtual; 
    }
    public void setQuantidadeMinima(Integer quantidadeMinima) {
    this.quantidadeMinima = quantidadeMinima; 
    }


}