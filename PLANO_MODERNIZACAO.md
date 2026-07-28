# Plano de Modernização do MedTrack Web

> Plano de execução para 2 semanas (10 dias úteis)  
> Data do diagnóstico: 28/07/2026  
> Escopo: monorepo web (`Spring Boot + React`) e API consumida também pelo aplicativo Android  
> Regra deste documento: planejar primeiro; nenhuma mudança funcional deve ser feita antes da aprovação dos PRs descritos aqui.

## 1. Resumo executivo

O repositório contém um backend Spring Boot 3.4.1/Java 21 na raiz, o frontend React atualmente usado em `interface-react/`, dois vestígios de frontends anteriores e arquivos operacionais misturados. O backend já possui uma suíte unitária relevante (21 arquivos de teste e JaCoCo configurado), porém o frontend não possui nenhum teste real. Não existem workflows GitHub Actions, documentação de contribuição/segurança, ADRs, templates de PR ou controles automáticos de qualidade.

Os riscos que devem bloquear uma publicação são:

1. **Autorização excessivamente permissiva:** `SecurityConfig.java` libera todo `/usuarios/**` com `permitAll`, o que inclui listagem, busca, atualização e exclusão. Além disso, diversas rotas autenticadas aceitam IDs na URL sem evidência de verificação consistente de ownership, criando risco de IDOR/BOLA.
2. **Chave JWT efêmera:** `JwtService.java` cria `SECRET_KEY` aleatoriamente no startup. Todo restart invalida tokens e múltiplas instâncias não conseguem validar tokens entre si.
3. **Cadeia CRA vulnerável e obsoleta:** auditorias dos lockfiles encontraram 58 vulnerabilidades no manifesto órfão da raiz e 62 no frontend atual. A maioria vem de `react-scripts@5.0.1`; há vulnerabilidades críticas e altas transitivas.
4. **Imagem frontend inadequada para produção:** usa `npm install`, Node 18 e `npm start` (servidor de desenvolvimento), roda como root e não possui estágio de runtime, healthcheck ou servidor web estático.
5. **Ausência de CI/CD:** não há `.github/workflows/`; a branch protegida depende de verificações que hoje não existem.
6. **Possível exposição de dados no navegador:** foram encontradas 54 chamadas `console.log/error/warn`, inclusive logs de formulário, respostas de usuário e conteúdo decodificado de JWT.

### Resultado esperado ao fim das duas semanas

- Estrutura clara em `apps/backend` e `apps/frontend`.
- Um único frontend ativo, em React + TypeScript + Vite.
- Backend com baseline de segurança leve, endpoint `/healthz`, autorização revisada e logs úteis sem dados sensíveis.
- Builds reprodutíveis com npm workspaces e Maven Wrapper.
- Testes unitários backend/frontend, cobertura publicada e limites iniciais graduais.
- Dockerfiles multi-stage, runtime não-root e Compose com healthchecks.
- CI de PR, segurança recorrente e release por tags `v*.*.*`.
- Governança mínima: ADRs, README, CONTRIBUTING, SECURITY, CODEOWNERS e template de PR.

## 2. Método e limites da auditoria

Foram inspecionados:

- todos os arquivos versionados da raiz e das principais subárvores;
- manifests e lockfiles npm, `pom.xml`, Maven Wrapper e perfis Spring;
- configurações de autenticação, CORS, upload, variáveis de ambiente e rotas;
- código e imports do frontend, referências a API/token e logs;
- Dockerfiles, Compose base/override, documentação e histórico Git;
- presença e quantidade de testes;
- histórico dos caminhos de frontend para distinguir versão ativa e legado.

Também foram executados dois `npm audit --package-lock-only` em Node 22 isolado:

| Escopo | Total | Críticas | Altas | Moderadas | Baixas |
|---|---:|---:|---:|---:|---:|
| lockfile órfão da raiz | 58 | 3 | 27 | 15 | 13 |
| `interface-react/package-lock.json` | 62 | 3 | 31 | 15 | 13 |

Exemplos identificados na cadeia transitiva incluem `form-data`, `shell-quote`, `websocket-driver`, `serialize-javascript`, `svgo`, `webpack-dev-server` e `ws`. Os números são um retrato de 28/07/2026 e devem ser salvos novamente como artefato no primeiro PR; advisories mudam ao longo do tempo.

A suíte Maven não pôde ser executada neste ambiente: existe apenas JRE 25, sem `javac`, e o projeto exige Java 21. Portanto, a existência de 21 classes de teste não deve ser confundida com uma suíte comprovadamente verde. A primeira etapa da execução exige obter esse baseline em JDK 21.

## 3. Inventário atual e classificação

### 3.1 Raiz

| Caminho | Classificação atual | Destino proposto |
|---|---|---|
| `src/main/java/` | backend Spring (67 arquivos Java) | `apps/backend/src/main/java/` |
| `src/main/resources/` | configuração, Flyway e frontend estático antigo | configuração/Flyway para `apps/backend`; legado removido após validação |
| `src/test/java/` | testes backend (21 arquivos) | `apps/backend/src/test/java/` |
| `pom.xml`, `.mvn/`, `mvnw*` | build do backend | `apps/backend/` (manter wrapper utilizável por scripts raiz) |
| `Dockerfile` | build/runtime do backend | `apps/backend/Dockerfile` |
| `package.json`, `package-lock.json`, `public/` | CRA incompleto/órfão | substituir pelo workspace raiz e remover `public/` após confirmação |
| `interface-react/` | frontend React atual | mover para `apps/frontend/` |
| `docker-compose*.yml` | orquestração do monorepo | manter na raiz, atualizando contextos |
| `.env.example` | contrato de configuração incompleto | manter na raiz, documentar e separar variáveis por serviço |
| `docs/` | imagens/documentação | manter; otimizar arquivos grandes e criar ADRs |
| `.idea/` | metadados locais presentes no disco | garantir não versionamento; não mover |

