import {useEffect, useState} from "react";
import Header from "../../Componentes/Header";
import { Bell } from "lucide-react";
import Perfil from "../../Componentes/Perfil";
import Medicacoes from "../../Componentes/Medicacoes/Medicacoes";
import api from "../../Service/api";
import {useParams} from "react-router-dom";
import {getUserInfo, getUserRole} from "../../Componentes/Auth/AuthToken";
import Sidebar from "../../Componentes/Sidebar";

const PerfilDependente = () => {
    const { dependenteId } = useParams();
    const [termoPesquisa, setTermoPesquisa] = useState("");
    const [depInfo, setDepInfo] = useState(null);
    const [error, setError] = useState(null);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const userRole = getUserRole();
    const usuarioId = getUserInfo().id;
    let type = true;

    if (userRole === "PESSOAL") {
        type = false;
    }

    useEffect(() => {
        const fetchDados = async () => {
            try {
                if (userRole === "ADMINISTRADOR") {
                    const response = await api.get(`http://localhost:8081/dependentes/buscar/${dependenteId}`);
                    setDepInfo(response);
                } else if (userRole === "PESSOAL" && usuarioId) {
                    console.log("ID do usuário:", usuarioId);
                    const response = await api.get(`http://localhost:8081/usuarios/buscar/${usuarioId}`);
                    setDepInfo(response);
                }
            } catch (error) {
                setError(error.message);
            }
        };

        if (userRole) {
            fetchDados();
        }
    }, [userRole, dependenteId, usuarioId]);

    const handleSearchChange = (termo) => {
        setTermoPesquisa(termo);
    };

    const toggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!depInfo) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}

                <Sidebar
                    usuarioId={usuarioId}
                    type={type}
                    expanded={sidebarExpanded}
                    toggleSidebar={toggleSidebar}
                />


            {/* Conteúdo principal */}
            <div
                className={"flex-1 flex flex-col transition-all duration-300 ease-in-out "}
            >
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
                        <Header
                            h1={`Olá, ${depInfo.nome}`}
                            exibirPesquisa={true}
                            setTermoPesquisa={handleSearchChange}
                        />
                        <button
                            onClick={toggleSidebar}
                            className="ml-4 p-2 rounded-full hover:bg-gray-100"
                        >
                            <Bell size={40} color="cyan" className="hidden sm:block ml-auto"/>
                        </button>
                    </div>
                </header>

                {/* Conteúdo principal */}
                <main className="flex-1 flex flex-col sm:flex-row w-full mx-auto px-4 gap-4 py-4 overflow-y-auto">
                    {/* Seção do Perfil - só aparece para ADMINISTRADOR */}
                    {userRole === "ADMINISTRADOR" && (
                        <section className={`hidden sm:block transition-all duration-300 ${
                            sidebarExpanded ? "sm:w-[37.5%] lg:w-[30%] xl:w-[25%]" : "sm:w-[40%] lg:w-[35%] xl:w-[30%]"
                        } border border-cyan-300 rounded-lg p-4 bg-white shadow-sm`}>
                            <Perfil vaiTer={true} dependenteId={depInfo.id} />
                        </section>
                    )}

                    {/* Seção de Medicamentos - ocupa toda a largura se não for ADMINISTRADOR */}
                    <section className={`${
                        userRole === "ADMINISTRADOR" ? "flex-1" : "w-full"
                    } border border-cyan-300 rounded-lg p-4 bg-white shadow-sm overflow-y-auto`}>
                        <Medicacoes termoPesquisa={termoPesquisa}/>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default PerfilDependente;