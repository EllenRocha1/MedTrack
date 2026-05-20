# Arquitetura Frontend

Este arquivo documenta a arquitetura frontend encontrada no estado atual do projeto.

O frontend principal informado para evolucao fica em `interface-react/`. Tambem existem artefatos antigos de frontend na
raiz e dentro do backend Spring.

## Stack encontrada

### Frontend principal: `interface-react/`

- React 19
- Create React App / `react-scripts`
- JavaScript
- React Router DOM 7
- TailwindCSS 3
- Axios instalado
- Fetch API usada na pratica
- Chart.js e `react-chartjs-2`
- Framer Motion
- JWT Decode
- Lucide React
- React Icons
- PapaParse

### Frontend antigo na raiz

Existe outro app React na raiz do projeto:

```text
package.json
package-lock.json
src/App.js
src/index.js
src/App.css
src/index.css
public/
```

Esse app tambem usa Create React App, mas parece ser legado ou residual.

### Interface estatica antiga no backend

Tambem existem HTML, CSS e imagens servidos pelo Spring em:

```text
src/main/resources/static/
|-- css/
|-- images/
`-- templates/
```

Essa estrutura deve ser tratada como legado ate decisao explicita de migracao ou remocao.

## Localizacao do frontend principal

```text
interface-react/
|-- Dockerfile
|-- package.json
|-- package-lock.json
|-- postcss.config.js
|-- tailwind.config.js
|-- public/
`-- src/
```

Arquivos de configuracao relacionados ao projeto tambem existem na raiz:

```text
package.json
package-lock.json
docker-compose.yml
docker-compose.override.yml
```

Isso contribui para a confusao atual, porque a raiz contem configuracoes de frontend e backend ao mesmo tempo.

## Estrutura atual

```text
interface-react/src/
|-- App.js
|-- index.js
|-- index.css
|-- setupTests.js
|-- reportWebVitals.js
|-- Componentes/
|-- Imagens/
|-- Pages/
`-- Service/
```

## Organizacao de pastas

### `Pages`

Contem telas completas da aplicacao.

Principais grupos:

```text
Pages/
|-- Dashboard/
|-- PaginaCadastro/
|-- PaginaLogin/
|-- PaginaPrincipal/
|-- PerfilDependente/
`-- RecuperacaoSenha/
```

Exemplos:

- pagina inicial
- login
- cadastro de usuario
- cadastro de dependente
- cadastro de medicamento
- dashboard pessoal
- dashboard administrador
- lista de dependentes
- perfil de dependente
- historico de medicacao
- configuracoes
- relatorios

### `Componentes`

Contem componentes visuais e alguns componentes com logica de dominio.

Exemplos:

- `Auth`
- `Botao`
- `Box`
- `BoxMedicacao`
- `CampoTexto`
- `Card`
- `FormularioCadastro`
- `FormularioLogin`
- `Grafico`
- `Header`
- `ListaDeMed`
- `Medicacoes`
- `Perfil`
- `Sidebar`

Ponto de atencao:

- A pasta mistura componentes puramente visuais com componentes conectados a API, autenticacao e regras de exibicao.

### `Service`

Contem integracoes com o backend:

- `api.js`
- `auth.js`
- `cadastrarUsuario.js`

`api.js` define `BACKEND_URL` e wrappers para `get`, `post`, `put`, `patch` e `delete`.

Apesar de `axios` estar instalado, a integracao usa `fetch`.

### `Imagens`

Contem imagens usadas pela interface.

## Roteamento

O roteamento fica centralizado em:

```text
interface-react/src/App.js
```

Rotas encontradas:

- `/`
- `/login`
- `/cadastro`
- `/cadastro_user`
- `/cadastro_concluido`
- `/recuperacaosenha`
- `/home`
- `/lista_dependentes`
- `/perfil_dependente/:dependenteId`
- `/cadastro_dependente`
- `/cadastro_medicamento/:dependenteId`
- `/relatorios`
- `/historico_medicacoes/:id`
- `/perfil_usuario/:usuarioId`
- `/configuracoes`

`DashboardRouter` escolhe entre `DashboardAdmin` e `Dashboard` com base na claim `categoria` do JWT.

Ponto de atencao:

- `PrivateRoute` existe, mas esta comentado.
- As rotas privadas nao estao protegidas no frontend.
- A aplicacao depende do backend para bloquear acesso real aos dados.

## Autenticacao no frontend

Arquivos principais:

