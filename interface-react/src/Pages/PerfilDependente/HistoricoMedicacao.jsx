import RelatorioMedicacao from "../../Componentes/HistoricoMedicacoes";
import Sidebar from "../../Componentes/Sidebar";
import { useEffect, useState } from "react";
import api from "../../Service/api";
import { getUserInfo, getUserRole } from "../../Componentes/Auth/AuthToken";
import { useParams } from "react-router-dom";

const formatarHorarios = (frequenciaUso) => {
    if (!frequenciaUso) return "—";
    if (frequenciaUso.frequenciaUsoTipo === "HORARIOS_ESPECIFICOS") {
        const horarios = frequenciaUso.horariosEspecificos;
        if (horarios && horarios.length > 0) return horarios.map(h => h.substring(0, 5)).join(", ");
        if (frequenciaUso.primeiroHorario) return frequenciaUso.primeiroHorario.substring(0, 5);
    }
    if (frequenciaUso.frequenciaUsoTipo === "INTERVALO_ENTRE_DOSES") {
        const inicio = frequenciaUso.primeiroHorario?.substring(0, 5) || "—";
        return `A cada ${frequenciaUso.intervaloHoras}h (início: ${inicio})`;
    }
    return "—";
};

const PaginaHistoricoDependentes = () => {
    const userRole = getUserRole();
    const userInfo = getUserInfo();
    const { id } = useParams(); // id genérico — pode ser usuário ou dependente
    const type = userRole !== "PESSOAL";

    const [dados, setDados] = useState({ nome: "", semana: "", registros: [] });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDados = async () => {
            try {
                let medicamentos = [];
                let nomePaciente = "";

                if (userRole === "PESSOAL") {
                    // Usa o próprio id do token, ignora o da URL para segurança
                    medicamentos = await api.get(`http://localhost:8081/medicamentos/todos/${userInfo.id}`);
                    nomePaciente = userInfo.nome;
                } else if (userRole === "ADMINISTRADOR") {
                    // id da URL é o dependenteId
                    medicamentos = await api.get(`http://localhost:8081/medicamentos/todos/dependente/${id}`);
                    const dependente = await api.get(`http://localhost:8081/dependentes/buscar/${id}`);
                    nomePaciente = dependente.nome;
                }

                const registros = medicamentos.map(m => ({
                    nome: m.nome,
                    dosagem: m.dosagem,
                    horarios: formatarHorarios(m.frequenciaUso),
                    usoContinuo: m.frequenciaUso?.usoContinuo,
                    observacoes: m.observacoes || "—"
                }));

                setDados({
                    nome: nomePaciente,
                    semana: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
                    registros
                });

            } catch (err) {
                console.error("Erro ao buscar:", err);
                setError(err.message);
            }
        };

        if (userRole) fetchDados();
    }, [userRole, id]);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1">
                <Sidebar className="w-64" type={type} />
                <div className="flex-1 p-4 transition-all duration-300">
                    {error ? (
                        <p className="text-red-500 p-4">Erro ao carregar dados: {error}</p>
                    ) : (
                        <RelatorioMedicacao dados={dados} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaginaHistoricoDependentes;