import {useEffect, useState} from "react";
import Header from "../../Componentes/Header";
import { Bell } from "lucide-react";
import Perfil from "../../Componentes/Perfil";
import Medicacoes from "../../Componentes/Medicacoes/Medicacoes";
import api from "../../Service/api";
import {useParams} from "react-router-dom";

const PerfilDependente = () => {
    const { dependenteId } = useParams(); // Obtém o ID do dependente da URL
    const [termoPesquisa, setTermoPesquisa] = useState("");
    const [depInfo, setDepInfo] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchDependentes = async () => {
            try {
                const data = await api.get(`http://localhost:8081/dependentes/buscar/${dependenteId}`);
                setDepInfo(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchDependentes();
    }, [dependenteId]);

    if (error) {
        return <div>{error}</div>; // Exibe uma mensagem de erro
    }

    if (!depInfo) {
        return <div>Carregando...</div>; // Exibe uma mensagem de carregamento
    }
    return (
        <div>
            <header className="flex items-center md:w-4/5 mx-auto md:pr-10">
                <Header h1={`Olá, ${depInfo.nome}`} exibirPesquisa={true} setTermoPesquisa={setTermoPesquisa} />
                <Bell size={40} color="cyan" className="hidden sm:block ml-auto" />
            </header>

            <main className="flex md:w-4/5 gap-5 justify-center mx-auto">
                <section className="mx-auto h-screen border border-cyan-300 rounded-lg p-10 ml-3 hidden sm:block">
                    <Perfil vaiTer={true} userInfo={depInfo} />
                </section>
                <section className="mx-auto w-full h-screen ">
                    <Medicacoes termoPesquisa={termoPesquisa} />
                </section>
            </main>
        </div>
    );
};

export default PerfilDependente;
