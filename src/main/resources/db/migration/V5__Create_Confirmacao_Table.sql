CREATE TABLE IF NOT EXISTS Confirmacao (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    medicamento_id BIGINT NOT NULL,
    horario TIME NOT NULL,
    data DATE NOT NULL,
    foi_tomado BOOLEAN NOT NULL,
    observacao TEXT,

    CONSTRAINT fk_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_medicamento
    FOREIGN KEY (medicamento_id)
    REFERENCES medicamentos(id)
    ON DELETE CASCADE
);