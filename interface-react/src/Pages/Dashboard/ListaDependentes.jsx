import {useEffect, useState} from "react";
import Header from "../../Componentes/Header/index.jsx";
import Sidebar from "../../Componentes/Sidebar/index.jsx";
import CardDependente from "../../Componentes/Card/CardDependente.jsx";
import Botao from "../../Componentes/Botao/index.jsx";
import {getUserRole} from "../../Componentes/Auth/AuthToken";
import api from "../../Service/api";
import {useNavigate} from "react-router-dom";

const ListaDependentes = () => {
    const [termoPesquisa, setTermoPesquisa] = useState("");
    const [dependentes, setDependentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            try {
                const data = await api.get("http://localhost:8081/dependentes/buscar/todos");
                setDependentes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDependentes();
    }, []);

    const adicionarDependente = (novoDependente) => {
        setDependentes([...dependentes, novoDependente]);
    };

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
        <div className="flex flex-col h-screen">
            <div className="flex flex-1">
                <Sidebar className="w-64" type={type} />
                <div className="flex-1 p-4 transition-all duration-300">
                    <Header h1={"MedTrack"} exibirPesquisa={true} setTermoPesquisa={setTermoPesquisa} />
                    <div className="flex self-center justify-between mt-10 ml-10 mr-10">
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