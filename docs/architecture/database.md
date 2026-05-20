# Arquitetura de Banco de Dados

Este arquivo documenta a arquitetura de banco encontrada no estado atual do projeto.

O objetivo aqui nao e descrever o banco ideal, mas registrar o schema controlado por Flyway e os pontos onde ele diverge ou depende do Hibernate.

## Banco principal

- PostgreSQL
- Flyway habilitado
- Hibernate/JPA habilitado
- `spring.jpa.hibernate.ddl-auto=update` ainda ativo

Ponto de atencao:

O projeto usa migrations Flyway, mas tambem permite que o Hibernate altere o schema automaticamente com `ddl-auto=update`.

Enquanto essa configuracao existir, o schema real de um ambiente pode ser resultado de:

```text
Migrations Flyway + ajustes automaticos do Hibernate
```

Para um banco previsivel, a direcao futura deve ser deixar Flyway como fonte unica de verdade e trocar `ddl-auto=update` por `validate` quando as migrations estiverem completas.

## Localizacao das migrations

As migrations estao em:

```text
src/main/resources/db/migration/
```

Arquivos existentes:

```text
V1__create_tables.sql
V2__remove_table_frequencia_uso_dias_semana.sql
V3__alter_table_dependentes.sql
V4__alter_frequencia_uso_nullable.sql
V5__Create_Confirmacao_Table.sql
V6__create_table_estoque.sql
```

## Historico das migrations

### V1 - tabelas iniciais

Cria as tabelas principais:

- `usuarios`
- `medicamentos`
- `frequencia_uso`
- `frequencia_uso_dias_semana`
- `frequencia_uso_horarios_especificos`
- `dependentes`

Tambem cria relacionamentos:

- `medicamentos.usuario_id -> usuarios.id`
- `medicamentos.frequencia_uso_id -> frequencia_uso.id`
- `frequencia_uso_dias_semana.frequencia_uso_id -> frequencia_uso.id`
- `frequencia_uso_horarios_especificos.frequencia_uso_id -> frequencia_uso.id`
- `dependentes.administrador_id -> usuarios.id`
- `medicamentos.dependente_id -> dependentes.id`

### V2 - remocao de dias da semana

Remove a tabela:

- `frequencia_uso_dias_semana`

O modelo JPA atual nao possui mais `diasSemana`, entao essa migration esta alinhada com o codigo atual.

### V3 - login de dependentes

Adiciona em `dependentes`:

- `nome_usuario VARCHAR(255) NOT NULL`
- `senha_hashed VARCHAR(255) NOT NULL`

Esses campos permitem autenticar dependentes no fluxo mobile.

### V4 - frequencia com intervalo opcional

Altera `frequencia_uso.intervalo_horas` para aceitar `NULL`.

Isso combina com o modelo `FrequenciaUso`, onde `intervaloHoras` e `Integer` e pode representar frequencias baseadas em horarios especificos.

### V5 - confirmacao de medicacao

Cria `Confirmacao`:

- `id`
- `usuario_id`
- `medicamento_id`
- `horario`
- `data`
- `foi_tomado`
- `observacao`

Relacionamentos:

- `Confirmacao.usuario_id -> usuarios.id`
- `Confirmacao.medicamento_id -> medicamentos.id`

Ambas as FKs usam `ON DELETE CASCADE`.

### V6 - estoque

Cria `Estoque`:

- `id`
- `quantidade_atual`
- `quantidade_minima`
- `medicamento_id`

Relacionamento:

- `Estoque.medicamento_id -> Medicamentos.id`

`medicamento_id` e `UNIQUE NOT NULL`, formando uma relacao um-para-um entre medicamento e estoque.

## Tabelas atuais

### `usuarios`

Representa usuarios principais da aplicacao.

Campos principais:

- `id`
- `tipo_conta`
- `nome`
- `email`
- `senha_hashed`
- `data_nascimento`
- `nome_usuario`
- `numero_telefone`

Relacionamentos:

- Um usuario pode administrar varios dependentes.
- Um usuario pode ter varios medicamentos.
- Um usuario pode ter varias confirmacoes.

Entidade JPA:

```text
model/usuario/Usuario.java
```

### `dependentes` / `Dependentes`

Representa pessoas dependentes associadas a um usuario administrador.

Campos principais:

- `id`
- `nome`
- `email`
- `telefone`
- `administrador_id`
- `nome_usuario`
- `senha_hashed`

Relacionamentos:

- Um dependente pertence a um usuario administrador.
- Um dependente pode ter varios medicamentos.

Entidade JPA:

```text
model/dependente/Dependente.java
```

Ponto de atencao:

A migration inicial cria `dependentes`, mas a entidade usa `@Table(name = "Dependentes")`.

No PostgreSQL sem aspas, nomes sao normalizados para minusculo. Mesmo assim, migrations futuras devem padronizar nomes para evitar divergencia entre ambientes e ferramentas.

### `medicamentos` / `Medicamentos`

Representa medicamentos cadastrados para usuario ou dependente.

Campos principais:

- `id`
- `nome`
- `principio_ativo`
- `dosagem`
- `observacoes`
- `usuario_id`
- `dependente_id`
- `frequencia_uso_id`

Relacionamentos:

- Um medicamento pode pertencer diretamente a um usuario.
- Um medicamento pode pertencer a um dependente.
- Um medicamento possui uma frequencia de uso.
- Um medicamento pode possuir um estoque.
- Um medicamento pode ter varias confirmacoes.

