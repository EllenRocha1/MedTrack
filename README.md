<div align="center" justify="center">
    <img width="15%" src="assets/logo-medtrack.png" alt="Logo do MedTrack"> 
    <h1>MedTrack Web: Dashboard & API </h1>
</div>

> Plataforma web completa para gerenciamento de medicação com dashboard adaptável e API robusta

## Visão Geral

<div align="center">
  <img src="assets/web-dashboard-preview.gif" width="80%" alt="Demonstração do Dashboard">
</div>

O **MedTrack Web** é uma plataforma completa desenvolvida para:
- 👨‍⚕️ **Administradores** gerenciarem pacientes e medicamentos
- 👤 **Usuários** controlarem sua própria medicação
- 📊 Geração de relatórios e histórico completo

**Funcionalidades-chave:**
- 🔐 Autenticação JWT com roles (ADMINISTRADOR/USUÁRIO)
- 📱 Sincronização em tempo real com o app mobile
- 📅 CRUD completo de medicamentos e usuários
- 📈 Dashboard analítico com gráficos

## ✨ Destaques Técnicos

### 🏗️ Arquitetura do Projeto

#### Frontend (React)
- **React** com JavaScript
- **Tailwind CSS** para estilização

<div align="center">
  <img src="assets/frontend-architecture.png" width="40%" alt="Diagrama Frontend">
</div>

#### Backend (Spring Boot)
- **Java 21** com **Spring Boot 3**
- Arquitetura RESTful
- Spring Security + JWT
- Spring Data JPA + Flyway
- PostgreSQL como banco de dados

<div align="center">
  <img src="assets/backend-architecture.png" width="80%" alt="Diagrama Backend">
</div>

### 📊 Dashboard Interativo

> 👨‍⚕️ **Visão Administrador**
- Gerenciamento de todos os usuários
- Relatórios completos de adesão à medicação
- CRUD de medicamentos para qualquer usuário

<div align="center">
  <img src="assets/admin-view.png" width="45%" alt="Dashboard Admin">
  <img src="assets/admin-meds.png" width="45%" alt="Gerenciamento Admin">
</div>

> 👤 **Visão Usuário**
- Controle pessoal de medicamentos
- Histórico de confirmações
- Adição/remoção de medicamentos

<div align="center">
  <img src="assets/user-view.png" width="45%" alt="Dashboard User">
  <img src="assets/user-config.png" width="45%" alt="Configurações User">
</div>

### 🔐 Sistema de Autenticação
- JWT (JSON Web Tokens)
- Roles (ADMINISTRADOR/USUÁRIO)
- Proteção de rotas no frontend e backend