### 3.2 Identificação exata dos frontends

#### Frontend atual

**Caminho: `interface-react/`**

Evidências:

- possui 44 arquivos `.js/.jsx`, componentes, páginas, serviços e rotas;
- é referenciado pelo `README.md`;
- é o contexto de build do serviço `frontend` no `docker-compose.yml`;
- tem histórico recente de implementação e correções;
- consome a API por `REACT_APP_BACKEND_URL`.

#### Frontend legado confirmado

**Caminho: `src/main/resources/static/`**

Contém 16 arquivos de uma interface HTML/CSS anterior:

- `src/main/resources/static/templates/*.html`;
- `src/main/resources/static/css/*.css`;
- `src/main/resources/static/images/logo_site_verde_musgo.jpg`.

O histórico mostra que esses arquivos antecedem a “nova interface” React. Não há controller MVC encontrado que encaminhe para esses templates; como ficam sob `static/templates`, seriam apenas arquivos estáticos, não templates renderizados pelo Spring. A recomendação é arquivar em uma tag Git e removê-los do branch principal após smoke test das URLs.

#### Vestígio CRA órfão adicional

**Caminhos: `package.json`, `package-lock.json` e `public/` na raiz**

O manifesto declara CRA/React, mas não existe `src/` React na raiz (o `src/` existente é Java). Assim, o build raiz `react-scripts build` não representa uma aplicação completa. Este conjunto deve ser removido/substituído pelo workspace raiz. O Git preserva seu histórico; não é necessário manter uma cópia permanente em `archive/`.

### 3.3 Outros achados de organização

- O README aponta para `src/README.md`, que não existe.
- Há quatro coleções Insomnia dentro do pacote Java (`src/main/java/.../docs/insomnia`), misturando documentação e código compilável.
- `docs/_assets/web-dashboard-preview.gif` tem aproximadamente 23 MB e o CSV público tem aproximadamente 6,3 MB; avaliar Git LFS, compressão ou download em build.
- O `.env.example` usa `REACT_APP_FRONTEND_URL`, mas o backend espera `FRONTEND_URL` e `APP_URL`; o Compose não injeta essas duas no backend.
- O root `.gitignore` contém padrão Windows (`src\main...`) inefetivo em Git e entradas duplicadas.
- Há dependências redundantes de JWT (`java-jwt` e `jjwt-*`), mas o código encontrado usa JJWT.
- Algumas versões gerenciadas pelo BOM Spring estão fixadas manualmente, aumentando o risco de combinações incompatíveis.

## 4. Arquitetura-alvo do monorepo

```text
medTrack-web/
├── .github/
│   ├── workflows/
│   │   ├── pr-validation.yml
│   │   ├── security.yml
│   │   └── release.yml
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   └── pull_request_template.md
├── apps/
│   ├── backend/
│   │   ├── .mvn/
│   │   ├── src/main/
│   │   ├── src/test/
│   │   ├── Dockerfile
│   │   ├── mvnw
│   │   ├── mvnw.cmd
│   │   └── pom.xml
│   └── frontend/
│       ├── public/
│       ├── src/
│       ├── Dockerfile
│       ├── nginx.conf
│       ├── package.json
│       ├── tsconfig*.json
│       └── vite.config.ts
├── docs/
│   ├── adr/
│   ├── api/
│   ├── insomnia/
│   └── _assets/
├── scripts/
│   ├── check.sh
│   └── smoke.sh
├── .editorconfig
├── .env.example
├── .nvmrc
├── CONTRIBUTING.md
├── SECURITY.md
├── README.md
├── docker-compose.yml
├── docker-compose.override.yml
├── package.json
└── package-lock.json
```

### 4.1 Decisão de workspace

Adotar **npm workspaces**, não Yarn Plug'n'Play, neste ciclo.

Motivos:

- já existem lockfiles npm e os comandos/documentação usam npm;
- há apenas um workspace Node ativo; o backend continua sob Maven;
- PnP tende a aumentar o risco de incompatibilidade com ferramentas legadas durante a migração de CRA;
- um único `package-lock.json` na raiz simplifica cache, auditoria e Dependabot.

Configuração planejada:

```json
{
  "name": "medtrack-monorepo",
  "private": true,
  "engines": { "node": ">=22 <23" },
  "workspaces": ["apps/frontend"],
  "scripts": {
    "dev:frontend": "npm run dev --workspace @medtrack/frontend",
    "build:frontend": "npm run build --workspace @medtrack/frontend",
    "test:frontend": "npm run test --workspace @medtrack/frontend",
    "lint:frontend": "npm run lint --workspace @medtrack/frontend"
  }
}
```

Usar Node 22 LTS, `npm ci` em CI/Docker e Maven Wrapper com JDK 21. Não misturar Yarn/npm nem manter dois lockfiles.

## 5. Princípios de execução

1. Fazer movimentos de arquivo em PR próprio, usando `git mv`, sem refatoração funcional simultânea.
2. Capturar baseline antes de aumentar rigor: builds, testes, cobertura, audit e smoke tests.
3. Proteger compatibilidade da API Android. Não renomear/remover endpoints mobile sem contrato e teste.
4. Corrigir primeiro exposições de dados/autorização; melhorias cosméticas vêm depois.
5. Introduzir TypeScript incrementalmente, com commits pequenos e build verde a cada lote.
6. Evitar `npm audit fix --force`; atualizar/remover a dependência raiz (CRA) e validar comportamento.
7. Usar gates graduais de cobertura para não transformar a modernização em uma reescrita.

