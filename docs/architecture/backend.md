# Arquitetura Backend

Este arquivo documenta a arquitetura backend atual do projeto.

O objetivo aqui nao e descrever a arquitetura ideal, mas registrar como o sistema esta organizado hoje para orientar refatoracoes futuras.

## Stack encontrada

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

## Localizacao

O backend fica misturado na raiz do repositorio:

```text
.
|-- pom.xml
|-- mvnw / mvnw.cmd
|-- Dockerfile
|-- docker-compose.yml
|-- src/main/java/com/medtrack/medtrack/
|-- src/main/resources/
`-- interface-react/
```

Nao existe uma pasta `backend/` isolada.

O diretorio `src/` tambem abriga artefatos de frontend React antigo na raiz do projeto, o que cria ambiguidade entre backend Spring e frontend legado.

## Estrutura de pacotes atual

```text
src/main/java/com/medtrack/medtrack/
|-- MedtrackApplication.java
|-- config/
|   |-- SecurityConfig.java
|   |-- WebConfig.java
|   `-- exception/
|-- controller/
|   `-- mobile/
|-- docs/
|   `-- insomnia/
|-- model/
|   |-- confirmacao/
|   |-- dependente/
|   |-- medicamento/
|   `-- usuario/
|-- repository/
|-- security/
`-- service/
    |-- api/
    |-- conversor/
    |-- jwt/
    |-- medicamento/
    `-- usuario/
```

## Camadas existentes

### `controller`

Contem os endpoints HTTP principais:

- `AuthController`
- `UsuarioController`
- `DependenteController`
- `MedicamentoController`
- `ConfirmacaoController`

Tambem existe o subpacote `controller/mobile`, com endpoints separados para uso mobile:

- `AuthMobileController`
- `UsuarioMobileController`
- `MedicamentoMobileController`

Os controllers nao estao totalmente finos. Alguns acessam repositories diretamente, fazem leitura manual de token, controlam transacao e executam partes de regra de negocio.

Exemplos de responsabilidades misturadas:

- `UsuarioController` usa `UsuarioRepository` diretamente para listar, detalhar e deletar usuarios.
- `MedicamentoController` usa `MedicamentoRepository` diretamente para buscas e alteracoes pontuais de estoque.
- `DependenteController` extrai usuario do JWT e consulta `UsuarioRepository` antes de chamar service.
- Ha `@Transactional` em controllers.

### `service`

Contem parte das regras de negocio e orquestracao:

- `UsuarioService`
- `DependenteService`
- `MedicamentoService`
- `ConfirmacaoService`
- `UsuarioDetailsService`
- `JwtService`
- `ConsumirApi`
- conversores de dados

A camada existe, mas ainda divide responsabilidades com controllers e entidades.

### `repository`

Contem interfaces Spring Data JPA para acesso ao banco:

- `UsuarioRepository`
- `DependenteRepository`
- `MedicamentoRepository`
- `FrequenciaUsoRepository`
- `ConfirmacaoRepository`

E usada tanto por services quanto diretamente por alguns controllers.

### `model`

Agrupa entidades JPA, DTOs e classes auxiliares por dominio:

```text
model/
|-- usuario/
|   `-- dto/
|-- dependente/
|   `-- dto/
|-- medicamento/
|   `-- dto/
`-- confirmacao/
    `-- dto/
```

Esse pacote concentra tanto o modelo persistente quanto os contratos de entrada e saida da API.

Nao existe uma separacao clara entre `domain`, `entity`, `dto`, `mapper` e `application`.

### `config`

Contem configuracoes de framework:

- `SecurityConfig`: configura Spring Security, CORS, rotas publicas e filtro JWT.
- `WebConfig`: configura CORS.
- `config/exception`: tratamento global de erros.

### `security`

Contem `JwtAuthenticationFilter`, filtro executado uma vez por requisicao para ler o header `Authorization`, validar o JWT e popular o `SecurityContext`.

## Autenticacao e autorizacao

O backend usa JWT stateless.

Fluxo principal:

1. `POST /auth/login` recebe usuario e senha.
2. `AuthenticationManager` valida credenciais de usuario.
3. `JwtService` gera token com claims como `categoria`, `nome`, `email` e `id`.
4. `JwtAuthenticationFilter` valida o token em requisicoes protegidas.

Fluxo mobile:

1. `POST /auth/mobile/login` tenta autenticar primeiro em `usuarios`.
2. Se nao encontrar, tenta autenticar em `dependentes`.
3. O token de dependente possui claims diferentes do token de usuario.

Pontos de atencao:

