import {useState, useMemo, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import api from "../../Service/api";
import {getUserInfo} from "../../Componentes/Auth/AuthToken";

const CadastroMedicamentos = () => {

    const [dependentes, setDependentes] = useState([]);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        nome: "",
        principioAtivo: "",
        dosagem: "",
        observacoes: "",
        frequenciaUso: {
            frequenciaUsoTipo: "",
            usoContinuo: null,
            intervaloHoras: 0,
            horariosEspecificos: [],
            primeiroHorario: "",
            dataInicio: "",
            dataTermino: ""
        },
    });
    const usuarioId = getUserInfo().id// Supondo que o ID do usuário está no localStorage
    const {dependenteId} = useParams() // Supondo que o ID do dependente está no localStorage
    console.log("usuarioId:", usuarioId);
    console.log("dependenteId:", dependenteId);

    const [dosagemErro, setDosagemErro] = useState(""); // Estado para mensagem de erro

// Regex para validar entrada (ex: 500mg, 10ml, 2g, 1.5L, 250mcg)
    const dosagemRegex = /^[0-9]+(\.[0-9]+)?(mg|g|ml|L|mcg)$/;

// Função de validação
    const handleDosagemChange = (e) => {
        const { value } = e.target;

        if (value === "" || dosagemRegex.test(value)) {
            setDosagemErro(""); // Remove erro se o valor for válido
        } else {
            setDosagemErro("Formato inválido! Ex: 500mg, 10ml, 2g, 1.5L");
        }

        setFormData((prevState) => ({
            ...prevState,
            dosagem: value
        }));
    };


    useEffect(() => {
        const fetchDependentes = async () => {
            try {
                const data = await api.get("http://localhost:8081/dependentes/buscar/todos");
                setDependentes(data.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchDependentes();
    }, []);

    const navigate = useNavigate();

    // Função para atualizar o estado do formulário
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Verifica se o campo pertence a `frequenciaUso`
        const isFrequenciaUsoField = Object.keys(formData.frequenciaUso).includes(name);

        if (name === "dosagem") {
            if (value === "" || dosagemRegex.test(value)) {
                setDosagemErro(""); // Remove erro se válido
            } else {
                setDosagemErro("Formato inválido! Ex: 500mg, 10ml, 2g, 1.5L");
            }
        }

        setFormData((prevState) => {
            if (isFrequenciaUsoField) {
                return {
                    ...prevState,
                    frequenciaUso: {
                        ...prevState.frequenciaUso,
                        [name]: name === "usoContinuo" ? value === "true" : type === "checkbox" ? checked : value,
                    },
                };
            } else {
                return {
                    ...prevState,
                    [name]: type === "checkbox" ? checked : value,
                };
            }
        });
    };

    // Função para adicionar um horário à lista de horários específicos
    const adicionarHorario = () => {
        if (formData.frequenciaUso.primeiroHorario) {
            setFormData((prevState) => ({
                ...prevState,
                frequenciaUso: {
                    ...prevState.frequenciaUso,
                    horariosEspecificos: [
                        ...prevState.frequenciaUso.horariosEspecificos,
                        prevState.frequenciaUso.primeiroHorario
                    ],
                    primeiroHorario: "", // Limpa o campo após adicionar
                }
            }));
        } else {
            alert('Por favor, insira um horário antes de adicionar.');
        }
    };

    // Função para remover um horário da lista de horários específicos
    const removerHorario = (index) => {
        setFormData((prevState) => ({
            ...prevState,
            frequenciaUso: {
                ...prevState.frequenciaUso,
                horariosEspecificos: prevState.frequenciaUso.horariosEspecificos.filter((_, i) => i !== index)
            }
        }));
    };

    // Campos base do formulário
    const camposBase = [
        { type: "text", id: "nome", label: "Nome do Remédio:", name: "nome", placeholder: "Digite o nome do medicamento..." },
        { type: "text", id: "principioAtivo", label: "Princípio Ativo:", name: "principioAtivo", placeholder: "Digite o princípio ativo" },
        { type: "text", id: "dosagem", label: "Dosagem:", name: "dosagem", placeholder: "Dosagem..." },
        { type: "textarea", id: "observacoes", label: "Observações:", name: "observacoes" },
        {
            type: "select", id: "usoContinuo", label: "Uso Contínuo?", name: "usoContinuo",
            options: [
                { value: "", text: "Selecione..." },
                { value: true, text: "Sim" },
                { value: false, text: "Não" }
            ]
        },
        {
            type: "select", id: "frequenciaUsoTipo", label: "Tipo de Frequência", name: "frequenciaUsoTipo",
            options: [
                { value: "", text: "Selecione..." },
                { value: "HORARIOS_ESPECIFICOS", text: "Horário Específico" },
                { value: "INTERVALO_ENTRE_DOSES", text: "Intervalo entre doses" }
            ]
        }
    ];

    // Campos extras baseados no estado
    const camposExtras = useMemo(() => {
        let extras = [];

        // Se não for uso contínuo, exibe campos de data de início e término
        if (formData.frequenciaUso.usoContinuo === false) {
            extras.push(
                { type: "date", id: "dataInicio", label: "Data de Início:", name: "dataInicio" },
                { type: "date", id: "dataTermino", label: "Data de Término:", name: "dataTermino" }
            );
        }

        // Se for horários específicos, exibe campo para adicionar horários
        if (formData.frequenciaUso.frequenciaUsoTipo === "HORARIOS_ESPECIFICOS") {
            extras.push({
                type: "time",
                id: "primeiroHorario",
                label: "Adicionar Horário:",
                name: "primeiroHorario",
                value: formData.frequenciaUso.primeiroHorario || "",
                onChange: handleChange
            });
        }

        // Se for intervalo entre doses, exibe campos de primeiro horário e intervalo em horas
        if (formData.frequenciaUso.frequenciaUsoTipo === "INTERVALO_ENTRE_DOSES") {
            extras.push(
                { type: "time", id: "primeiroHorario", label: "Primeiro Horário:", name: "primeiroHorario" },
                { type: "number", id: "intervaloHoras", label: "Intervalo entre as doses (em horas):", name: "intervaloHoras" }
            );
        }

        return extras;
    }, [formData.frequenciaUso]);

    // Função para enviar o formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome || !formData.principioAtivo || !formData.dosagem) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Recupera o ID do usuário e do dependente (exemplo)

        const dadosCadastro = {
            nome: formData.nome,
            principioAtivo: formData.principioAtivo,
            dosagem: formData.dosagem,
            observacoes: formData.observacoes,
            usuarioId: usuarioId,
            dependenteId: dependenteId,
            frequenciaUso: {
                frequenciaUsoTipo: formData.frequenciaUso.frequenciaUsoTipo,
                usoContinuo: formData.frequenciaUso.usoContinuo,
                intervaloHoras: formData.frequenciaUso.intervaloHoras,
                horariosEspecificos: formData.frequenciaUso.horariosEspecificos,
                primeiroHorario: formData.frequenciaUso.primeiroHorario,
                dataInicio: formData.frequenciaUso.dataInicio,
                dataTermino: formData.frequenciaUso.dataTermino
            },
        };

        try {
            const token = localStorage.getItem('token');
            console.log("Token JWT:", token);
            console.log("Dados enviados ao backend:", dadosCadastro);
            const sucesso = await api.post("http://localhost:8081/medicamentos/cadastro", dadosCadastro)
            console.log("Resposta do servidor:", sucesso);
            console.log("Medicamento cadastrado com sucesso!");
            if (sucesso) {
                navigate(`/perfil_dependente/${dependenteId}`);
            }
        } catch (error) {
            console.error('Erro ao cadastrar medicamento:', error);
            alert('Erro ao cadastrar medicamento. Verifique sua conexão ou tente novamente mais tarde.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-semibold mb-4">Cadastro de Medicamento</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="flex flex-col gap-4">
                    {[...camposBase, ...camposExtras].map((campo) => (
                        <div key={campo.id} className="flex flex-col">
                            <label className="text-left text-gray-700 font-medium" htmlFor={campo.id}>
                                {campo.label}
                            </label>
                            {campo.type === "select" ? (
                                <select
                                    id={campo.id}
                                    name={campo.name}
                                    value={
                                        campo.name in formData.frequenciaUso
                                            ? formData.frequenciaUso[campo.name] || ""
                                            : formData[campo.name] || ""
                                    }
                                    onChange={handleChange}
                                    className="border p-2 border-blue-400 rounded-lg"
                                >
                                    {campo.options.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.text}
                                        </option>
                                    ))}
                                </select>
                            ) : campo.type === "textarea" ? (
                                <textarea
                                    id={campo.id}
                                    name={campo.name}
                                    value={formData[campo.name] || ""}
                                    onChange={handleChange}
                                    className="border p-2 border-blue-400 rounded-lg"
                                    placeholder={campo.placeholder}
                                />
                            ) : (
                                <input
                                    type={campo.type}
                                    id={campo.id}
                                    name={campo.name}
                                    value={
                                        campo.name in formData.frequenciaUso
                                            ? formData.frequenciaUso[campo.name] || ""
                                            : formData[campo.name] || ""
                                    }
                                    onChange={handleChange}
                                    className="border p-2 border-blue-400 rounded-lg"
                                    placeholder={campo.placeholder}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Botão para adicionar horários específicos */}
                {formData.frequenciaUso.frequenciaUsoTipo === "HORARIOS_ESPECIFICOS" && (
                    <div className="flex items-center gap-2 mt-4">
                        <button
                            type="button"
                            onClick={adicionarHorario}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            Adicionar Horário
                        </button>
                    </div>
                )}

                {/* Exibir lista de horários específicos */}
                {formData.frequenciaUso.frequenciaUsoTipo === "HORARIOS_ESPECIFICOS" &&
                    formData.frequenciaUso.horariosEspecificos.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Horários Adicionados:</h3>
                            <ul className="list-disc list-inside">
                                {formData.frequenciaUso.horariosEspecificos.map((horario, index) => (
                                    <li key={index} className="flex items-center justify-between">
                                        <span>{horario}</span>
                                        <button
                                            type="button"
                                            onClick={() => removerHorario(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Remover
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                {/* Botões do formulário */}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Salvar
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                        Voltar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CadastroMedicamentos;