## 6. Fase 0 — Baseline e contenção (Dia 1)

### Passos

1. Criar issue/épico “Modernização MedTrack — 2 semanas” e registrar estes critérios de aceite.
2. Criar tag anotada de segurança, por exemplo `pre-modernization-2026-07-28`, no último commit conhecido.
3. Em ambiente JDK 21/Node 22:
   - executar `./mvnw test` e guardar Surefire + JaCoCo;
   - executar `npm ci` e `npm test -- --watchAll=false` em `interface-react`;
   - executar `npm audit --package-lock-only` nos dois lockfiles;
   - executar `docker compose config` e `docker compose up --build`;
   - fazer smoke test de login, dashboard pessoal/admin, dependentes, medicamentos, confirmação e três fluxos do app Android.
4. Congelar mudanças grandes não relacionadas durante os 10 dias.
5. Criar uma matriz simples endpoint × consumidor (`web`, `Android`) a partir das coleções Insomnia.
6. Registrar screenshots/requests de referência sem tokens, senhas ou dados pessoais.

### Critérios de aceite

- Baseline anexado ao PR/issue, inclusive falhas existentes.
- Lista de endpoints mobile que não podem sofrer quebra.
- Dono definido para backend, frontend, DevOps e revisão de segurança.

## 7. Fase 1 — Estrutura do monorepo e remoção segura do legado (Dias 1–2)

### Passos

1. Criar `apps/backend` e mover com `git mv`:
   - `src/`, `pom.xml`, `.mvn/`, `mvnw`, `mvnw.cmd`, `Dockerfile`.
2. Mover `interface-react/` para `apps/frontend/`.
3. Mover coleções Insomnia para `docs/insomnia/`.
4. Criar o `package.json` raiz de npm workspaces e consolidar o lockfile com Node 22.
5. Remover o manifesto/lockfile CRA órfão da raiz e o `public/` raiz.
6. Antes de remover `src/main/resources/static/`:
   - procurar referências em Java, README, testes e configurações;
   - acessar cada URL antiga com o backend atual;
   - confirmar com o time que nenhum deploy externo depende delas.
7. Com essas três verificações verdes, remover o legado. A tag Git é o arquivo recuperável; evitar uma pasta `legacy/` que continue sendo construída ou escaneada.
8. Atualizar contextos Docker/Compose, README mínimo e `.gitignore`.
9. Adicionar `.editorconfig`, versão Node e comandos raiz.

### Critérios de aceite

- `npm ci` raiz instala somente o frontend ativo.
- `npm run build:frontend` e `apps/backend/mvnw test` funcionam nos novos caminhos.
- Compose resolve com os novos contextos.
- Nenhum arquivo de frontend permanece misturado ao backend.
- Diff de movimento é majoritariamente reconhecido pelo Git como rename.

### Rollback

Reverter apenas este PR ou recuperar qualquer arquivo pela tag pré-modernização. Não apagar a tag até o final do semestre.

## 8. Fase 2 — Backend, dependências e segurança leve (Dias 2–4)

### 8.1 Dependências Maven

1. Gerar `dependency:tree` e relatório de versões.
2. Rodar Dependabot e uma ferramenta de vulnerabilidades Java (preferência: OWASP Dependency-Check ou Trivy filesystem).
3. Remover `com.auth0:java-jwt` se confirmado sem uso e manter apenas uma biblioteca JWT.
4. Deixar o Spring Boot BOM gerenciar `spring-boot-starter-data-jpa`, Jackson e PostgreSQL quando possível.
5. Atualizar Spring Boot dentro de uma linha estável suportada, em PR isolado e com testes.
6. Atualizar JJWT da linha 0.11.5 para uma versão suportada, adaptando a API de parsing/assinatura.
7. Manter Flyway e driver PostgreSQL compatíveis com o BOM e PostgreSQL 15.
8. Não usar atualização automática irrestrita em release; revisar changelogs e CVEs.

### 8.2 Autenticação e autorização

1. Substituir a chave aleatória por `JWT_SECRET` obrigatório fora de dev:
   - mínimo de 256 bits aleatórios;
   - sem valor real no `.env.example`;
   - falhar rapidamente em `prod` se ausente;
   - permitir segredo de desenvolvimento explícito somente no profile `dev`.
2. Parametrizar expiração (`JWT_EXPIRATION`) com default documentado.
3. Reduzir rotas públicas a login, cadastro estritamente necessário e healthcheck.
4. Remover o matcher amplo `.requestMatchers("/usuarios/**").permitAll()`.
5. Especificar autorização por método/rota e complementar com `@PreAuthorize` nos casos de negócio.
6. Em todas as rotas com `{usuarioId}`, `{dependenteId}` ou `{medicamentoId}`, comparar o recurso com o principal autenticado ou exigir role admin.
7. Retornar 401 para token ausente/inválido e 403 para principal autenticado sem permissão; não silenciar erros de token de forma ambígua.
8. Criar testes negativos para:
   - anônimo em listar/alterar/excluir usuário;
   - usuário A acessando recurso de usuário B;
   - usuário pessoal acessando rota admin;
   - dependente acessando recurso fora do vínculo;
   - JWT inválido, expirado e assinado por chave diferente.
9. Manter access token simples, sem Redis e sem refresh token neste ciclo, conforme restrição de escopo.

