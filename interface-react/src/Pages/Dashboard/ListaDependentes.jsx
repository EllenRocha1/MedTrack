import {useEffect, useState} from "react";
import Header from "../../Componentes/Header/index.jsx";
import Sidebar from "../../Componentes/Sidebar/index.jsx";
import CardDependente from "../../Componentes/Card/CardDependente.jsx";
import Botao from "../../Componentes/Botao/index.jsx";
import {getUserInfo, getUserRole} from "../../Componentes/Auth/AuthToken";
import api from "../../Service/api";
import {useNavigate} from "react-router-dom";

const ListaDependentes = () => {
    const [termoPesquisa, setTermoPesquisa] = useState("");
    const [dependentes, setDependentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const usuarioId = getUserInfo().id
    const navigate = useNavigate();

    const handleClickDependente = (dependenteId) => {
        navigate(`/perfil_dependente/${dependenteId}`);
    };

    const role = getUserRole()
    let type = true
    if (role === "PESSOAL") {
        type = false;
    }

    useEffect(() => {
        const fetchDependentes = async () => {
            if (role === "ADMINISTRADOR") {
                try {
                    const data = await api.get("http://localhost:8081/dependentes/buscar/todos");
                    console.log("Dados recebidos:", data);
                    setDependentes(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        }
            fetchDependentes();

    }, [role]);



    const removerDependente = async (id) => {
        try {
            console.log(`Id do dependente deletado: ${id}`)
            await api.delete(`http://localhost:8081/dependentes/deletar/${id}`);
            setDependentes(dependentes.filter(dep => dep.id !== id));
        } catch (err) {
            console.error("Erro ao remover dependente:", err);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro: {error}</div>;
    }

    return (
        <div>
            <div className="flex flex-1 w-full h-10">
                <Sidebar className="w-64" type={type} usuarioId={getUserInfo().id} />
                <div className="flex-col w-full p-4 transition-all duration-300">
                    <Header h1={"MedTrack"} exibirPesquisa={true} setTermoPesquisa={setTermoPesquisa}  />
                    <div className="flex self-center w-full justify-between mt-10">
                        <h1 className="text-2xl font-bold mt-2 ">Lista de Dependentes</h1>
                        <Botao label={"Criar novo dependente"} destino={"/cadastro_dependente"} />
                    </div>
                    <CardDependente termoPesquisa={termoPesquisa}
                                    dependentes={dependentes}
                                    removerDependente={removerDependente}
                                    onClickDependente={handleClickDependente}/>
                </div>
            </div>
        </div>
    );
};

export default ListaDependentes;