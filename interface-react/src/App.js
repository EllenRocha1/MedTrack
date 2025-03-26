import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from './Componentes/Auth/PrivateRoute.jsx';
import PaginaCadastro from './Pages/PaginaCadastro/index.jsx';
import PaginaPrincipal from './Pages/PaginaPrincipal/index.jsx';
import PaginaCadastro2 from './Pages/PaginaCadastro/index2.jsx';
import PaginaCadastro3 from './Pages/PaginaCadastro/index3.jsx';
import PaginaLogin from './Pages/PaginaLogin/index.jsx';
import Dashboard from './Pages/Dashboard/index.jsx';
import ListaDependentes from "./Pages/Dashboard/ListaDependentes.jsx"
import './index.css'
import CadastroDependente from "./Pages/PaginaCadastro/CadastroDependente.jsx";
import PerfilDependente from "./Pages/PerfilDependente/PerfilDependente.jsx";
import CadastroMedicamentos from "./Pages/PaginaCadastro/CadastroMedicamentos.jsx";
import RecuperacaoSenha from "./Pages/RecuperacaoSenha/index.jsx";
import Relatorios from "./Pages/Dashboard/Relatorios.jsx";
import PaginaHistoricoDependentes from "./Pages/PerfilDependente/HistoricoMedicacao.jsx";
import Configuracoes from "./Pages/Dashboard/Configuracoes.jsx";

function App() {
    return (
        <Router>
            <Routes>

                <Route path='/' element={<PaginaPrincipal />} />
                <Route path="/login" element={<PaginaLogin />} />
                <Route path="/cadastro" element={<PaginaCadastro h1='Bem-Vindo ao MedTrack' p='Cadastre-se e comece a gerenciar suas medicações.' />} />
                <Route path='/cadastro_user' element={<PaginaCadastro2 h1={"Quase-lá"} p={"Agora cadastre seu usuário."} />} />
                <Route path='/cadastro_concluido' element={<PaginaCadastro3 h1="Usuário Cadastrado com sucesso!" />} />
                <Route path="/recuperacaosenha" element={<RecuperacaoSenha />} />

                <Route path="/home" element={<Dashboard />} />
                <Route path="/lista_dependentes" element={<ListaDependentes />} />
                <Route path="/perfil_dependente/:dependenteId" element={<PerfilDependente />} />
                <Route path="/cadastro_dependente" element={<CadastroDependente />} />
                <Route path="/cadastro_medicamento/:dependenteId" element={<CadastroMedicamentos />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/historico_medicacoes/:dependenteId" element={<PaginaHistoricoDependentes />} />
                <Route path="/historico_medicacoes/:usuarioId" element={<PaginaHistoricoDependentes/>}/>
                <Route path="/perfil_usuario/:usuarioId" element={<PerfilDependente/>}/>
                <Route path="/configuracoes" element={<Configuracoes/>}/>

            </Routes>
        </Router>

    );
}

export default App;