### 8.3 CORS, headers e limites

1. Centralizar CORS em um único `CorsConfigurationSource`; evitar regras paralelas entre MVC e Security.
2. Ler uma lista explícita `ALLOWED_ORIGINS`, sem liberar `*` com credenciais.
3. Não incluir `localhost:3001/3002` em produção.
4. Restringir métodos e headers ao necessário, mantendo `OPTIONS`.
5. Configurar headers do Spring Security:
   - HSTS somente atrás de HTTPS;
   - `X-Content-Type-Options: nosniff`;
   - `Referrer-Policy`;
   - `Content-Security-Policy`/`frame-ancestors` compatível com o frontend;
   - política de cache `no-store` nas respostas de autenticação.
6. Preservar CSRF desabilitado apenas porque a API usa Bearer token e é stateless; documentar isso em ADR.
7. Definir limites JSON/form em configuração, além dos limites multipart atuais.
8. Reduzir o default de upload de 20/25 MB se o uso real permitir.
9. Validar imagem por conteúdo/magic bytes e extensão, não apenas `Content-Type`; gerar nome no servidor.
10. Nunca retornar stack trace ou detalhe interno em produção; o projeto já usa `server.error.include-stacktrace=never`, que deve ser preservado.

### 8.4 Segredos e configuração

1. Criar `.env.example` sem credenciais válidas, agrupado por serviço.
2. Alinhar nomes: `ALLOWED_ORIGINS`, `FRONTEND_URL`, `APP_URL`, `VITE_API_URL`, DB, Cloudinary e JWT.
3. Validar propriedades obrigatórias com `@ConfigurationProperties` + Bean Validation.
4. Garantir que `.env`, certificados, chaves e dumps estejam ignorados.
5. Rodar Gitleaks no histórico; se houver segredo real, revogar/rotacionar antes de apenas removê-lo do Git.
6. Usar GitHub Environments/Secrets no release; nunca passar segredos como build args.

### 8.5 Logging e tratamento de erros

1. Usar SLF4J/Logback já integrado ao Spring, preferencialmente logs chave-valor.
2. Criar correlation/request ID (filtro simples) e propagá-lo no header/resposta.
3. Logar evento, status, duração, rota normalizada e request ID.
4. Nunca logar JWT, `Authorization`, senha, formulário completo, PII, chave Cloudinary ou conexão de banco.
5. Padronizar erros em Problem Details (RFC 9457), incluindo código estável, mensagem segura, campos inválidos e request ID.
6. Configurar níveis por profile (`DEBUG` local; `INFO/WARN` produção), sem adicionar infraestrutura externa.

### Critérios de aceite da fase

- Nenhuma rota de leitura/alteração/exclusão de usuário está pública.
- Testes de autorização positivos e negativos passam.
- Chave JWT é externa, estável entre restarts e obrigatória em produção.
- CORS possui uma única fonte e teste automatizado.
- Scanner não reporta vulnerabilidade crítica/alta explorável em runtime sem exceção documentada e prazo.

## 9. Fase 3 — Frontend: CRA para Vite e JavaScript para TypeScript (Dias 4–7)

### 9.1 Estado atual

- CRA com `react-scripts@5.0.1`.
- React/React DOM 19 e React Router 7 sobre uma toolchain CRA antiga.
- 44 arquivos JavaScript/JSX e zero arquivos `*.test.*`/`*.spec.*`.
- `setupTests.js` referencia Testing Library, mas os pacotes não são dependências diretas declaradas.
- Configuração de ambiente usa prefixo `REACT_APP_*`.
- Token é mantido em `localStorage`.
- Há 54 chamadas de console; algumas exibem formulários, respostas e claims de JWT.
- `axios` está declarado, mas o código auditado usa majoritariamente `fetch`; confirmar uso e remover dependência não usada.
- `App.js` cria seu próprio `BrowserRouter`, enquanto `index.js` importa `BrowserRouter` sem usá-lo.

### 9.2 Sequência de migração sem quebra

#### Etapa A — estabilizar antes de tipar

1. Capturar smoke tests e rotas atuais.
2. Fixar Node 22 e limpar dependências não usadas.
3. Trocar CRA por Vite em commit próprio:
   - criar `index.html` na raiz do workspace;
   - criar `vite.config.ts`;
   - trocar scripts por `vite`, `vite build`, `vite preview`;
   - migrar `REACT_APP_*` para `VITE_*` e `process.env` para `import.meta.env`;
   - manter o código `.js/.jsx` inicialmente;
   - configurar proxy local opcional para `/api`;
   - validar SPA fallback e todas as rotas no servidor de produção.
4. Remover `react-scripts`, `cra-template` e `reportWebVitals` se não houver coleta real.
5. Reexecutar `npm audit`; triage separado para dependências de runtime e desenvolvimento.

#### Etapa B — fundação TypeScript permissiva

1. Instalar `typescript`, tipos React/DOM/Node e plugins ESLint TypeScript.
2. Criar `tsconfig.json` inicialmente incremental:
   - `allowJs: true`;
   - `checkJs: false`;
   - `noEmit: true`;
   - `isolatedModules: true`;
   - `strict: true` para novos `.ts/.tsx`;
   - alias `@/` somente se reduzir imports sem dificultar testes.
3. Criar `src/vite-env.d.ts` tipando `VITE_API_URL`.
4. Fazer o CI executar `tsc --noEmit`.

#### Etapa C — migrar por dependência, não por pasta aleatória

Ordem recomendada:

1. `Service/api.js`, `auth.js`, `cadastrarUsuario.js`: definir cliente HTTP, `ApiError`, DTOs e respostas.
2. `Componentes/Auth/*`: tipos de claims/roles e guardas de rota.
3. Componentes folha reutilizáveis (`Botao`, `CampoTexto`, `Loading`, `PopUp`, cards).
4. Componentes compostos/listas/gráficos.
5. Páginas de login/cadastro.
6. Dashboards, medicamentos, dependentes, configurações e relatórios.
7. `App` e entrypoint por último.

Para cada lote:

- renomear `.js` → `.ts` e `.jsx` → `.tsx`;
- tipar props, estado, eventos e retornos de API;
- proibir `any` novo; usar `unknown` e narrowing para payload externo;
- validar dados não confiáveis em fronteiras críticas (login/perfil/medicamentos);
- executar lint, typecheck, testes e build;
- não combinar redesign visual com migração de tipos.

#### Etapa D — endurecer

1. Quando não restar JS, definir `allowJs: false`.
2. Habilitar regras como promises não tratadas, imports consistentes e hooks.
3. Remover casts temporários e comentários `@ts-ignore`; todo bypass deve ter issue/prazo.
4. Substituir logs:
   - apagar logs de depuração/dados;
   - erros esperados viram feedback de UI;
   - erros inesperados passam por uma interface mínima de logger, desabilitada ou sanitizada em produção.
5. Centralizar o acesso ao token. Para estas duas semanas, manter Bearer sem refresh token; registrar o risco de XSS de `localStorage` e priorizar CSP/sanitização. Uma futura mudança para cookie HttpOnly exige coordenação com Android e fica fora do escopo.

### 9.3 Testes frontend após estabilização TypeScript

Com Vite, usar **Vitest + React Testing Library + `@testing-library/jest-dom` + user-event**, mantendo API/estilo compatíveis com Jest. Se a exigência acadêmica for nominalmente Jest, documentar a equivalência em ADR ou configurar Jest + ts-jest; não manter dois runners.

Ordem de cobertura:

1. funções puras de validação/formatação e parser de erro;
2. cliente API: headers, URL, 401/403, erro de rede e JSON inválido;
3. autenticação e `PrivateRoute`;
4. login/cadastro com sucesso, validação e erro;
5. dashboards por role;
6. cadastro/edição/exclusão de medicamento e dependente;
7. relatórios e confirmação.

Usar MSW para mockar a API no nível HTTP, evitando mocks frágeis de `fetch`. Meta inicial realista:

- 60% de linhas/branches nas unidades tocadas;
- 70% global de linhas e 60% de branches ao fim da segunda semana, se o baseline permitir;
- cobertura não pode cair em PRs posteriores;
- publicar `coverage/` como artefato, nunca versioná-lo.

### Critérios de aceite da fase

- Zero `react-scripts`/CRA no workspace.
- Todos os arquivos de aplicação em `.ts/.tsx`, sem `@ts-ignore` não justificado.
- Lint, typecheck, testes e build verdes.
- Smoke tests das rotas existentes passam.
- Nenhum log de token, formulário completo ou PII em produção.
- `npm audit --omit=dev` sem crítica/alta de runtime sem exceção aprovada.

## 10. Fase 4 — Testes backend e contrato mobile (Dias 5–7, em paralelo lógico)

O backend já tem uma boa base nominal: 21 arquivos de teste cobrindo controllers, services, modelos, validação e utilitários. O plano deve melhorar confiança, não reescrever tudo.

### Passos

1. Fazer a suíte atual passar em JDK 21 e registrar quantidade de testes, duração e cobertura real.
2. Revisar se controller tests verificam Spring Security de verdade ou apenas chamam métodos diretamente.
3. Adicionar `@WebMvcTest`/MockMvc para:
   - status e payload;
   - autenticação/autorização;
   - validação;
   - CORS e limite de upload.
4. Adicionar testes unitários para JWT com clock controlável e chave injetada.
5. Adicionar testes de integração de repositório/Flyway com Testcontainers PostgreSQL; limitar a poucos cenários críticos para caber no prazo.
6. Criar testes de contrato dos endpoints mobile usando payloads versionados/snapshots sem dados pessoais.
7. Configurar JaCoCo `check` no `verify`, não apenas geração de relatório.
8. Meta inicial sugerida: 75% de linhas e 65% de branches nos pacotes service/controller/security, ajustada ao baseline e elevada gradualmente.
9. Não excluir `security/**` do relatório/gate; hoje a configuração JaCoCo exclui justamente segurança, configuração e tratamento de erros, áreas críticas.

### Critérios de aceite

- `./mvnw verify` executa unitários, integração e gate de cobertura.
- Testes de autorização/ownership cobrem o risco de IDOR.
- Contratos Android críticos estão protegidos.
- Relatório XML JaCoCo é publicado no CI.

## 11. Fase 5 — Containerização e experiência local (Dias 7–8)

### 11.1 Diagnóstico atual

Backend:

- já usa dois estágios JDK/JRE;
- build pula testes;
- runtime roda como root;
- copia JAR por wildcard;
- não tem healthcheck;
- usa Alpine, que deve ser validado com bibliotecas nativas.

Frontend:

- estágio único Node 18;
- usa `npm install` em vez de `npm ci`;
- serve em produção com `react-scripts start`;
- roda como root;
- não possui `.dockerignore` robusto, healthcheck nem runtime mínimo.

Compose:

- banco já tem healthcheck;
- backend espera apenas o banco;
- frontend espera a criação do backend, não a saúde;
- não há healthcheck de backend/frontend;
- `container_name` reduz a reutilização/escala e pode ser removido;
- override monta `~/.m2`, pouco portável e incompatível com execução rootless.