Entidade JPA:

```text
model/medicamento/Medicamento.java
```

Pontos de atencao:

- `usuario_id` e `dependente_id` sao opcionais no schema, mas a regra de negocio espera que ao menos um contexto exista.
- `frequencia_uso_id` e `NOT NULL` na migration V1.
- Existe constraint unica em `frequencia_uso_id`, reforcando a relacao um-para-um entre medicamento e frequencia.

### `frequencia_uso`

Representa a regra de uso de um medicamento.

Campos principais:

- `id`
- `frequencia_uso_tipo`
- `uso_continuo`
- `intervalo_horas`
- `primeiro_horario`
- `data_inicio`
- `data_termino`

Relacionamentos:

- Uma frequencia pertence a um medicamento.
- Uma frequencia pode ter horarios especificos na tabela auxiliar `frequencia_uso_horarios_especificos`.

Entidade JPA:

```text
model/medicamento/FrequenciaUso.java
```

### `frequencia_uso_horarios_especificos`

Tabela auxiliar gerada para a `@ElementCollection` de `FrequenciaUso.horariosEspecificos`.

Campos:

- `frequencia_uso_id`
- `horarios_especificos`

Relacionamento:

- `frequencia_uso_id -> frequencia_uso.id`

### `Confirmacao`

Registra se uma dose foi tomada em determinada data e horario.

Campos principais:

- `id`
- `usuario_id`
- `medicamento_id`
- `horario`
- `data`
- `foi_tomado`
- `observacao`

Relacionamentos:

- Uma confirmacao pertence a um usuario.
- Uma confirmacao pertence a um medicamento.

Entidade JPA:

```text
model/confirmacao/Confirmacao.java
```

Ponto de atencao:

A confirmacao referencia sempre `usuario_id`, mesmo quando o medicamento esta associado a um dependente.

### `Estoque`

Representa controle de estoque de um medicamento.

Campos principais:

- `id`
- `quantidade_atual`
- `quantidade_minima`
- `medicamento_id`

Relacionamento:

- Um estoque pertence a um medicamento.

Entidade JPA:

```text
model/medicamento/Estoque.java
```

## Relacionamentos principais

```text
usuarios 1---N dependentes
usuarios 1---N medicamentos
dependentes 1---N medicamentos
medicamentos 1---1 frequencia_uso
frequencia_uso 1---N frequencia_uso_horarios_especificos
medicamentos 1---0..1 Estoque
usuarios 1---N Confirmacao
medicamentos 1---N Confirmacao
```

## Diagrama textual

```text
usuarios
|-- dependentes
|   `-- medicamentos
|       |-- frequencia_uso
|       |   `-- frequencia_uso_horarios_especificos
|       `-- Estoque
|-- medicamentos
|   |-- frequencia_uso
|   |   `-- frequencia_uso_horarios_especificos
|   `-- Estoque
`-- Confirmacao
    `-- medicamentos
```

## Repositories relacionados

- `UsuarioRepository`
- `DependenteRepository`
- `MedicamentoRepository`
- `FrequenciaUsoRepository`
- `ConfirmacaoRepository`

Consultas relevantes:

- Busca de usuario por `nomeUsuario`.
- Busca de dependente por administrador.
- Busca de medicamento por usuario.
- Busca de medicamento por dependente.
- Busca de estoque baixo por usuario.
- Busca de confirmacoes por usuario.
- Busca de confirmacoes do dia por usuario.

## Inconsistencias e riscos atuais

- `ddl-auto=update` pode mascarar migrations incompletas.
- Nomes de tabelas alternam entre minusculo e inicial maiuscula.
- Algumas migrations usam `IF NOT EXISTS`, o que pode esconder divergencias de schema.
- O schema nao define unicidade para `nome_usuario` em `usuarios` ou `dependentes`, embora o codigo valide duplicidade.
- O schema nao define unicidade para `email`.
- `dependentes.nome_usuario` e `dependentes.senha_hashed` foram adicionados como `NOT NULL`; isso pode falhar em bancos antigos com linhas preexistentes.
- `Confirmacao` referencia usuario e medicamento, mas nao dependente diretamente.
- Algumas constraints possuem nomes genericos, como `fk_usuario` e `fk_medicamento`.
- Existe duplicidade conceitual entre regras no banco, regras nas entidades e regras nos services.

## Direcao recomendada

Antes de uma refatoracao grande do repositorio:

1. Manter novas alteracoes de schema sempre via Flyway.
2. Evitar depender de `ddl-auto=update` para criar ou corrigir colunas.
3. Padronizar nomes de tabelas e constraints em novas migrations.
4. Criar migrations corretivas antes de trocar Hibernate para `validate`.
5. Adicionar constraints de unicidade para dados que o codigo ja trata como unicos.
6. Revisar a modelagem de confirmacao para dependentes.
7. Documentar qualquer alteracao de relacionamento antes de alterar entidades JPA.

## Regras para proximas alteracoes

- Nao alterar banco manualmente como solucao final.
- Nao editar migrations antigas ja aplicadas em ambientes compartilhados.
- Criar nova migration para qualquer mudanca de schema.
- Conferir entidades JPA e repositories ao alterar tabelas.
- Conferir frontend e backend antes de renomear tabelas ou campos.
- Evitar introduzir nomes de tabela com maiusculas em novas migrations.