```text
interface-react/src/Service/auth.js
interface-react/src/Componentes/Auth/AuthToken.js
interface-react/src/Componentes/Auth/PrivateRoute.jsx
```

Fluxo atual:

1. `auth.js` envia `POST /auth/login`.
2. O token retornado e salvo em `localStorage` com a chave `token`.
3. `AuthToken.js` decodifica o JWT com `jwt-decode`.
4. A claim `categoria` define o tipo de dashboard.
5. `api.js` envia `Authorization: Bearer <token>` nas requisicoes autenticadas.

Pontos de atencao:

- Token e armazenado em `localStorage`.
- Nao ha refresh token.
- Nao ha interceptador HTTP centralizado.
- Nao ha redirecionamento global para login quando o token expira.
- `PrivateRoute` esta desabilitado.
- Existe suporte parcial a `dependenteToken`, mas o login web principal salva apenas `token`.

## Comunicacao com backend

Variaveis usadas:

```js
process.env.REACT_APP_BACKEND_URL
process.env.REACT_APP_FRONTEND_URL
```

As chamadas usam URLs absolutas montadas no frontend:

```text
${BACKEND_URL}/auth/login
${BACKEND_URL}/usuarios/cadastro
${BACKEND_URL}/dependentes/...
${BACKEND_URL}/medicamentos/...
```

Ponto de atencao:

- Nao existe uma camada de cliente HTTP forte o suficiente para padronizar erros, expiracao de token, retry ou logout.
- Alguns componentes chamam API diretamente via `api.js`, mas ainda ha logica de montagem de endpoint espalhada pelas telas.

## Estilizacao

O projeto usa:

- `index.css`
- CSS por componente/pagina
- TailwindCSS configurado em `tailwind.config.js`

A configuracao Tailwind aponta para:

```text
./src/**/*.{html,js,jsx,ts,tsx}
```

Ponto de atencao:

- A base e JavaScript, nao TypeScript.
- Nao ha uma convencao unica entre classes Tailwind e CSS tradicional.

## Dados locais e arquivos publicos

O frontend possui o arquivo:

```text
interface-react/public/DADOS_ABERTOS_MEDICAMENTOS.csv
```

Ele e lido no componente `ListaDeMed` com `fetch("/DADOS_ABERTOS_MEDICAMENTOS.csv")`.

Isso indica uso de dado publico local para lista ou busca de medicamentos.

## Build e execucao

Scripts em `interface-react/package.json`:

```json
{
  "start": "cross-env PORT=3000 react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

Docker:

- `docker-compose.yml` cria o servico `frontend`.
- O build usa `./interface-react`.
- A porta padrao exposta e `3000`.
- A variavel principal e `REACT_APP_BACKEND_URL`.

## Estado arquitetural atual

O frontend principal tem uma separacao inicial:

```text
Pages -> Componentes -> Service -> Backend
```

Na pratica, a separacao ainda e fraca:

- `Pages` e `Componentes` misturam apresentacao, estado e chamada de API.
- A protecao de rota esta incompleta.
- Existem dois apps React no repositorio.
- Existe uma interface HTML/CSS antiga dentro do backend.
- Endpoints sao montados em varias telas e componentes.
- A pasta `Componentes` tem responsabilidades heterogeneas.

## Direcao recomendada

Para reorganizar sem quebrar a aplicacao:

1. Confirmar `interface-react/` como frontend oficial.
2. Marcar o React da raiz como legado antes de remover.
3. Marcar `src/main/resources/static` como legado antes de remover ou migrar.
4. Reativar e integrar `PrivateRoute`.
5. Centralizar autenticacao e expiracao de token.
6. Criar uma camada de API por recurso:
   - `usuariosService`
   - `dependentesService`
   - `medicamentosService`
   - `authService`
7. Evitar montagem de endpoints diretamente em componentes.
8. Separar componentes visuais de componentes conectados a dados.
9. Padronizar estrategia de CSS.
10. Avaliar migracao futura para Vite e TypeScript apenas depois de estabilizar a estrutura atual.

## Regras para proximas alteracoes

- Novas telas devem ficar em `interface-react/src/Pages`.
- Novos componentes reutilizaveis devem ficar em `interface-react/src/Componentes`.
- Novas chamadas HTTP devem ser centralizadas em `interface-react/src/Service`.
- Nao adicionar novas telas no React da raiz.
- Nao adicionar novas telas HTML em `src/main/resources/static`.
- Nao espalhar leitura direta de `localStorage` em novos componentes.
- Nao criar novas rotas privadas sem passar por uma estrategia de protecao.
