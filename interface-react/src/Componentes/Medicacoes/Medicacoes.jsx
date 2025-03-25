import BoxMedicacao from "../BoxMedicacao";
import Botao from "../Botao";
import {useEffect, useState} from "react";
import api from "../../Service/api";
import {getUserInfo, getUserRole} from "../Auth/AuthToken";
import {useParams} from "react-router-dom";

const Medicacoes = ({termoPesquisa}) => {

    const { dependenteId } = useParams();
    const [medicamentos, setMedicamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userRole = getUserRole();
    const usuarioId = getUserInfo().id;

    const getDestino = () => {
        if (userRole === "ADMINISTRADOR") {
            return `/cadastro_medicamento/${dependenteId}`;
        } else if (userRole === "PESSOAL") {
            return `/cadastro_medicamento/${usuarioId}`;
        }
        return "/cadastro_medicamento"; // Fallback
    };

    useEffect(() => {
        const fetchMedicamentos = async () => {
            try {
                let endpoint = "";

                if (userRole === "ADMINISTRADOR") {
                    endpoint = `http://localhost:8081/medicamentos/todos/dependente/${dependenteId}`;
                } else if (userRole === "PESSOAL") {
                    endpoint = `http://localhost:8081/medicamentos/todos/${usuarioId}`;
                }

                if (endpoint) {
                    const  data  = await api.get(endpoint);
                    setMedicamentos(data);
                    console.log(medicamentos)
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicamentos();
    }, [dependenteId, usuarioId, userRole]);


    return (
        <div className="flex flex-col gap-3 w-full h-screen border border-cyan-300 rounded-lg p-10">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold">Lista de Medicações</h2>
                <Botao
                    label={"Novo Medicamento"}
                    destino={getDestino()}
                />
            </div>
            <div className="overflow-y-auto">
                <BoxMedicacao
                    medicacoes={medicamentos}
                    termoPesquisa={termoPesquisa}
                    className="overflow-y-auto"
                />
            </div>
        </div>
    );
};

export default Medicacoes;