### 11.2 Implementação planejada

#### Backend Dockerfile

1. Usar imagem fixada por versão/digest (Temurin 21).
2. Copiar primeiro wrapper/POM e resolver dependências para cache.
3. Executar `./mvnw verify` no CI antes do build da imagem; no Docker build usar `package` de forma explícita e justificada.
4. Gerar nome previsível de JAR.
5. Runtime JRE 21, usuário/grupo sem privilégio, filesystem read-only quando possível.
6. Definir limites JVM conscientes de container.
7. Adicionar Actuator e expor somente `health`/`info`, ou implementar controller mínimo.
8. Disponibilizar `/healthz` (liveness) e, se necessário, `/readyz` (DB/Flyway).

#### Frontend Dockerfile

1. Build com Node 22 e `npm ci`.
2. Rodar `typecheck`, testes e build fora/antes da imagem final.
3. Copiar `dist/` para Nginx/Unprivileged ou Caddy não-root.
4. Configurar fallback SPA para `index.html`.
5. Adicionar headers estáticos e cache: assets com hash imutáveis; `index.html` sem cache longo.
6. Disponibilizar `/healthz` estático e healthcheck.
7. Injetar URL pública no build apenas como configuração não secreta; alternativamente usar `/api` reverse proxy para promover a mesma imagem.

#### Compose

1. Atualizar contextos para `apps/*`.
2. Usar `depends_on: condition: service_healthy` para DB → backend → frontend.
3. Adicionar `restart` apenas onde fizer sentido e limites básicos em ambiente demonstrativo.
4. Separar:
   - `docker-compose.yml`: stack reprodutível;
   - `docker-compose.override.yml`: mounts/hot reload local;
   - opcional profile `tools` para Adminer, não obrigatório.
5. Criar volumes nomeados de caches sem apontar para home do host.
6. Validar `docker compose config`, build limpo e startup após remoção completa dos containers/volumes em ambiente descartável.

### Critérios de aceite

- Processos de backend e frontend rodam como UID não-zero.
- Nenhum dev server está na imagem final.
- Imagens possuem healthcheck e iniciam na ordem correta.
- `docker compose up --build` permite onboarding usando apenas `.env.example`.
- Smoke script confirma frontend, `/healthz`, login e acesso ao banco.

## 12. Fase 6 — CI/CD no GitHub Actions (Dias 8–9)

### 12.1 `pr-validation.yml`

Triggers: `pull_request` para `main`, `workflow_dispatch`.

Jobs, com `permissions: contents: read`:

1. **changes**: filtro de caminhos para não executar jobs irrelevantes.
2. **frontend-quality** (Node 22):
   - checkout;
   - `npm ci`;
   - `npm run lint:frontend`;
   - `npm run typecheck --workspace @medtrack/frontend`;
   - `npm run test:frontend -- --coverage --run`;
   - upload da cobertura.
3. **frontend-build**: build Vite e upload de `dist` temporário.
4. **backend-verify** (Temurin 21):
   - cache Maven;
   - `./apps/backend/mvnw --batch-mode verify`;
   - serviço PostgreSQL/Testcontainers quando necessário;
   - upload de Surefire/JaCoCo.
5. **compose-build**:
   - build dos dois Dockerfiles;
   - iniciar stack;
   - executar smoke/healthchecks;
   - coletar logs sanitizados em falha.
6. **quality-gate**: job final único, obrigatório na proteção de branch.

Boas práticas:

- `concurrency` para cancelar execução antiga do mesmo PR;
- timeouts por job;
- actions fixadas por SHA ou major aprovada;
- cache baseado em lockfiles, nunca cache de `node_modules`;
- nenhum segredo de produção disponível em PR de fork;
- mensagens e nomes dos required checks estáveis.

### 12.2 `security.yml`

Triggers: PR, push em `main`, agenda semanal e manual.

Jobs:

1. Gitleaks para segredos (histórico completo no schedule; diff no PR).
2. `npm audit --omit=dev` como gate de runtime; audit completo como relatório com política documentada.
3. OWASP Dependency-Check/Trivy para Maven e filesystem.
4. Trivy nas imagens construídas, bloqueando `CRITICAL/HIGH` com correção disponível após triage.
5. CodeQL para Java e JavaScript/TypeScript, se disponível no plano da organização.
6. SBOM CycloneDX/SPDX para backend, frontend e imagens.
7. Dependabot semanal agrupado por ecossistema (`npm`, `maven`, `github-actions`, `docker`), com limite de PRs.

Exceções devem estar em arquivo versionado com CVE/GHSA, justificativa, impacto, responsável e data de expiração. Nunca ignorar uma severidade globalmente sem triage.

### 12.3 `release.yml`

Trigger:

```yaml
on:
  push:
    tags:
      - "v*.*.*"
```

Fluxo:

1. Validar tag estritamente como SemVer e conferir que aponta para commit alcançável de `main`.
2. Executar novamente quality/security gates; não confiar apenas no CI anterior.
3. Autenticar no GHCR com `GITHUB_TOKEN`, usando `packages: write`.
4. Construir em paralelo lógico:
   - `ghcr.io/<org>/medtrack-backend`;
   - `ghcr.io/<org>/medtrack-frontend`.
5. Publicar tags imutáveis:
   - versão completa (`1.2.3`);
   - major/minor (`1.2`) se política aprovar;
   - SHA;
   - `latest` somente para release estável, nunca prerelease.