```java
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtService jwtService,
            UsuarioDetailsService usuarioDetailsService
    ) throws Exception {
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtService, usuarioDetailsService);

        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/usuarios/admin/**").hasRole("ADMINISTRADOR")
                        .requestMatchers("/usuarios/user/**").hasRole("PESSOAL")
                        .requestMatchers("/usuarios/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

### 🗃️ Banco de Dados
- Modelo relacional com PostgreSQL:
  - Migrações controladas com Flyway 
  - Relações entre usuários, medicamentos, dependentes, frequencia de uso e confirmações

<div align="center"> 
    <img src="assets/database-diagram.png" width="80%" alt="Diagrama do Banco de Dados"> 
</div>

### 🌐 API Endpoints

Documentação completa dos endpoints REST disponível em dois formatos:

1. **[README das Rotas](src/README.md)** - Lista detalhada de todos os endpoints com:
  - Métodos HTTP
  - Parâmetros esperados
  - Exemplos de request/response
  - Status codes possíveis

2. **[Coleção do Insomnia](src/main/java/com/medtrack/medtrack/docs/insomnia)** - Arquivo pronto para importar no Insomnia contendo:
  - Todas as rotas configuradas
  - Exemplos de requests pré-prontos
  - Environment configurado
  - Autenticação JWT já implementada

> 💡 Dica: Importe a coleção no Insomnia para testar rapidamente todas as rotas com exemplos pré-configurados!

<div align="center">

  [![Run in Insomnia](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?uri=file://src/main/java/com/medtrack/medtrack/docs/insomnia/V3_Insominia_doc.json)
</div>

<div align="center"> 
    <img src="assets/insomnia-dashboard.png" width="80%" alt="Rotas no Insomnia"> 
</div>

### 🚀 Como Executar

## Rodando com Docker (Recomendado)
 
O ecossistema MedTrack está completamente dockerizado. Banco de Dados, Backend e Frontend rodam de forma isolada e orquestrada via Docker Compose.
 
### Pré-requisitos
 
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução
 
### Passo a passo
 
1. Clone o repositório e navegue até a raiz do projeto.
 
2. Crie o arquivo de variáveis de ambiente a partir do exemplo:
   ```bash
   cp .env.example .env
   ```
   Edite o `.env` com suas configurações (credenciais do banco, etc.).
 
3. Na **primeira execução**, faça o build e suba os containers:
   ```bash
   docker compose up --build
   ```
 
4. Nas execuções seguintes, basta:
   ```bash
   docker compose up
   ```
 
5. Acesse os serviços:
   | Serviço  | URL                          |
   |----------|------------------------------|
   | Frontend | http://localhost:3000        |
   | Backend  | http://localhost:8081        |
 
### Detalhes da infraestrutura Docker
 
| Componente | Tecnologia | Detalhes |
|---|---|---|
| **Backend** | Spring Boot + JRE 21 | Build multi-stage (Maven + JRE 21) para imagens leves e seguras |
| **Frontend** | React + Node 18 | Suporte a Hot-Reload no Windows via Polling |
| **Banco de Dados** | PostgreSQL | Volumes persistentes e Healthcheck para garantir a ordem de subida dos serviços |
 
---
 
## 🚀 Rodando Localmente (sem Docker)

##### **Pré-requisitos**
   - Node.js 18+ (Frontend)
   - Java 21+ JDK (Backend)
   - PostgreSQL 15+

#### **Frontend**
````bash
cd interface-react
npm install
npm start
````

#### **Backend**
`````properties
spring.datasource.url=jdbc:postgresql://${DB_HOST}/medtrack
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
`````

## 📱 MedTrack: Mobile

<div align="center">
  <a href="https://github.com/MClaraFerreira5/MedTrack-Mobile" target="_blank">
    <img src="https://img.shields.io/badge/🔗_Acessar_Repositório-181717?style=for-the-badge&logo=github" alt="Repositório Web">
  </a>
</div>

### Aplicativo Complementar
O **MedTrack Mobile** é o aplicativo Android que se integra perfeitamente com a plataforma web:

- 📸 Captura de medicamentos via OCR
- 🔔 Notificações inteligentes
- ✅ Confirmação de medicamentos que sincroniza com o dashboard web

<div align="center"> 
  <img src="assets/mobile-preview.jpg" width="30%" alt="App Mobile"> 
</div>

### Integração Mobile-Web
- 🔄 Sincronização em tempo real dos dados de medicação
- 🔐 Autenticação unificada JWT
- 📩 Notificações complementares via email

## 🌟 Time de Contribuidores

<div align="center">

<table>
  <tr>
    <td align="center">
        <img src="https://github.com/EllenRocha1.png" width="100px;" alt="Ellen Rocha"/><br />
        <sub><b>Ellen Rocha</b></sub>
      <br />
      <a href="https://github.com/EllenRocha1">
        <img src="https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github" />
      </a>
      <a href="https://www.linkedin.com/in/ellen-rocha-dev/">
        <img src="https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin" />
      </a>
      <br />
      <code>Backend & Frontend</code>
    </td>
    <td align="center">
        <img src="https://github.com/MClaraFerreira5.png" width="100px;" alt="Maria Clara"/><br />
        <sub><b>Maria Clara</b></sub>
      <br />
      <a href="https://github.com/MClaraFerreira5">
        <img src="https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github" />
      </a>
      <a href="https://www.linkedin.com/in/clara-ferreira-dev/">
        <img src="https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin" />
      </a>
      <br />
      <code>Frontend & Mobile</code>
    </td>
    <td align="center">
        <img src="https://github.com/YannLeao.png" width="100px;" alt="Yann Leão"/><br />
        <sub><b>Yann Leão</b></sub>
      <br />
      <a href="https://github.com/YannLeao">
        <img src="https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github" />
      </a>
      <a href="https://www.linkedin.com/in/yannleao-dev">
        <img src="https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin" />
      </a>
      <br />
      <code>Backend & Mobile</code>
    </td>
  </tr>
</table>

</div>

## 🎓 Orientação

<div align="center">

<table>
  <tr>
    <td align="center">
        <img src="https://github.com/ygoramaral.png" width="100px;" alt="Prof. Igor Amaral"/><br />
        <sub><b>Prof. Igor Amaral</b></sub>
      <br />
      <a href="https://github.com/ygoramaral">
        <img src="https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github" />
      </a>
      <br />
      <code>Orientador</code>
    </td>
  </tr>
</table>

</div>

## 📄 Licença

Projeto acadêmico desenvolvido para a disciplina de **Projeto Interdisciplinar de Engenharia da Computação 1 (PIEC1)**  
Universidade Federal Rural de Pernambuco — Unidade Acadêmica de Belo Jardim (UFRPE/UABJ)
