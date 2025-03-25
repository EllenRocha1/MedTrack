import BoxMedicacao from "../BoxMedicacao";
import Botao from "../Botao";
import {useEffect, useState} from "react";
import api from "../../Service/api";
import {getUserRole} from "../Auth/AuthToken";
import {useParams} from "react-router-dom";


const Medicacoes = () => {
    const { dependenteId} = useParams();  // 📌 Pegando o ID do dependente da URL
    const [medicamentos, setMedicamentos] = useState([]);  // 📌 Iniciar com um array vazio
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [termoPesquisa, setTermoPesquisa] = useState("");


    useEffect(() => {
        const fetchMedicamentos = async () => {
            try {
                console.log("Dependente Id", dependenteId)
                const data = await api.get(`http://localhost:8081/medicamentos/todos/dependente/${dependenteId}`);
                setMedicamentos(data)


            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (dependenteId){
            fetchMedicamentos()
        }
    }, [dependenteId]);

    const adicionarMedicamento = (novoMedicamento) => {
        setMedicamentos([...medicamentos, novoMedicamento]);
    };


    return (
        <div className="flex flex-col gap-3 w-full h-screen border border-cyan-300 rounded-lg p-10">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold">Lista de Medicações</h2>
                <Botao label={"Novo Medicamento"} destino={`/cadastro_medicamento/${dependenteId}` }/>
            </div>
            <div className="overflow-y-auto">
            <BoxMedicacao medicacoes={medicamentos} termoPesquisa={termoPesquisa}
                className="overflow-y-auto"/>
                </div>
        </div>
    );
};

export default Medicacoes;