6. Usar Buildx, cache GHA e build provenance.
7. Gerar SBOM, assinar imagens com keyless Cosign/OIDC e anexar attestations.
8. Escanear as imagens pelo digest antes de concluir.
9. Criar GitHub Release com changelog gerado e links para digests/SBOM.
10. Não fazer deploy automático de produção neste ciclo sem ambiente e aprovação definidos; “publicar imagem” e “implantar” são responsabilidades separadas.

### Proteção de `main`

- PR obrigatório;
- ao menos uma aprovação (duas para segurança/release, se o tamanho do time permitir);
- dismiss stale approvals;
- conversa resolvida;
- branches atualizadas antes do merge;
- required check `quality-gate`;
- sem force push/delete;
- squash merge e Conventional Commits para changelog.

## 13. Fase 7 — Governança e documentação (Dias 9–10)

### 13.1 ADRs

Criar em `docs/adr/` usando status `Proposed`, `Accepted`, `Superseded`:

| ADR | Decisão |
|---|---|
| `0001-monorepo-layout-and-workspaces.md` | `apps/backend`, `apps/frontend`, npm workspaces e Maven |
| `0002-retire-legacy-frontends.md` | evidências, tag de recuperação e remoções |
| `0003-cra-to-vite-and-typescript.md` | Vite, estratégia incremental e limites TS |
| `0004-api-versioning-and-mobile-compatibility.md` | compatibilidade Android, depreciação e proposta `/api/v1` |
| `0005-authentication-and-authorization.md` | JWT simples, chave externa, ownership, sem refresh/Redis |
| `0006-ci-cd-and-release.md` | gates, SemVer, GHCR, SBOM e assinatura |
| `0007-testing-and-coverage.md` | pirâmide, ferramentas e thresholds graduais |
| `0008-observability-and-error-contract.md` | SLF4J, request ID e Problem Details |

Não introduzir `/api/v1` quebrando URLs atuais nas duas semanas. Primeiro documentar; depois adicionar aliases/versionamento e período de depreciação compatível com o Android.

### 13.2 Documentos

**README.md**

- visão e arquitetura atual;
- layout do monorepo;
- pré-requisitos fixados;
- quickstart local e Docker;
- comandos de lint/test/build;
- variáveis de ambiente;
- links para API, ADRs e app Android;
- troubleshooting;
- status do CI e segurança sem badges enganosos.

**CONTRIBUTING.md**

- setup, convenções e comandos;
- Conventional Commits;
- branch/PR strategy;
- Definition of Done;
- como adicionar migration Flyway sem editar migration aplicada;
- como atualizar contrato web/mobile;
- política de testes e cobertura.

**SECURITY.md**

- versões suportadas;
- canal privado para reporte;
- SLA acadêmico de triage;
- política de segredos e rotação;
- dependências e processo de exceção;
- não publicar vulnerabilidades em issue pública antes da correção.

**Template de PR**

- contexto/issue;
- tipo e escopo;
- riscos e rollback;
- testes executados;
- impacto DB/API/web/mobile;
- segurança, logs e dados;
- screenshots quando aplicável;
- checklist de docs/ADR.

Adicionar ainda `CODEOWNERS`, templates de issue opcionais, `LICENSE` explícita (o README diz acadêmico, mas não define licença) e `CHANGELOG.md` gerado por releases.

## 14. Estratégia de branches e PRs

Branches curtas, sempre saindo de `main` atualizado. Evitar uma branch de duas semanas com todo o trabalho.

| Ordem | Branch/PR | Escopo | Dependência | Tamanho esperado |
|---:|---|---|---|---|
| 1 | `chore/modernization-baseline` | baseline, scripts de verificação, ADRs propostos | nenhuma | pequeno |
| 2 | `refactor/monorepo-structure` | movimentos, npm workspace, paths Compose, remoção validada dos legados | PR 1 | médio, sem lógica |
| 3 | `fix/backend-authz-security` | JWT externo, rotas, ownership, CORS, headers, erros e testes | PR 2 | médio |
| 4 | `chore/backend-dependencies` | BOM, remover JWT duplicado, upgrades/scans | PR 3 ou paralelo sem conflito | pequeno |
| 5 | `build/frontend-vite` | CRA → Vite ainda aceitando JS, envs e build | PR 2 | médio |
| 6 | `mig/frontend-typescript-core` | cliente API, auth, tipos, componentes base | PR 5 | médio |
| 7 | `mig/frontend-typescript-pages` | páginas restantes, strict final e limpeza de logs | PR 6 | médio |
| 8 | `test/frontend-unit-coverage` | Vitest/Jest, RTL, MSW e gate inicial | PR 6; pode acompanhar PR 7 em commits separados | médio |
| 9 | `build/secure-containers-healthchecks` | Dockerfiles, `/healthz`, Compose | PRs 3 e 5 | médio |
| 10 | `ci/github-actions-validation-security` | PR CI, scanners, Dependabot e branch checks | PRs 4, 8 e 9 | médio |
| 11 | `ci/semantic-release-images` | tags SemVer, GHCR, SBOM, assinatura e GitHub Release | PR 10 | pequeno/médio |
| 12 | `docs/governance-and-handoff` | README, CONTRIBUTING, SECURITY, ADRs aceitos, templates | consolidar anteriores | médio |

### Regras de integração

- Preferir squash merge; título do PR segue Conventional Commits.
- Cada PR deve deixar `main` executável.
- PR de movimento não inclui formatação em massa.
- Banco: migrations Flyway sempre aditivas; jamais reescrever V1–V8 já aplicadas.
- Mudança de contrato exige teste do Android e registro no ADR.
- Para trabalho paralelo, criar branches a partir do mesmo marco e rebasear depois do PR estrutural; não duplicar movimentos de arquivo.

