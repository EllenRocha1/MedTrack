# Baseline de modernização

> Coletado em 28/07/2026, antes de qualquer mudança estrutural ou funcional.

Este documento registra o ponto de partida verificável da modernização. Falhas
descritas aqui são dívida preexistente e não devem ser ocultadas com flags que
relaxem o CI.

## Ambiente de referência

| Componente | Versão |
|---|---|
| Backend | Java 21, Spring Boot 3.4.1, Maven Wrapper 3.9.9 |
| Frontend | Node.js 22, npm 10, React 19, `react-scripts` 5.0.1 |
| Banco/Compose | PostgreSQL 15 Alpine, Docker Compose v2 |

Os testes foram executados em containers para eliminar a diferença do host,
que não possui um JDK completo. Os arquivos `.java-version` e `.nvmrc`
registram as versões esperadas para desenvolvimento local.

## Backend

Comando:

```bash
docker run --rm \
  -v "$PWD/apps/backend:/workspace" \
  -v medtrack-maven-cache:/root/.m2 \
  -w /workspace \
  eclipse-temurin:21-jdk-alpine \
  ./mvnw --batch-mode clean verify
```

Resultado: **verde**.

| Métrica | Baseline |
|---|---:|
| Testes | 104 |
| Falhas/erros/ignorados | 0 / 0 / 0 |
| Tempo informado pelo Surefire | 6,804 s |
| Cobertura de linhas | 96,42% (727/754) |
| Cobertura de branches | 74,72% (133/178) |
| Cobertura de instruções | 94,68% (3.221/3.402) |
| JAR gerado | aproximadamente 60 MB |

Limitação: o JaCoCo atualmente exclui `config`, `repository`, `security` e
tratamento de erros. Portanto, a cobertura alta não demonstra cobertura da
autorização, do filtro JWT, do CORS ou dos erros HTTP. A expansão do escopo
deve acontecer junto dos novos testes para evitar uma queda sem explicação.

## Frontend

Instalação:

```bash
docker run --rm \
  -v "$PWD:/workspace" \
  -v medtrack-npm-cache:/root/.npm \
  -w /workspace \
  node:22-alpine \
  npm ci
```

### Testes

Comando:

```bash
docker run --rm \
  -e CI=true \
  -v "$PWD:/workspace" \
  -w /workspace \
  node:22-alpine \
  npm run test:frontend -- --watchAll=false --coverage
```

Resultado: **vermelho**. O runner verificou 44 arquivos e não encontrou
nenhum teste. O processo termina com código 1.

### Build

O build sem `CI=true` gera o bundle, porém com warnings:

| Artefato gzip | Tamanho |
|---|---:|
| JS principal | 135,02 kB |
| CSS principal | 6,86 kB |
| Chunk adicional | 2,51 kB |

O mesmo build com `CI=true` é **vermelho**, porque CRA transforma warnings
em erros. Foram identificados:

- imports, variáveis e estados não usados;
- links sem destino válido, violando acessibilidade;
- dependências ausentes em `useEffect` e `useMemo`;
- base Browserslist desatualizada;
- workaround Babel não declarado;
- aviso explícito de que Create React App não é mais mantido.

Não usar `CI=false` no pipeline para contornar este baseline. O PR de Vite/TS
deve corrigir ou remover cada warning e estabelecer lint explícito.

## Dependências npm

As auditorias foram executadas com o lockfile, sem `npm audit fix`.

| Escopo | Total | Críticas | Altas | Moderadas | Baixas |
|---|---:|---:|---:|---:|---:|
| CRA órfão da raiz | 58 | 3 | 27 | 15 | 13 |
| frontend atual | 62 | 3 | 31 | 15 | 13 |

A cadeia de `react-scripts` concentra a maior parte dos achados. A correção
planejada é remover CRA em favor de Vite e então auditar novamente; não
executar `npm audit fix --force`, pois a sugestão pode aplicar mudanças
quebradoras e até versões inválidas de `react-scripts`.

## Docker Compose

Comando:

```bash
docker compose --env-file .env.example config --quiet
```

Resultado: **verde para resolução sintática**.

Pendências observadas na configuração efetiva:

- somente o banco possui healthcheck;
- frontend depende de backend iniciado, não saudável;
- backend de desenvolvimento monta `~/.m2` do host;
- backend e frontend definem `container_name`;
- frontend executa o servidor de desenvolvimento;
- os serviços de aplicação ainda rodam como root.

O baseline não iniciou a stack completa porque `.env.example` contém
placeholders de Cloudinary e não há fixtures/credenciais de smoke test
documentadas. Isso será tratado na fase de DX/containerização.

## Gates para o primeiro PR

- O backend deve continuar com 104 testes verdes.
- Movimentos de arquivos não podem reduzir cobertura nem quebrar o JAR.
- O frontend pode permanecer vermelho somente no PR de baseline; o primeiro
  PR funcional deve tornar lint/test/build obrigatoriamente verdes.
- Nenhuma auditoria pode piorar em quantidade ou severidade.
- Não alterar contratos consumidos pelo Android sem teste e registro.
