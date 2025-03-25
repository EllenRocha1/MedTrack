import {useEffect, useState} from "react";
import Header from "../../Componentes/Header";
import { Bell } from "lucide-react";
import Perfil from "../../Componentes/Perfil";
import Medicacoes from "../../Componentes/Medicacoes/Medicacoes";
import api from "../../Service/api";
import {useParams} from "react-router-dom";
import {getUserInfo, getUserRole} from "../../Componentes/Auth/AuthToken";

const PerfilDependente = () => {
    const { dependenteId } = useParams(); // Obtém o ID do dependente da URL
    const [termoPesquisa, setTermoPesquisa] = useState("");
    const [depInfo, setDepInfo] = useState(null);
    const [error, setError] = useState(null);
    const userRole = getUserRole();
    const usuarioId = getUserInfo().id

    useEffect(() => {
        const fetchDados = async () => {
            try {
                if (userRole === "ADMINISTRADOR") {
                    const response = await api.get(`http://localhost:8081/dependentes/buscar/${dependenteId}`);
                    setDepInfo(response);
                } else if (userRole === "PESSOAL" && usuarioId) { // Garante que usuarioId não seja undefined
                    console.log("ID do usuário:", usuarioId);
                    const response = await api.get(`http://localhost:8081/usuarios/buscar/${usuarioId}`);
                    setDepInfo(response);
                }
            } catch (error) {
                setError(error.message);
            }
        };

        if (userRole) { // Só chama a função se o userRole estiver definido
            fetchDados();
        }
    }, [userRole, dependenteId, usuarioId]); // Adiciona usuarioId para garantir atualização correta

    const handleSearchChange = (termo) => {
        setTermoPesquisa(termo);
    };


    if (error) {
        return <div>{error}</div>;
    }

    if (!depInfo) {
        return <div>Carregando...</div>;
    }



    return (
        <div className="flex flex-col min-h-screen">
            <header className="flex items-center w-full max-w-7xl mx-auto px-4 py-4">
                <Header h1={`Olá, ${depInfo.nome}`} exibirPesquisa={true} setTermoPesquisa={handleSearchChange}/>
                <Bell size={40} color="cyan" className="hidden sm:block ml-auto"/>
            </header>

            <main className="flex flex-1 w-full max-w-7xl mx-auto px-4 gap-4">
                {/* Perfil - 3/8 da largura */}
                <section
                    className="hidden sm:block sm:w-[37.5%] lg:w-[30%] xl:w-[25%] border border-cyan-300 rounded-lg p-4 overflow-y-auto">
                    <Perfil vaiTer={true} userInfo={depInfo}/>
                </section>

                {/* Conteúdo principal - 5/8 da largura (ajustável) */}
                <section className="flex-1 w-[62.5%] lg:w-[70%] xl:w-[75%] overflow-y-auto">
                    <Medicacoes termoPesquisa={termoPesquisa}/>
                </section>
            </main>
        </div>
    );
};

export default PerfilDependente;