## 15. Cronograma de 10 dias úteis

| Dia | Entrega principal | Checkpoint |
|---:|---|---|
| 1 | baseline, tag, matriz de contratos, PR 1 | suíte/audit/smoke documentados |
| 2 | estrutura `apps/*`, workspace, decisão/removal legado, PR 2 | build nos novos caminhos |
| 3 | autorização/JWT/CORS e testes negativos | exposição `/usuarios/**` fechada |
| 4 | dependências backend + conclusão PRs 3/4 | scans sem crítico de runtime não tratado |
| 5 | CRA → Vite, PR 5 | build e rotas equivalentes |
| 6 | TS em API/auth/componentes + testes iniciais | typecheck verde |
| 7 | TS páginas, cobertura backend/frontend, PRs 6–8 | zero JS de aplicação |
| 8 | containers não-root, healthchecks e Compose, PR 9 | stack sobe do zero |
| 9 | PR/security workflows, Dependabot, PR 10 | required checks utilizáveis |
| 10 | release workflow, docs/ADRs, ensaio de tag RC e handoff | release `v0.x.0-rc.1` comprovada |

Reservar diariamente um bloco de integração/revisão e manter 15–20% de capacidade para falhas encontradas. Se houver atraso, não cortar autorização, testes críticos ou CI; adiar otimização de assets, thresholds mais altos e refinamentos cosméticos.

## 16. Backlog priorizado e Definition of Done

### P0 — obrigatório

- fechar `/usuarios/**` público e IDORs;
- chave JWT externa;
- baseline verde em JDK 21/Node 22;
- remover CRA vulnerável e frontend legado validado;
- TypeScript + testes dos fluxos críticos;
- CI obrigatório;
- imagens não-root + healthchecks;
- documentação de segurança e contrato Android.

### P1 — deve caber

- Vite, logging/request ID, Problem Details;
- Testcontainers;
- audit/Trivy/Gitleaks/CodeQL;
- release GHCR com SBOM/assinatura;
- ADRs e templates.

### P2 — pós-duas semanas se necessário

- Git LFS/otimização completa dos assets;
- OpenAPI gerado e SDK tipado;
- E2E Playwright completo;
- observabilidade externa;
- cookie HttpOnly/refresh token;
- deploy automático por ambiente;
- mudança efetiva para `/api/v1`.

### Definition of Done global

- lint, typecheck, unitários, integração, build e smoke verdes;
- cobertura atende baseline/gate e não regrediu;
- nenhuma crítica/alta explorável sem exceção temporária;
- nenhuma quebra dos contratos Android;
- imagens por digest, não-root e saudáveis;
- documentação e ADR atualizados;
- rollback descrito;
- PR aprovado e required checks verdes.

## 17. Riscos, mitigação e rollback

| Risco | Probabilidade/impacto | Mitigação |
|---|---|---|
| quebra do Android ao endurecer rotas | alta/alta | matriz de contrato, aliases, testes e smoke Android |
| migração CRA/Vite altera env ou SPA routing | média/alta | commit isolado, fallback e smoke de todas as rotas |
| TS consome mais tempo | alta/média | migrar por fronteira, sem redesign, strict por arquivo |
| correção de JWT derruba sessões existentes | certa/média | comunicar janela; aceitar logout único; segredo estável daí em diante |
| scans bloqueiam por transitivas dev-only | alta/média | separar runtime/dev e usar exceção com expiração |
| movimento de diretórios gera conflitos | alta/média | PR estrutural cedo, freeze/rebase e sem formatação |
| cobertura inicial abaixo da meta | média/média | gate igual ao baseline + subida gradual, foco em risco |
| limite de 2 semanas | alta/alta | preservar P0, PRs pequenos e checkpoints diários |

Rollback operacional:

- reverter o PR específico, não usar reset destrutivo;
- imagens de release são imutáveis e selecionáveis pelo digest anterior;
- migrations apenas aditivas e compatíveis com versão anterior;
- manter tag pré-modernização e release candidate testada;
- documentar qualquer variável nova antes do merge.

## 18. Métricas de sucesso

Ao final, apresentar evidências:

- 1 frontend ativo; 0 CRA; 0 manifesto Node órfão;
- 100% dos arquivos de aplicação frontend em TypeScript;
- 0 rotas de dados sensíveis públicas por matcher amplo;
- 0 logs conhecidos de token/senha/PII;
- 0 vulnerabilidades críticas/altas de runtime sem exceção válida;
- cobertura backend/frontend conforme thresholds aprovados;
- tempo mediano de CI e taxa de sucesso;
- 100% dos PRs via required checks;
- build de duas imagens por tag SemVer, com digest, SBOM e assinatura;
- onboarding por README/Compose reproduzível em máquina limpa;
- contratos web/Android críticos cobertos por testes.

## 19. Checklist de início imediato

- [ ] Aprovar este plano e nomear responsáveis.
- [ ] Criar épico/issues e tag pré-modernização.
- [ ] Obter baseline com JDK 21 e Node 22.
- [ ] Confirmar consumidores de `src/main/resources/static/`.
- [ ] Confirmar ausência de consumidor do CRA órfão na raiz.
- [ ] Mesclar primeiro o PR de estrutura.
- [ ] Tratar autorização/JWT antes de qualquer release.
- [ ] Migrar CRA → Vite antes do lote completo de TypeScript.
- [ ] Manter validação Android em cada alteração de API.
- [ ] Configurar required checks antes da release candidate.
- [ ] Ensaiar `v0.x.0-rc.1`; só então criar release estável.

