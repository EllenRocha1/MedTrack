import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    
      <Routes>
        <Route path='/' element={<PaginaPrincipal/>}/>
        <Route path="/home" element={<Dashboard/>}/>
        <Route path='/login' element={<PaginaLogin/>}/>
        <Route path='/cadastro' element={<PaginaCadastro h1='Bem-Vindo ao MedTrack' p='Cadastre-se e comece a gerenciar suas medicações.'/>}/>
        <Route path='/cadastro_user' element={<PaginaCadastro2 h1={"Quase-lá"} p={"Agora cadastre seu usuário."} />}/>
        <Route path='/cadastro_concluido' element={<PaginaCadastro3 h1="Usuário Cadastrado com sucesso!"/>}/>
        <Route path='/dashboard' element ={<Dashboard/>}/>
        <Route path="/lista_dependentes" element={<ListaDependentes/>}/>
        <Route path="/cadastro_dependente" element={<CadastroDependente/>} />
        <Route path="/perfil" element={<PerfilDependente/>}/>
      </Routes>
    
  );
}

export default App;
