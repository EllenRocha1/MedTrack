import RelatorioMedicacao from "../../Componentes/HistoricoMedicacoes";
import Sidebar from "../../Componentes/Sidebar";
import {useEffect, useState} from "react";
import api from "../../Service/api";
import {getUserInfo, getUserRole} from "../../Componentes/Auth/AuthToken";
import {useParams} from "react-router-dom";

const PaginaHistoricoDependentes = () => {
    const userRole = getUserRole()
    const [dados, setDados] = useState("");
    const [error, setError]= useState(null)
    const role = getUserRole()
    let type = true
    if (role === "PESSOAL") {
        type = false;
    }
    const usuarioId = getUserInfo().id
    const {dependenteId} = useParams();


    useEffect(() => {
        const fetchDados = async () => {
            try {
                const idParaBusca = userRole === "ADMINISTRADOR" ? dependenteId : usuarioId;

                if (idParaBusca) {
                    const registrosVindosDaApi = await api.get(`http://localhost:8081/api/confirmacao/usuario/${idParaBusca}`);

                    console.log("Registros recebidos:", registrosVindosDaApi);

                    setDados({
                        nome: getUserInfo().nome,
                        semana: "Maio/2026",
                        registros: Array.isArray(registrosVindosDaApi) ? registrosVindosDaApi : []
                    });
                }
            } catch (error) {
                console.error("Erro ao buscar:", error);
                setError(error.message);
            }
        };

        if (userRole) {
            fetchDados();
        }
    }, [userRole, dependenteId, usuarioId]);
    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1">
                <Sidebar className="w-64" type={type}/>
                <div className="flex-1 p-4 transition-all duration-300">
                    <RelatorioMedicacao dados={dados}/>
                </div>
            </div>
        </div>
    )

}
export default PaginaHistoricoDependentes;