- `JwtService` gera a chave secreta em memoria com `Keys.secretKeyFor(...)`.
- Tokens antigos deixam de ser validos ao reiniciar a aplicacao.
- A chave nao vem de variavel de ambiente.
- O filtro imprime token e dados de autenticacao no console.
- `SecurityConfig` libera `/usuarios/**`, o que inclui endpoints sensiveis de usuario.
- `PrivateRoute` no frontend esta comentado, entao a protecao real depende quase toda do backend.

## APIs principais

### Autenticacao

- `POST /auth/login`
- `POST /auth/mobile/login`

### Usuarios

- `POST /usuarios/cadastro`
- `GET /usuarios`
- `GET /usuarios/buscar/{id}`
- `PUT /usuarios/atualizar/{id}`
- `DELETE /usuarios/deletar/{id}`

### Dependentes

- `POST /dependentes/cadastrar`
- `GET /dependentes/buscar/todos`
- `GET /dependentes/administrador/{id}`
- `GET /dependentes/buscar/{id}`
- `PUT /dependentes/atualizar/{id}`
- `DELETE /dependentes/deletar/{id}`

### Medicamentos

- `POST /medicamentos/cadastro`
- `GET /medicamentos/todos/{usuarioId}`
- `GET /medicamentos/todos/dependente/{dependenteId}`
- `GET /medicamentos/buscar/{id}`
- `GET /medicamentos/estoque-critico/{usuarioId}`
- `GET /medicamentos/dashboard/resumo/{usuarioId}`
- `PATCH /medicamentos/{id}/consumir`
- `PATCH /medicamentos/{id}/repor`
- `PUT /medicamentos/alterar/{id}`
- `DELETE /medicamentos/deletar/{id}`

### Confirmacao

- `POST /api/confirmacao`
- `GET /api/confirmacao/usuario/{usuarioId}`

## Recursos estaticos legados

O backend ainda contem paginas HTML, CSS e imagens em:

```text
src/main/resources/static/
|-- css/
|-- images/
`-- templates/
```

Isso indica uma interface web antiga servida junto com o Spring.

Esse conteudo convive com o frontend React em `interface-react/` e com outro React antigo na raiz, aumentando o acoplamento do repositorio.

## Configuracao

Arquivo principal:

```text
src/main/resources/application.properties
```

Configuracoes encontradas:

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `allowed.origin`
- `frontend.url`
- `app.url`
- `spring.jpa.hibernate.ddl-auto=update`
- `spring.flyway.enabled=true`
- `server.port=${PORT:8081}`

Ponto de atencao:

- Flyway esta habilitado, mas `ddl-auto=update` tambem esta ativo. Isso reduz a confiabilidade das migrations como fonte unica de verdade do schema.

## Docker

O `docker-compose.yml` define:

- `db`: PostgreSQL 15 Alpine
- `backend`: build na raiz do projeto
- `frontend`: build em `./interface-react`

O backend recebe variaveis de ambiente do compose e depende do banco saudavel.

## Estado arquitetural atual

O backend segue parcialmente uma arquitetura em camadas:

```text
Controller -> Service -> Repository -> Banco
```

Na pratica, a separacao esta incompleta:

- Controllers acessam repositories diretamente.
- Controllers contem logica de autorizacao e extracao de JWT.
- DTOs ficam dentro de `model`.
- Entidades JPA podem ser retornadas diretamente em algumas respostas.
- Transacoes aparecem em controllers.
- Configuracoes de seguranca misturam rotas publicas amplas com protecao por role.
- Ha frontend estatico legado dentro de `src/main/resources/static`.
- Ha documentacao Insomnia dentro de `src/main/java`.

## Direcao recomendada

Para reorganizar sem reescrever tudo de uma vez:

1. Criar uma fronteira clara entre backend e frontend.
2. Remover codigo React antigo da raiz quando o frontend oficial for confirmado como `interface-react`.
3. Mover regras de negocio e transacoes para services.
4. Impedir acesso direto a repositories a partir de controllers.
5. Separar entidades JPA de DTOs de API.
6. Padronizar respostas para nunca expor entidade JPA diretamente.
7. Externalizar a chave JWT para variavel de ambiente.
8. Remover logs de token e senha.
9. Revisar rotas publicas em `SecurityConfig`.
10. Definir Flyway como fonte unica de evolucao do schema e desativar `ddl-auto=update` quando as migrations estiverem confiaveis.

## Regras para proximas alteracoes

- Nao adicionar novas regras de negocio em controllers.
- Nao adicionar novos acessos diretos a repository em controllers.
- Nao retornar entidades JPA em novos endpoints.
- Nao criar novas telas HTML em `src/main/resources/static`.
- Nao criar novos pacotes de frontend dentro de `src/` da raiz.
- Toda nova mudanca de banco deve passar por migration Flyway.
- Toda alteracao de autenticacao deve considerar impacto em web e mobile.
