# CONTEXT.md - Contexto Geral do Projeto

Este arquivo resume o estado atual do projeto para agentes de IA e desenvolvedores.

Ele deve orientar as proximas tarefas antes de qualquer refatoracao estrutural grande do repositorio.

## Visao geral

MedTrack e uma aplicacao fullstack para acompanhamento de medicacoes.

O sistema cobre:

- cadastro e login de usuarios
- cadastro de dependentes
- cadastro de medicamentos
- frequencia de uso
- controle de estoque
- confirmacao de medicacao tomada
- dashboard pessoal
- dashboard administrativo
- telas web em React
- endpoints separados para fluxo mobile

## Estado atual do repositorio

O projeto e um monorepo antigo e desorganizado.

Backend, frontend e artefatos legados convivem na mesma raiz:

```text
.
|-- pom.xml
|-- src/main/java/
|-- src/main/resources/
|-- interface-react/
|-- package.json
|-- public/
|-- src/
`-- docs/
```

O backend Spring fica em `src/main`.

O frontend React que deve ser considerado principal fica em `interface-react`.

Tambem existem:

- um React antigo na raiz do projeto
- paginas HTML/CSS antigas em `src/main/resources/static`

Esses artefatos devem ser tratados como legado ate haver tarefa explicita de remocao ou migracao.

## Stack real encontrada

### Backend

- Java 21
- Spring Boot 3.4.1
- Maven
- Spring Web
- Spring Security
- Spring Data JPA
- Spring Validation
- Lombok
- PostgreSQL
- Flyway
- JWT com `jjwt` e `java-jwt`
- Dotenv Java

### Frontend principal

- React 19
- Create React App / `react-scripts`
- JavaScript
- React Router DOM 7
- TailwindCSS 3
- Fetch API
- Chart.js
- Framer Motion
- JWT Decode
- Lucide React
- React Icons
- PapaParse

### Banco de dados

- PostgreSQL
- Flyway em `src/main/resources/db/migration`
- Hibernate com `ddl-auto=update`

## Documentos importantes

- `docs/architecture/backend.md`: arquitetura backend atual
- `docs/architecture/frontend.md`: arquitetura frontend atual
- `docs/architecture/database.md`: arquitetura de banco atual
- `docs/AGENTS.md`: regras gerais para agentes

## Arquitetura atual em resumo

### Backend

O backend segue parcialmente uma arquitetura em camadas:

```text
Controller -> Service -> Repository -> Banco
```

Na pratica, ainda ha mistura de responsabilidades:

- controllers acessam repositories diretamente
- controllers fazem leitura manual de JWT
- alguns controllers controlam transacoes
- algumas respostas expoem entidades JPA
- DTOs ficam dentro de `model`
- seguranca mistura rotas publicas amplas com rotas protegidas
- documentacao Insomnia fica dentro de `src/main/java`

### Frontend

O frontend principal em `interface-react` segue uma separacao inicial:

```text
Pages -> Componentes -> Service -> Backend
```

Na pratica:

- telas e componentes montam endpoints diretamente
- componentes misturam apresentacao, estado e chamada de API
- `PrivateRoute` existe, mas esta comentado
- token fica em `localStorage`
- nao ha refresh token
- nao ha cliente HTTP centralizado com tratamento global de erros

### Banco

O banco tem as entidades principais:

- `usuarios`
- `dependentes`
- `medicamentos`
- `frequencia_uso`
- `frequencia_uso_horarios_especificos`
- `Confirmacao`
- `Estoque`

Pontos criticos:

- Flyway e Hibernate `ddl-auto=update` estao ativos ao mesmo tempo.
- nomes de tabelas alternam entre minusculo e inicial maiuscula.
- algumas constraints esperadas pelo codigo ainda nao existem no banco.

## Autenticacao atual

O sistema usa JWT stateless.

Fluxo web:

1. `POST /auth/login`
2. backend valida usuario e senha
3. backend retorna JWT
4. frontend salva token em `localStorage`
5. frontend envia `Authorization: Bearer <token>`

Fluxo mobile:

1. `POST /auth/mobile/login`
2. backend tenta autenticar usuario
3. se nao encontrar, tenta autenticar dependente
4. backend gera token com claims diferentes conforme o tipo

Pontos de atencao:

- a chave JWT e gerada em memoria a cada boot
- tokens deixam de ser validos apos reiniciar a aplicacao
- ha logs sensiveis relacionados a token e senha
- rotas privadas no frontend nao estao efetivamente protegidas

## Principio para proximas tarefas

Antes de refatorar a estrutura do repositorio, as proximas tarefas devem estabilizar o comportamento existente.

Prioridade:

1. Corrigir riscos claros de seguranca sem alterar arquitetura em massa.
2. Melhorar a confiabilidade das rotas existentes.
3. Reduzir acoplamento apenas quando necessario para a tarefa.
4. Documentar mudancas arquiteturais relevantes.
5. Evitar migracoes grandes de pasta, stack ou framework sem tarefa explicita.

## Regras de trabalho antes da refatoracao

- Tratar `interface-react` como frontend oficial.
- Nao adicionar novas telas no React antigo da raiz.
- Nao adicionar novas telas HTML em `src/main/resources/static`.
- Tratar o backend como localizado em `src/main`.
- Nao mover pacotes Java sem tarefa explicita de refatoracao.
- Nao trocar Create React App por Vite sem tarefa explicita.
- Nao alterar migrations antigas ja aplicadas.
- Criar nova migration Flyway para qualquer alteracao de schema.

## Tarefas recomendadas antes da refatoracao estrutural

Estas tarefas ajudam a preparar o projeto para uma refatoracao futura com menor risco:

1. Externalizar a chave JWT para variavel de ambiente.
2. Remover logs de senha, token e dados sensiveis.
3. Revisar rotas publicas em `SecurityConfig`.
4. Reativar protecao de rotas privadas no frontend.
5. Centralizar tratamento de expiracao de token no frontend.
6. Padronizar chamadas HTTP em `interface-react/src/Service`.
7. Criar migrations para constraints que o codigo ja assume, como unicidade de `nome_usuario`.
8. Preparar o banco para substituir `ddl-auto=update` por `validate`.
9. Evitar retorno de entidades JPA em novos endpoints.
10. Mover regras novas para services, nao para controllers.

## Decisoes atuais

- O projeto deve ser tratado como legado em estabilizacao.
- A prioridade imediata e preservar comportamento e documentar a realidade.
- Refatoracoes devem ser incrementais e justificadas.
- Mudancas de seguranca devem ser pequenas, testaveis e compativeis com web e mobile.
- A documentacao em `docs/architecture` e a referencia para proximos agentes.
