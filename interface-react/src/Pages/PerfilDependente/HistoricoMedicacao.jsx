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
                if (userRole === "ADMINISTRADOR") {
                    const response = await api.get(`http://localhost:8081/dependentes/buscar/${dependenteId}`);
                    setDados(response);
                    console.log("Dados: "+ response)
                } else if (userRole === "PESSOAL" && usuarioId) { // Garante que usuarioId não seja undefined
                    console.log("ID do usuário:", usuarioId);
                    const response = await api.get(`http://localhost:8081/usuarios/buscar/${usuarioId}`);
                    setDados(response);

                }
            } catch (error) {
                setError(error.message);
            }
        };

        if (userRole) { // Só chama a função se o userRole estiver definido
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